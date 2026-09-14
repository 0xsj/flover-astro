import type { APIContext } from 'astro';
import { parsePlan } from '../chaos';
import { type Presence, type TransportFailure } from '../kernel';
import { createRoot, DOMAINS, type Domain, type Root } from '../root';
import { currentUser, type User } from '../services/session';
import { readSessionToken } from './session';

type ServerContext = Pick<APIContext, 'cookies' | 'locals' | 'url'>;
type RuntimeEnvironment = { env?: Record<string, string | undefined> };

const environment = (): Record<string, string | undefined> =>
	(globalThis as { process?: RuntimeEnvironment }).process?.env ?? {};

function servedDomains(): readonly Domain[] | undefined {
	const raw = environment().API_SERVED_DOMAINS?.trim();
	if (!raw) return undefined;
	const named = new Set(raw.split(',').map((value) => value.trim()));
	return DOMAINS.filter((domain) => named.has(domain));
}

/** One root per Astro request, memoized in `locals` rather than module state. */
export function serverRoot(context: ServerContext): Root {
	return (context.locals.root ??= createRoot({
		baseUrl: environment().API_BASE_URL || undefined,
		served: servedDomains(),
		latencyMs: environment().NODE_ENV === 'test' ? 0 : undefined,
		token: readSessionToken(context),
		chaos:
			environment().NODE_ENV === 'production'
				? undefined
				: parsePlan(context.url.searchParams)
	}));
}

/** Three session facts: found, explicitly signed out, or not measurable. */
export function currentSession(
	context: ServerContext
): Promise<Presence<User, TransportFailure>> {
	return (context.locals.session ??= (async () => {
		if (!readSessionToken(context)) return { state: 'empty' };
		const result = await currentUser(serverRoot(context).clientFor('session'));
		if (result.ok) return { state: 'found', value: result.value };
		return result.error.kind === 'unauthenticated' || result.error.kind === 'forbidden'
			? { state: 'empty' }
			: { state: 'unmeasured', failure: result.error };
	})());
}
