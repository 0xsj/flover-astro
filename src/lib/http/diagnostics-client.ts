import type { HttpClient, RequestOptions } from './port';

/** Surround the chosen adapter. No trace means no recording. */
export function withDiagnostics(inner: HttpClient): HttpClient {
	const request: HttpClient['request'] = <T>(
		method: string,
		path: string,
		options: RequestOptions = {}
	) =>
		options.trace
			? options.trace.run('request', () => inner.request<T>(method, path, options))
			: inner.request<T>(method, path, options);

	return {
		request,
		get: (path, options) => request('GET', path, options),
		post: (path, options) => request('POST', path, options),
		put: (path, options) => request('PUT', path, options),
		patch: (path, options) => request('PATCH', path, options),
		delete: (path, options) => request('DELETE', path, options)
	};
}
