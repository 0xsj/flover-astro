import { err, internal, ok, type Failure, type Result } from '../kernel';
import { failureFromResponse, failureFromTransport } from './envelope';
import {
	CORRELATION_HEADER,
	joinUrl,
	queryString,
	type ClientConfig,
	type HttpClient,
	type RequestOptions
} from './port';

const DEFAULT_TIMEOUT = 15_000;

function url(baseUrl: string, path: string, params: RequestOptions['params']): string {
	const result = new URL(joinUrl(baseUrl, path));
	for (const [key, value] of new URLSearchParams(queryString(params))) {
		result.searchParams.set(key, value);
	}
	return result.toString();
}

/** Preserve the correlation id sent by this client when the server does not
 * echo one. A server echo always wins. */
function withCorrelation(failure: Failure, correlationId: string | undefined): Failure {
	if (failure.correlationId !== undefined) return failure;
	if (correlationId === undefined) return failure;
	return { ...failure, correlationId };
}

/** Never throws. Every exit is a Result. */
export function createFetchClient(config: ClientConfig): HttpClient {
	const decode = config.decodeFailure ?? failureFromResponse;

	const request = async <T>(
		method: string,
		path: string,
		options: RequestOptions = {}
	): Promise<Result<T, Failure>> => {
		const signals = [
			AbortSignal.timeout(options.timeoutMs ?? config.timeoutMs ?? DEFAULT_TIMEOUT)
		];
		if (options.signal) signals.push(options.signal);

		const correlationId = config.getCorrelationId?.() ?? undefined;
		let response: Response;
		try {
			const token = config.getAccessToken?.();
			response = await fetch(url(config.baseUrl, path, options.params), {
				method,
				signal: AbortSignal.any(signals),
				headers: {
					...(options.body === undefined ? {} : { 'content-type': 'application/json' }),
					...(token ? { authorization: `Bearer ${token}` } : {}),
					...(correlationId ? { [CORRELATION_HEADER]: correlationId } : {}),
					...options.headers
				},
				body: options.body === undefined ? undefined : JSON.stringify(options.body)
			});
		} catch (cause) {
			return err(withCorrelation(failureFromTransport(cause), correlationId));
		}

		if (!response.ok) return err(withCorrelation(await decode(response), correlationId));
		if (response.status === 204) return ok(undefined as T);

		/* A malformed 2xx body is a contract failure, not an unavailable server. */
		try {
			return ok((await response.json()) as T);
		} catch {
			return err(internal("The server's response could not be read.", { status: response.status }));
		}
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
