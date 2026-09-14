import type { Failure } from './failure';

/* Result is a class, Failure is plain data.
 *
 * Failure crosses server/client boundaries and must remain serializable. Result
 * is unwrapped before an Astro island or endpoint boundary. The JSON helpers
 * exist for explicit recovery when a result has crossed accidentally.
 */

export class Ok<T, E = Failure> {
	readonly ok = true as const;
	constructor(readonly value: T) {}

	map<U>(f: (value: T) => U): Result<U, E> {
		return new Ok(f(this.value));
	}

	mapErr<F>(_f: (error: E) => F): Result<T, F> {
		return this as unknown as Result<T, F>;
	}

	andThen<U, F = E>(f: (value: T) => Result<U, F>): Result<U, E | F> {
		return f(this.value);
	}

	match<U>(on: { ok: (value: T) => U; err: (error: E) => U }): U {
		return on.ok(this.value);
	}

	unwrapOr<U>(_fallback: U): T | U {
		return this.value;
	}

	tapErr(_f: (error: E) => void): Result<T, E> {
		return this;
	}

	toJSON() {
		return { ok: true as const, value: this.value };
	}
}

export class Err<T, E = Failure> {
	readonly ok = false as const;
	constructor(readonly error: E) {}

	map<U>(_f: (value: T) => U): Result<U, E> {
		return this as unknown as Result<U, E>;
	}

	mapErr<F>(f: (error: E) => F): Result<T, F> {
		return new Err(f(this.error));
	}

	andThen<U, F = E>(_f: (value: T) => Result<U, F>): Result<U, E | F> {
		return this as unknown as Result<U, E | F>;
	}

	match<U>(on: { ok: (value: T) => U; err: (error: E) => U }): U {
		return on.err(this.error);
	}

	unwrapOr<U>(fallback: U): T | U {
		return fallback;
	}

	tapErr(f: (error: E) => void): Result<T, E> {
		f(this.error);
		return this;
	}

	toJSON() {
		return { ok: false as const, error: this.error };
	}
}

export type Result<T, E = Failure> = Ok<T, E> | Err<T, E>;

export const ok = <T, E = Failure>(value: T): Ok<T, E> => new Ok(value);
export const err = <T = never, E = Failure>(error: E): Err<T, E> => new Err(error);

/** Every value, or the first failure. Tuple-preserving. */
export function all<T extends readonly Result<unknown, unknown>[]>(
	results: [...T]
): Result<
	{ [K in keyof T]: T[K] extends Result<infer V, unknown> ? V : never },
	T[number] extends Result<unknown, infer E> ? E : never
> {
	const values: unknown[] = [];
	for (const result of results) {
		if (!result.ok) return new Err(result.error as never);
		values.push(result.value);
	}
	return new Ok(values as never);
}

/** Sequential composition where step one is async. */
export async function andThenAsync<T, U, E, F = E>(
	result: Result<T, E>,
	f: (value: T) => Promise<Result<U, F>>
): Promise<Result<U, E | F>> {
	return result.ok ? f(result.value) : new Err(result.error);
}

/** Rehydrate a Result that crossed a boundary it should not have. */
export function fromJSON<T, E>(
	value: { ok: true; value: T } | { ok: false; error: E }
): Result<T, E> {
	return value.ok ? new Ok(value.value) : new Err(value.error);
}
