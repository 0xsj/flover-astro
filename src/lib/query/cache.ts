import type { CacheKey } from './live';

const serialise = (key: CacheKey): string => JSON.stringify(key);
const prefix = (key: CacheKey, candidate: CacheKey): boolean =>
	key.length <= candidate.length && key.every((value, index) => JSON.stringify(value) === JSON.stringify(candidate[index]));

/** Small framework-free cache for Astro browser bindings and cookbook demos. */
export function createQueryCache() {
	const values = new Map<string, { key: CacheKey; value: unknown }>();
	const listeners = new Set<(key: CacheKey) => void>();
	return {
		get<T>(key: CacheKey): T | undefined {
			return values.get(serialise(key))?.value as T | undefined;
		},
		set<T>(key: CacheKey, value: T): void {
			values.set(serialise(key), { key, value });
			for (const listener of listeners) listener(key);
		},
		invalidate(key: CacheKey): void {
			for (const [id, entry] of values) if (prefix(key, entry.key)) values.delete(id);
			for (const listener of listeners) listener(key);
		},
		subscribe(listener: (key: CacheKey) => void): () => void {
			listeners.add(listener);
			return () => listeners.delete(listener);
		}
	};
}
