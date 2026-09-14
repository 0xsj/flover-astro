import {
	conflict,
	err,
	invalid,
	notFound,
	ok,
	rateLimited,
	unauthenticated,
	type Failure,
	type Result
} from '../../kernel';
import { requireToken, type MemoryRoute } from '../../http';
import { record } from '../ledger';
import { MIN_PASSWORD, type Session, type SessionSummary, type User } from './session.types';

type StoredUser = User & { password: string };
type StoredSession = { id: string; userId: string; token: string; createdAt: number };

const users = new Map<string, StoredUser>();
const sessions = new Map<string, StoredSession>();
const failedAttempts = new Map<string, number>();

const ATTEMPT_LIMIT = 5;
const RETRY_AFTER_SECONDS = 30;
const DEFAULT_SESSION_TTL_MS = 30 * 60 * 1000;

const ttlMs = (): number => {
	const environment = (
		globalThis as { process?: { env?: Record<string, string | undefined> } }
	).process?.env;
	return Number(environment?.FLOVER_SESSION_TTL_MS) || DEFAULT_SESSION_TTL_MS;
};

const isExpired = (session: StoredSession): boolean => Date.now() - session.createdAt > ttlMs();

function liveSession(token: string): StoredSession | undefined {
	const session = sessions.get(token);
	if (!session) return undefined;
	if (!isExpired(session)) return session;
	sessions.delete(token);
	return undefined;
}

const newId = (): string =>
	globalThis.crypto?.randomUUID?.() ?? `id-${Math.random().toString(36).slice(2, 10)}`;

const normalise = (email: string) => email.trim().toLowerCase();

export const DEMO_CREDENTIALS = { email: 'ada@example.com', password: 'password' };

function seed(): void {
	if (users.size) return;
	users.set(normalise(DEMO_CREDENTIALS.email), {
		id: 'u_ada',
		name: 'Ada Lovelace',
		email: DEMO_CREDENTIALS.email,
		password: DEMO_CREDENTIALS.password
	});
}

export function resetSessionFixtures(): void {
	users.clear();
	sessions.clear();
	failedAttempts.clear();
	seed();
}

const issue = (user: StoredUser): Session => {
	const token = `tok_${newId()}`;
	sessions.set(token, {
		id: `ses_${newId()}`,
		userId: user.id,
		token,
		createdAt: Date.now()
	});
	return { token, user: { id: user.id, email: user.email, name: user.name } };
};

const byId = (id: string): StoredUser | undefined => [...users.values()].find((user) => user.id === id);

function readBody(body: unknown): Record<string, unknown> {
	return body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
}

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

