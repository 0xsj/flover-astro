import type { Failure } from '../kernel';
import type { ConnectionState, EventSource } from '../realtime';
import type { createQueryCache } from './cache';

export type CacheKey = readonly unknown[];
export type LiveQueryOptions<T> = {
	source: EventSource<T>;
	affected: (event: T) => readonly CacheKey[];
	resync: readonly CacheKey[];
	cache: ReturnType<typeof createQueryCache>;
	batchMs?: number;
};

/** Subscribe once, coalesce invalidations, and resync after every open. */
export function connectLiveQueries<T>({
	source,
	affected,
	resync,
	cache,
	batchMs = 80
}: LiveQueryOptions<T>) {
	let connection: ConnectionState = { state: 'connecting' };
	let failure: Failure | null = null;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let pending = new Map<string, CacheKey>();
	const schedule = (keys: readonly CacheKey[]) => {
		for (const key of keys) pending.set(JSON.stringify(key), key);
		if (timer !== undefined || pending.size === 0) return;
		timer = setTimeout(() => {
			const next = [...pending.values()];
			pending = new Map();
			timer = undefined;
			for (const key of next) cache.invalidate(key);
		}, batchMs);
	};
	const unsubscribe = source.subscribe({
		event: (event) => schedule(affected(event)),
		state: (next) => {
			connection = next;
			if (next.state === 'open') {
				failure = null;
				schedule(resync);
			}
		},
		error: (next) => {
			failure = next;
		}
	});
	return {
		state: () => ({ connection, failure }),
		stop: () => {
			unsubscribe();
			clearTimeout(timer);
			pending.clear();
		}
	};
}
