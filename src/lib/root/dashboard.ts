import { conflict, notFound, ok, type Failure, type Result } from '../kernel';
import { type Plan } from '../chaos';
import { createRoot } from './index';
import type { MemoryRequest, MemoryRoute } from '../http';
import { listSessions, revokeSession, type SessionSummary, type User } from '../services/session';

const DEMO_TOKEN = 'astro-demo-session';
const CURRENT_ID = 'ses_astro_current';

const DEMO_USER: User = {
	id: 'u_astro',
	email: 'ada@example.com',
	name: 'Ada Lovelace'
};

const initialSessions = (): SessionSummary[] => [
	{ id: CURRENT_ID, createdAt: '2026-09-15T08:30:00.000Z', current: true },
	{ id: 'ses_astro_laptop', createdAt: '2026-09-14T16:10:00.000Z', current: false },
	{ id: 'ses_astro_phone', createdAt: '2026-09-12T11:45:00.000Z', current: false }
];

const requestToken = (request: MemoryRequest): Result<string, Failure> =>
	request.token === DEMO_TOKEN
		? ok(DEMO_TOKEN)
		: {
				ok: false,
				error: {
					kind: 'unauthenticated',
					message: 'Sign in to continue.',
					status: 401
				}
		  };

/** The real sibling dashboard is behind auth. Astro's auth UI is intentionally
 * still a later port, so this route uses an isolated, service-backed demo root
 * with the same read/revoke contracts. */
export function createDashboardExample(options: { latencyMs?: number; chaos?: Plan } = {}) {
	let sessions = initialSessions();
	const routes: MemoryRoute[] = [
		{
			method: 'GET',
			pattern: /^\/auth\/sessions$/,
			handle: (request): Result<SessionSummary[], Failure> => {
				const token = requestToken(request);
				return token.ok ? ok([...sessions]) : token;
			}
		},
		{
			method: 'DELETE',
			pattern: /^\/auth\/sessions\/([^/]+)$/,
			handle: (request, match): Result<null, Failure> => {
				const token = requestToken(request);
				if (!token.ok) return token;
				const id = decodeURIComponent(match[1]);
				const target = sessions.find((session) => session.id === id);
				if (!target) return { ok: false, error: notFound('That session has already ended.', { status: 404 }) };
				if (target.current) return { ok: false, error: conflict('That is the session you are using. Sign out instead.', { status: 409 }) };
				sessions = sessions.filter((session) => session.id !== id);
				return ok(null);
			}
		}
	];

	const root = createRoot({
		routes,
		token: DEMO_TOKEN,
		latencyMs: options.latencyMs ?? 180,
		chaos: options.chaos
	});
	const client = root.clientFor('session');

	return {
		...root,
		user: DEMO_USER,
		readSessions: (signal?: AbortSignal) => listSessions(client, { signal }),
		revokeSession: (id: string, signal?: AbortSignal) => revokeSession(client, id, { signal })
	};
}