export const sessionRoutes: MemoryRoute[] = [
	{
		method: 'POST',
		pattern: /^\/auth\/sign-in$/,
		latencyMs: { min: 320, max: 700 },
		handle: (req): Result<Session, Failure> => {
			seed();
			const body = readBody(req.body);
			const email = normalise(str(body.email));
			const password = str(body.password);

			if (!email || !password) {
				return err(
					invalid('Check the form.', {
						...(email ? {} : { email: 'An email address is required.' }),
						...(password ? {} : { password: 'Enter your password.' })
					}, { status: 422 })
				);
			}

			if ((failedAttempts.get(email) ?? 0) >= ATTEMPT_LIMIT) {
				return err(
					rateLimited('Too many attempts. Try again shortly.', RETRY_AFTER_SECONDS, { status: 429 })
				);
			}

			const user = users.get(email);
			if (!user || user.password !== password) {
				const attempt = (failedAttempts.get(email) ?? 0) + 1;
				failedAttempts.set(email, attempt);
				record({
					scope: 'session',
					action: 'session.sign_in_failed',
					subject: email,
					actor: 'anonymous',
					correlationId: req.correlationId,
					detail: { reason: 'wrong_password', attempt }
				});
				return err(unauthenticated('That email and password do not match.', { status: 401 }));
			}

			failedAttempts.delete(email);
			record({
				scope: 'session',
				action: 'session.signed_in',
				subject: user.email,
				actor: user.email,
				correlationId: req.correlationId,
				detail: {}
			});
			return ok(issue(user));
		}
	},
	{
		method: 'POST',
		pattern: /^\/auth\/sign-up$/,
		latencyMs: { min: 380, max: 800 },
		handle: (req): Result<Session, Failure> => {
			seed();
			const body = readBody(req.body);
			const email = normalise(str(body.email));
			const name = str(body.name).trim();
			const password = str(body.password);
			const fields: Record<string, string> = {};
			if (!name) fields.name = 'A name is required.';
			if (!email) fields.email = 'An email address is required.';
			if (password.length < MIN_PASSWORD) {
				fields.password = `At least ${MIN_PASSWORD} characters.`;
			}
			if (Object.keys(fields).length) return err(invalid('Check the form.', fields, { status: 422 }));
			if (users.has(email)) {
				return err(conflict('An account with that email already exists.', { status: 409 }));
			}

			const user: StoredUser = {
				id: `u_${newId()}`,
				name,
				email: str(body.email).trim(),
				password
			};
			users.set(email, user);
			record({
				scope: 'account',
				action: 'account.created',
				subject: user.email,
				actor: 'anonymous',
				correlationId: req.correlationId,
				detail: { via: 'sign-up' }
			});
			record({
				scope: 'session',
				action: 'session.signed_in',
				subject: user.email,
				actor: user.email,
				correlationId: req.correlationId,
				detail: {}
			});
			return ok(issue(user));
		}
	},
	{
		method: 'POST',
		pattern: /^\/auth\/sign-out$/,
		handle: (req): Result<null, Failure> => {
			const ending = req.token ? sessions.get(req.token) : undefined;
			if (ending) {
				const user = byId(ending.userId);
				record({
					scope: 'session',
					action: 'session.signed_out',
					subject: ending.id,
					actor: user?.email ?? 'unknown',
					correlationId: req.correlationId,
					detail: {}
				});
			}
			if (req.token) sessions.delete(req.token);
			return ok(null);
		}
	},
	{
		method: 'GET',
		pattern: /^\/auth\/me$/,
		handle: (req): Result<User, Failure> => {
			seed();
			const token = requireToken(req);
			if (!token.ok) return err(token.error);
			const session = liveSession(token.value);
			const user = session ? byId(session.userId) : undefined;
			if (!user) return err(unauthenticated('That session has expired.', { status: 401 }));
			return ok({ id: user.id, email: user.email, name: user.name });
		}
	},
	{
		method: 'GET',
		pattern: /^\/auth\/sessions$/,
		latencyMs: { min: 140, max: 420 },
		handle: (req): Result<SessionSummary[], Failure> => {
			seed();
			const token = requireToken(req);
			if (!token.ok) return err(token.error);
			const mine = liveSession(token.value);
			if (!mine) return err(unauthenticated('That session has expired.', { status: 401 }));
			return ok(
				[...sessions.values()]
					.filter((session) => session.userId === mine.userId && !isExpired(session))
					.sort((a, b) => b.createdAt - a.createdAt)
					.map(({ id, createdAt, token: sessionToken }) => ({
						id,
						createdAt: new Date(createdAt).toISOString(),
						current: sessionToken === token.value
					}))
			);
		}
	},
	{
		method: 'DELETE',
		pattern: /^\/auth\/sessions\/([^/]+)$/,
		latencyMs: { min: 200, max: 520 },
		handle: (req, match): Result<null, Failure> => {
			seed();
			const token = requireToken(req);
			if (!token.ok) return err(token.error);
			const mine = liveSession(token.value);
			if (!mine) return err(unauthenticated('That session has expired.', { status: 401 }));
			const id = decodeURIComponent(match[1]);
			const target = [...sessions.values()].find(
				(session) => session.id === id && session.userId === mine.userId && !isExpired(session)
			);
			if (!target) return err(notFound('That session has already ended.', { status: 404 }));
			if (target.token === token.value) {
				return err(conflict('That is the session you are using. Sign out instead.', { status: 409 }));
			}

			sessions.delete(target.token);
			record({
				scope: 'session',
				action: 'session.revoked',
				subject: target.id,
				actor: byId(mine.userId)?.email ?? 'unknown',
				correlationId: req.correlationId,
				detail: { revoked_by: mine.id }
			});
			return ok(null);
		}
	}
];
