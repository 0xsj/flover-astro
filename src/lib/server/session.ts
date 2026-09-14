import type { APIContext } from 'astro';

/** Scoped to this application so sibling Flover projects can run locally on
 * the same origin without overwriting one another's cookies. */
export const SESSION_COOKIE = 'flover_astro_session';
const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

type CookieContext = Pick<APIContext, 'cookies' | 'url'>;

/** Readable only from server-rendered Astro code and endpoint handlers. */
export function readSessionToken(context: Pick<APIContext, 'cookies'>): string | null {
	return context.cookies.get(SESSION_COOKIE)?.value ?? null;
}

/** The service returns the token; this boundary decides to store it HttpOnly. */
export function startSession(context: CookieContext, token: string): void {
	context.cookies.set(SESSION_COOKIE, token, {
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		secure: context.url.protocol === 'https:',
		maxAge: WEEK_IN_SECONDS
	});
}

/** Clear the browser half independently of the server-side revoke attempt. */
export function endSession(context: Pick<APIContext, 'cookies'>): void {
	context.cookies.delete(SESSION_COOKIE, { path: '/' });
}
