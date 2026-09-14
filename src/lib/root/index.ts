import { withChaos, type Plan } from '../chaos';
import {
	createFetchClient,
	createMemoryClient,
	withDiagnostics,
	type HttpClient,
	type Latency,
	type MemoryRoute
} from '../http';
import { routes as defaultRoutes } from './fixtures';

/** Every domain this application has. A product edits this list. */
export type Domain = 'session' | 'ledger' | 'example';

export const DOMAINS: readonly Domain[] = ['session', 'ledger', 'example'];

export type RootOptions = {
	/** Absent means all domains use the memory route table. */
	baseUrl?: string;
	/** Domains that have graduated to a real backend. */
	served?: readonly Domain[];
	/** Bearer for this interaction. Read once per root, not per request. */
	token?: string | null;
	/** Caller-owned fixture override, useful for tests and examples. */
	routes?: readonly MemoryRoute[];
	/** Fixture latency; zero is useful for tests. */
	latencyMs?: Latency;
	/** Shared by every call made through this root. */
	correlationId?: string;
	/** Ignored in production by the chaos decorator. */
	chaos?: Plan;
};

/** One root per interaction: server render, browser action, or isolated test. */
export type Root = {
	/** Select the shared transport for a domain. */
	clientFor: (domain: Domain) => HttpClient;
	/** The id every call through this root carries. */
	correlationId: string;
	/** Whether this domain is currently answered by fixtures. */
	usingFixtures: (domain: Domain) => boolean;
	/** Whether no domain is currently using a backend. */
	allFixtures: boolean;
	/** Whether the root wrapped its clients with an active chaos plan. */
	underChaos: boolean;
};

const newId = (): string =>
	globalThis.crypto?.randomUUID?.() ?? `cid-${Math.random().toString(36).slice(2, 10)}`;

/** The only function that selects memory versus network adapters. */
export function createRoot(options: RootOptions = {}): Root {
	const correlationId = options.correlationId ?? newId();
	const token = options.token ?? null;
	const served = options.served ?? DOMAINS;
	const hasBackend = Boolean(options.baseUrl);

	const usingFixtures = (domain: Domain): boolean => !hasBackend || !served.includes(domain);

	let memory: HttpClient | undefined;
	let network: HttpClient | undefined;
	let chaosApplied = false;

	const wrap = (client: HttpClient): HttpClient => {
		const wrapped = withChaos(client, options.chaos, correlationId);
		if (wrapped !== client) chaosApplied = true;
		return withDiagnostics(wrapped);
	};

	const clientFor = (domain: Domain): HttpClient => {
		if (usingFixtures(domain)) {
			memory ??= wrap(
				createMemoryClient({
					routes: options.routes ?? defaultRoutes,
					latencyMs: options.latencyMs,
					getAccessToken: () => token,
					getCorrelationId: () => correlationId
				})
			);
			return memory;
		}

		network ??= wrap(
			createFetchClient({
				baseUrl: options.baseUrl!,
				getAccessToken: () => token,
				getCorrelationId: () => correlationId
			})
		);
		return network;
	};

	/* Build one client eagerly so `underChaos` is accurate before the first call. */
	clientFor(DOMAINS[0]);

	return {
		clientFor,
		correlationId,
		usingFixtures,
		allFixtures: !hasBackend || served.length === 0,
		underChaos: chaosApplied
	};
}

export { routes } from './fixtures';
