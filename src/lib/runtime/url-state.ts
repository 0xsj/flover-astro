import { err, internal, ok, type Result } from '../kernel';
import type { QuerySchema } from '../url-state';
import { createStore } from './store';

export type HistoryMode = 'push' | 'replace';

/** Event-time URL writer for client-owned query state. It never starts a
 * server refetch; callers that need one should use normal navigation. */
export function writeQueryState<T>(
	schema: QuerySchema<T>,
	change: (current: T) => T,
	mode: HistoryMode = 'push'
): Result<void> {
	try {
		const current = window.location;
		const result = schema.update(current.search, change);
		if (!result.ok) return err(result.error);
		const query = result.value.toString();
		const href = `${current.pathname}${query ? `?${query}` : ''}${current.hash}`;
		if (href !== `${current.pathname}${current.search}${current.hash}`)
			window.history[mode === 'replace' ? 'replaceState' : 'pushState'](null, '', href);
		window.dispatchEvent(new Event('flover:url-state'));
		return ok(undefined);
	} catch {
		return err(
			internal('The browser could not update this view’s address. Try again.', {
				type: 'url_state_unavailable'
			})
		);
	}
}

export function createUrlState<T>(schema: QuerySchema<T>) {
	const read = () => schema.read(window.location.search);
	const store = createStore(read());
	const update = () => store.set(read());
	const events = ['popstate', 'hashchange', 'flover:url-state'] as const;
	events.forEach((event) => window.addEventListener(event, update));
	return {
		get: () => store.get(),
		subscribe: store.subscribe,
		update(change: (current: T) => T, mode?: HistoryMode) {
			const result = writeQueryState(schema, change, mode);
			if (result.ok) update();
			return result;
		},
		path: () => {
			const current = window.location;
			return `${current.pathname}${current.search}`;
		},
		dispose() {
			events.forEach((event) => window.removeEventListener(event, update));
		}
	};
}
