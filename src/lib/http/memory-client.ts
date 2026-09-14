import { canceled, err, internal, ok, unauthenticated, type Failure, type Result } from '../kernel';
import type { ClientConfig, HttpClient, RequestOptions } from './port';

/** The memory adapter reproduces server refusals as well as success paths. */
export const UNSERVED_ROUTE = 'unserved_route';

const newRequestId = (): string =>
	`req_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;

export type Latency = number | { min: number; max: number };

const delayFor = (latency: Latency | undefined): number => {
	if (latency === undefined) return 60 + Math.random() * 140;
	if (typeof latency === 'number') return latency;
	return latency.min + Math.random() * Math.max(0, latency.max - latency.min);
};

export type MemoryRequest = {
	method: string;
	path: string;
	params: RequestOptions['params'];
	body: unknown;
	token: string | null;
	correlationId: string | undefined;
	requestId: string;
};

export type MemoryRoute = {
	method: string;
	pattern: RegExp;
	latencyMs?: Latency;
	handle: (
		request: MemoryRequest,
		match: RegExpMatchArray
	) => Result<unknown, Failure> | Promise<Result<unknown, Failure>>;
};

export type MemoryConfig = {
	routes: readonly MemoryRoute[];
	getAccessToken?: ClientConfig['getAccessToken'];
	getCorrelationId?: ClientConfig['getCorrelationId'];
	latencyMs?: Latency;
};

/** Sleep, but abortable. */
function sleep(ms: number, signal?: AbortSignal): Promise<'done' | 'aborted'> {
	if (signal?.aborted) return Promise.resolve('aborted');
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort);
			resolve('done');
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			resolve('aborted');
		};
		signal?.addEventListener('abort', onAbort, { once: true });
	});
}

export function createMemoryClient(config: MemoryConfig): HttpClient {
	const request = async <T>(
		method: string,
		path: string,
		options: RequestOptions = {}
	): Promise<Result<T, Failure>> => {
		const correlationId = config.getCorrelationId?.() ?? undefined;
		const requestId = newRequestId();
		const route = config.routes.find((entry) => entry.method === method && entry.pattern.test(path));

		if (
			(await sleep(delayFor(config.latencyMs ?? route?.latencyMs), options.signal)) === 'aborted'
		) {
			return err(canceled('The request was cancelled.', { correlationId, requestId }));
		}

		const stamp = (failure: Failure): Failure => {
			const withRequestId = { ...failure, requestId: failure.requestId ?? requestId };
			const id = failure.correlationId ?? correlationId;
			return id === undefined ? withRequestId : { ...withRequestId, correlationId: id };
		};

		if (!route) {
			return err(
				stamp(internal(`No fixture route for ${method} ${path}`, { type: UNSERVED_ROUTE }))
			);
		}

		const answered = (await route.handle(
			{
				method,
				path,
				params: options.params,
				body: options.body,
				token: config.getAccessToken?.() ?? null,
				correlationId,
				requestId
			},
			path.match(route.pattern)!
		)) as Result<T, Failure>;

		return answered.ok ? answered : err(stamp(answered.error));
	};

	return {
		request,
		get: (path, options) => request('GET', path, options),
		post: (path, options) => request('POST', path, options),
		put: (path, options) => request('PUT', path, options),
		patch: (path, options) => request('PATCH', path, options),
		delete: (path, options) => request('DELETE', path, options)
	};
}

/** A fixture route's authentication guard. */
export const requireToken = (request: MemoryRequest): Result<string, Failure> =>
	request.token ? ok(request.token) : err(unauthenticated('Sign in to continue.', { status: 401 }));
