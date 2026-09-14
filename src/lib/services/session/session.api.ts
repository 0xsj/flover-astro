import { err, invalid, narrow, type Fails, type Result, type TransportFailure } from '../../kernel';
import type { CallOptions, HttpClient } from '../../http';
import { decodeSession, decodeSessions, decodeUser } from './session.responses';
import {
	MIN_PASSWORD,
	type Credentials,
	type Registration,
	type Session,
	type SessionSummary,
	type User
} from './session.types';

export type SignInFailure = TransportFailure | Fails<'invalid'>;
export type SignUpFailure = TransportFailure | Fails<'invalid' | 'conflict'>;
export type RevokeFailure = TransportFailure | Fails<'not_found' | 'conflict'>;

const asSignIn = narrow('invalid');
const asSignUp = narrow('invalid', 'conflict');
const asRevoke = narrow('not_found', 'conflict');
const asTransport = narrow<never>();

const emailProblem = (email: string): string | undefined =>
	!email
		? 'An email address is required.'
		: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
			? 'That does not look like an email address.'
			: undefined;

export async function signIn(
	client: HttpClient,
	credentials: Credentials,
	options?: CallOptions
): Promise<Result<Session, SignInFailure>> {
	const email = credentials.email.trim();
	const fields: Record<string, string> = {};
	const problem = emailProblem(email);
	if (problem) fields.email = problem;
	if (!credentials.password) fields.password = 'Enter your password.';
	if (Object.keys(fields).length) return err(invalid('Check the form.', fields));

	return (
		await client.post<unknown>('/auth/sign-in', {
			body: { email, password: credentials.password },
			signal: options?.signal,
			trace: options?.trace
		})
	)
		.andThen((value) => decodeSession(value, options?.trace))
		.mapErr(asSignIn);
}

export async function signUp(
	client: HttpClient,
	registration: Registration,
	options?: CallOptions
): Promise<Result<Session, SignUpFailure>> {
	const name = registration.name.trim();
	const email = registration.email.trim();
	const fields: Record<string, string> = {};
	if (!name) fields.name = 'A name is required.';
	const problem = emailProblem(email);
	if (problem) fields.email = problem;
	if (registration.password.length < MIN_PASSWORD) {
		fields.password = `At least ${MIN_PASSWORD} characters.`;
	}
	if (Object.keys(fields).length) return err(invalid('Check the form.', fields));

	return (
		await client.post<unknown>('/auth/sign-up', {
			body: { name, email, password: registration.password },
			signal: options?.signal,
			trace: options?.trace
		})
	)
		.andThen((value) => decodeSession(value, options?.trace))
		.mapErr(asSignUp);
}

/** Who the bearer belongs to. Missing or expired credentials are transport
 * failures, so callers cannot silently narrow them away. */
export async function currentUser(
	client: HttpClient,
	options?: CallOptions
): Promise<Result<User, TransportFailure>> {
	return (await client.get<unknown>('/auth/me', options))
		.andThen((value) => decodeUser(value, options?.trace))
		.mapErr(asTransport);
}

/** Every session belonging to the current account, newest first. */
export async function listSessions(
	client: HttpClient,
	options?: CallOptions
): Promise<Result<SessionSummary[], TransportFailure>> {
	return (await client.get<unknown>('/auth/sessions', options))
		.andThen((value) => decodeSessions(value, options?.trace))
		.mapErr(asTransport);
}

/** End another session. Already-gone and current-session cases remain distinct. */
export async function revokeSession(
	client: HttpClient,
	id: string,
	options?: CallOptions
): Promise<Result<null, RevokeFailure>> {
	return (
		await client.delete<unknown>(`/auth/sessions/${encodeURIComponent(id)}`, options)
	)
		.map(() => null)
		.mapErr(asRevoke);
}

/** End the server session. The caller separately forgets its local token. */
export async function signOut(
	client: HttpClient,
	options?: CallOptions
): Promise<Result<null, TransportFailure>> {
	return (await client.post<unknown>('/auth/sign-out', options))
		.map(() => null)
		.mapErr(asTransport);
}
