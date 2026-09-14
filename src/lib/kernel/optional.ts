import { because, internal, type Failure, type Fails } from './failure';
import { Err, Ok, type Result } from './result';

/* Three states: nobody looked, looked and found nothing, or could not measure.
 * A caller must identify which `not_found` means legitimate absence. An
 * unrecognised one becomes `internal` with the original failure as its cause.
 */
export async function optional<T, E extends Failure>(
	r: Promise<Result<T, E>> | Result<T, E>,
	absent: (f: Fails<'not_found'>) => boolean
): Promise<Result<T | null, Exclude<E, Fails<'not_found'>> | Fails<'internal'>>> {
	const settled = await r;
	if (settled.ok) return new Ok(settled.value);
	const failure: Failure = settled.error;
	if (failure.kind !== 'not_found') {
		return new Err(failure as Exclude<E, Fails<'not_found'>>);
	}
	if (absent(failure)) return new Ok(null);
	return new Err(
		because(
			internal(failure.message, {
				type: failure.type,
				requestId: failure.requestId,
				correlationId: failure.correlationId,
				status: failure.status
			}),
			failure
		)
	);
}

/** Use only when a backend cannot distinguish absence from a missing route. */
export const anyNotFound = (_failure?: Fails<'not_found'>): boolean => true;

/** Identify legitimate absence by the server's failure type. */
export const absentWhenType =
	(type: string) =>
	(failure: Fails<'not_found'>): boolean =>
		failure.type === type;

export type Presence<T, E extends Failure = Failure> =
	| { state: 'found'; value: T }
	| { state: 'empty' }
	| { state: 'unmeasured'; failure: E };

export function presenceOf<T, E extends Failure>(r: Result<T | null, E>): Presence<T, E> {
	if (!r.ok) return { state: 'unmeasured', failure: r.error };
	return r.value === null ? { state: 'empty' } : { state: 'found', value: r.value };
}
