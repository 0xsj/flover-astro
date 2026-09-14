import { canceled, err, ok, type Failure, type Result } from '../kernel';
import type { HttpClient, RequestOptions } from '../http';
import { matches } from './plan';

export type SequenceStep = {
	request: string;
	effect:
		| { kind: 'reply'; value: unknown }
		| { kind: 'fail'; failure: Failure }
		| { kind: 'lose-response'; failure: Failure }
		| { kind: 'hold-response'; gate: string; ignoreAbort?: boolean };
};

/** An explicit finite transport simulation. The application root does not
 * accept a sequence script implicitly. */
export function createSequenceClient(inner: HttpClient, steps: readonly SequenceStep[]) {
	const script = [...steps];
	const lifecycle = new AbortController();
	const released = new Set<string>();
	const waiters = new Map<string, Set<() => void>>();
	let cursor = 0;
	const canceledResult = () => err(canceled('The simulated request was cancelled.'));

	const hold = (gate: string, signal: AbortSignal) =>
		new Promise<void>((resolve) => {
			if (signal.aborted || released.has(gate)) {
				resolve();
				return;
			}
			const waiting = waiters.get(gate) ?? new Set<() => void>();
			const finish = () => {
				signal.removeEventListener('abort', finish);
				waiting.delete(finish);
				if (!waiting.size) waiters.delete(gate);
				resolve();
			};
			waiting.add(finish);
			waiters.set(gate, waiting);
			signal.addEventListener('abort', finish, { once: true });
		});

	const request = async <T>(
		method: string,
		path: string,
		options: RequestOptions = {}
	): Promise<Result<T, Failure>> => {
		if (lifecycle.signal.aborted || options.signal?.aborted) return canceledResult();
		const step = script[cursor];
		const effect = step && matches(step.request, method, path) ? script[cursor++].effect : undefined;
		const ignoreAbort = effect?.kind === 'hold-response' && effect.ignoreAbort;
		const signal =
			ignoreAbort || !options.signal
				? lifecycle.signal
				: AbortSignal.any([lifecycle.signal, options.signal]);
		if (effect?.kind === 'reply') return ok(effect.value as T);
		if (effect?.kind === 'fail') return err(effect.failure);

		const result = await inner.request<T>(method, path, { ...options, signal });
		if (effect?.kind === 'hold-response') await hold(effect.gate, signal);
		if (signal.aborted) return canceledResult();
		if (effect?.kind === 'lose-response' && result.ok) return err(effect.failure);
		return result;
	};

	const client: HttpClient = {
		request,
		get: (path, options) => request('GET', path, options),
		post: (path, options) => request('POST', path, options),
		put: (path, options) => request('PUT', path, options),
		patch: (path, options) => request('PATCH', path, options),
		delete: (path, options) => request('DELETE', path, options)
	};

	return {
		client,
		remaining: () => script.length - cursor,
		release(gate: string) {
			released.add(gate);
			for (const finish of [...(waiters.get(gate) ?? [])]) finish();
		},
		dispose() {
			lifecycle.abort();
		}
	};
}
