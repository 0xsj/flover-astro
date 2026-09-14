import { internal, isFailure, type Failure } from './failure';
import type { Result } from './result';

/** The single sanctioned error class for crossing into an Astro error boundary. */
export class AppError extends Error {
	readonly failure: Failure;

	constructor(failure: Failure) {
		super(failure.message);
		this.name = 'AppError';
		this.failure = failure;
	}
}

/** Unwrap a result at a deliberate rendering or framework boundary. */
export function unwrap<T>(result: Result<T, Failure>): T {
	if (result.ok) return result.value;
	throw new AppError(result.error);
}

/** Convert any thrown value into a plain Failure without throwing again. */
export function asFailure(cause: unknown): Failure {
	if (cause instanceof AppError) return cause.failure;
	if (isFailure(cause)) return cause;
	if (isFailure((cause as { failure?: unknown })?.failure)) {
		return (cause as { failure: Failure }).failure;
	}
	if (cause instanceof Error) return internal(cause.message, { type: cause.name });
	return internal('Something went wrong.');
}
