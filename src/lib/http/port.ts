import type { Failure, Result } from '../kernel';
import type { DiagnosticTrace } from '../diagnostics';

/** Turn a non-2xx response into exactly one Failure. It must never throw. */
export type FailureDecoder = (response: Response) => Promise<Failure>;

export type ClientConfig = {
	/** Origin plus any mount path. A trailing slash is ignored; request paths are
	 * appended, never resolved against it. */
	baseUrl: string;
	timeoutMs?: number;
	/** Read lazily on every request so a refreshed token is picked up without
	 * rebuilding the client. */
	getAccessToken?: () => string | null | undefined;
	/** Defaults to the envelope's `failureFromResponse`. */
	decodeFailure?: FailureDecoder;
	/** Read lazily on every request. Runtime roots supply this explicitly rather
	 * than relying on a mutable global. */
	getCorrelationId?: () => string | null | undefined;
};

/** The one place these strings exist. */
export const CORRELATION_HEADER = 'x-correlation-id';
export const REQUEST_ID_HEADER = 'x-request-id';

/** What a caller may pass to a service. Headers, paths, and queries belong to
 * the service that names the endpoint. */
export type CallOptions = { signal?: AbortSignal; trace?: DiagnosticTrace };

export type RequestOptions = {
	trace?: DiagnosticTrace;
	params?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
	signal?: AbortSignal;
	timeoutMs?: number;
	headers?: Record<string, string>;
};

/** Raw transport values. The generic is only a TypeScript assertion; services
 * request `unknown` and decode successful bodies before exposing DTOs. */
export type HttpClient = {
	request<T>(method: string, path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
	get<T>(path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
	post<T>(path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
	put<T>(path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
	patch<T>(path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
	delete<T>(path: string, options?: RequestOptions): Promise<Result<T, Failure>>;
};

/** Append paths rather than resolving them. A leading slash must not drop a
 * mount path from the configured base URL. */
export function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** Drop undefined values and encode the rest. */
export function queryString(params: RequestOptions['params']): string {
	if (!params) return '';
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) search.set(key, String(value));
	}
	const encoded = search.toString();
	return encoded ? `?${encoded}` : '';
}
