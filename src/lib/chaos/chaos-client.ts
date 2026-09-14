import {
	canceled,
	conflict,
	err,
	forbidden,
	internal,
	invalid,
	notFound,
	ok,
	rateLimited,
	timeout,
	unauthenticated,
	unavailable,
	type Failure,
	type FailureKind,
	type Result
} from '../kernel';
import type { HttpClient, RequestOptions } from '../http';
import { effectFor, isActive, rng, type Plan } from './plan';

const FAILURES: Record<FailureKind, (message: string) => Failure> = {
	unauthenticated,
	forbidden,
	not_found: notFound,
	invalid: (message) => invalid(message, {}),
	conflict,
	rate_limited: (message) => rateLimited(message, 12),
	unavailable,
	timeout,
	canceled,
	internal
};

const sleep = (milliseconds: number, signal?: AbortSignal) =>
	new Promise<void>((resolve) => {
		const timer = setTimeout(resolve, milliseconds);
		signal?.addEventListener(
			'abort',
			() => {
				clearTimeout(timer);
				resolve();
			},
			{ once: true }
		);
	});

/** Decorate either transport without changing the service contract. */
export function withChaos(client: HttpClient, plan: Plan | undefined, correlationId?: string): HttpClient {
	if (process.env.NODE_ENV === 'production') return client;
	if (!isActive(plan) || !plan) return client;

	const next = rng(plan.seed ?? 1);
	const request = async <T>(
		method: string,
		path: string,
		options: RequestOptions = {}
	): Promise<Result<T, Failure>> => {
		const effect = effectFor(plan, method, path);
		if (!effect || (effect.p !== undefined && next() >= effect.p)) {
			return client.request<T>(method, path, options);
		}

		if (effect.latency) await sleep(effect.latency, options.signal);

		if (effect.hang) {
			if (options.signal?.aborted) return err(canceled('The request was cancelled.'));
			return new Promise<Result<T, Failure>>((resolve) => {
				options.signal?.addEventListener(
					'abort',
					() => resolve(err(canceled('The request was cancelled.'))),
					{ once: true }
				);
			});
		}

		if (effect.empty) return ok((effect.empty === 'list' ? [] : null) as T);
		if (effect.fail) {
			const failure = FAILURES[effect.fail](`Chaos: forced ${effect.fail}.`);
			return err(correlationId === undefined ? failure : { ...failure, correlationId });
		}

		return client.request<T>(method, path, options);
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
