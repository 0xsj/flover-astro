/** The smallest store that satisfies a framework's subscription contract.
 *
 * Framework-free on purpose: Astro bindings can use the same state machines
 * with native DOM lifecycle code, while tests can use the store directly.
 * `server` returns a stable SSR-safe value and never reads browser storage.
 */
export type Store<T> = {
	get: () => T;
	set: (next: T) => void;
	subscribe: (listener: () => void) => () => void;
	server: () => T;
};

export function createStore<T>(initial: T, onChange?: (value: T) => void): Store<T> {
	let value = initial;
	const listeners = new Set<() => void>();

	return {
		get: () => value,
		set: (next) => {
			if (Object.is(next, value)) return;
			value = next;
			onChange?.(value);
			for (const listener of listeners) listener();
		},
		subscribe: (listener) => {
			listeners.add(listener);
			return () => void listeners.delete(listener);
		},
		server: () => initial
	};
}

/** Persist a small preference to local storage, tolerating every way it can fail. */
export function persisted<T extends string>(
	key: string,
	fallback: T,
	valid: readonly T[]
): { read: () => T; write: (value: T) => void } {
	return {
		read: () => {
			try {
				const raw = globalThis.localStorage?.getItem(key);
				return valid.includes(raw as T) ? (raw as T) : fallback;
			} catch {
				return fallback;
			}
		},
		write: (value) => {
			try {
				globalThis.localStorage?.setItem(key, value);
			} catch {
				/* A preference is not worth an exception. */
			}
		}
	};
}
