/* v3 — the kinds are split in two, and that split is what fixes v2.
 *
 * v2 let a service narrow the failure union to "what this operation can
 * produce", and its example folded `rate_limited` and `canceled` into
 * `internal`. A rate-limited read then lost the server's retry-after, and a
 * cancellation rendered as an error. The mistake was treating every kind as
 * per-operation. It is not:
 *
 *   TRANSPORT  can happen on ANY call — a 401, a 429, a dropped socket, the
 *              caller's own abort. No service gets to say it cannot produce one.
 *   DOMAIN     varies per operation. A read cannot produce `invalid`; a create
 *              cannot produce `not_found`. This is the only set a service
 *              narrows, and `narrow(...)` below only ever decides these.
 *
 * Everything else from v2 stays: exact-variant constructors, `Fails<K>`, the
 * cause chain, retry as a delay.
 */

export type FailureMeta = {
	/** The server's words, or ours. Diagnostic first: it goes in a log and it is
	 * the fallback for `internal`. User-facing copy comes from the exhaustive
	 * switch, in this product's voice. */
	message: string;
	/** A backend-specific condition — "seat_limit_reached". The extension point:
	 * a product's own vocabulary rides here, never as an eleventh kind. Also
	 * where an unrecognised server kind is preserved. */
	type?: string;
	/** The server's id for the one request that failed. Server-minted; we only
	 * ever read it. */
	requestId?: string;
	/** The interaction this request belonged to. Ours, not the server's — sent as
	 * a header and echoed back, so it is present even when the server ignores it.
	 * A request id identifies one call; this identifies everything one user
	 * action caused. */
	correlationId?: string;
	/** Carried for diagnostics. Never branched on above the HTTP boundary. */
	status?: number;
	/** What this failure happened while doing. */
	cause?: Failure;
};

type MetaInit = Omit<FailureMeta, 'message'>;

/** Any call can produce one of these. A service passes them through untouched. */
export const TRANSPORT_KINDS = [
	'unauthenticated',
	'forbidden',
	'rate_limited',
	'unavailable',
	'timeout',
	'canceled',
	'internal'
] as const;

/** Whether one of these can occur depends on the operation. A service says
 * which, and `narrow` folds the rest. */
export const DOMAIN_KINDS = ['not_found', 'invalid', 'conflict'] as const;

export const FAILURE_KINDS = [...TRANSPORT_KINDS, ...DOMAIN_KINDS] as const;

export type TransportKind = (typeof TRANSPORT_KINDS)[number];
export type DomainKind = (typeof DOMAIN_KINDS)[number];
export type FailureKind = TransportKind | DomainKind;

export type Failure =
	| ({ kind: 'unauthenticated' } & FailureMeta)
	| ({ kind: 'forbidden' } & FailureMeta)
	| ({ kind: 'rate_limited'; retryAfter?: number } & FailureMeta)
	| ({ kind: 'unavailable' } & FailureMeta)
	| ({ kind: 'timeout' } & FailureMeta)
	/** An answer, not a failure: the caller asked for this. Never folded. */
	| ({ kind: 'canceled' } & FailureMeta)
	/** Ours, or nobody's. Also what an unexpected domain kind folds into, with
	 * the original as its cause. */
	| ({ kind: 'internal' } & FailureMeta)
	/** The resource is not there when it should have been. Not the answer to
	 * "does this exist" — see `optional`. */
	| ({ kind: 'not_found' } & FailureMeta)
	| ({ kind: 'invalid'; fields: Record<string, string> } & FailureMeta)
	| ({ kind: 'conflict' } & FailureMeta);

/** Narrow the union by kind. */
export type Fails<K extends FailureKind> = Extract<Failure, { kind: K }>;

export type TransportFailure = Fails<TransportKind>;
export type DomainFailure = Fails<DomainKind>;

/* Smart constructors — each returns its own variant. */

export const unauthenticated = (
	message: string,
	m: MetaInit = {}
): Fails<'unauthenticated'> => ({ kind: 'unauthenticated', message, ...m });

export const forbidden = (message: string, m: MetaInit = {}): Fails<'forbidden'> => ({
	kind: 'forbidden',
	message,
	...m
});

export const rateLimited = (
	message: string,
	retryAfter?: number,
	m: MetaInit = {}
): Fails<'rate_limited'> => ({ kind: 'rate_limited', message, retryAfter, ...m });

export const unavailable = (message: string, m: MetaInit = {}): Fails<'unavailable'> => ({
	kind: 'unavailable',
	message,
	...m
});

export const timeout = (message: string, m: MetaInit = {}): Fails<'timeout'> => ({
	kind: 'timeout',
	message,
	...m
});

export const canceled = (message: string, m: MetaInit = {}): Fails<'canceled'> => ({
	kind: 'canceled',
	message,
	...m
});

export const internal = (message: string, m: MetaInit = {}): Fails<'internal'> => ({
	kind: 'internal',
	message,
	...m
});

export const notFound = (message: string, m: MetaInit = {}): Fails<'not_found'> => ({
	kind: 'not_found',
	message,
	...m
});

export const invalid = (
	message: string,
	fields: Record<string, string> = {},
	m: MetaInit = {}
): Fails<'invalid'> => ({ kind: 'invalid', message, fields, ...m });

export const conflict = (message: string, m: MetaInit = {}): Fails<'conflict'> => ({
	kind: 'conflict',
	message,
	...m
});

/* Classification */

export function isFailureKind(value: unknown): value is FailureKind {
	return typeof value === 'string' && (FAILURE_KINDS as readonly string[]).includes(value);
}

export function isTransportKind(value: unknown): value is TransportKind {
	return typeof value === 'string' && (TRANSPORT_KINDS as readonly string[]).includes(value);
}

export function isDomainKind(value: unknown): value is DomainKind {
	return typeof value === 'string' && (DOMAIN_KINDS as readonly string[]).includes(value);
}

/** Structural — a failure that crossed a serialization boundary has no
 * prototype of ours, which is the whole point of it being plain data. */
export function isFailure(value: unknown): value is Failure {
	return (
		typeof value === 'object' &&
		value !== null &&
		isFailureKind((value as { kind?: unknown }).kind) &&
		typeof (value as { message?: unknown }).message === 'string'
	);
}

export const isTransport = (failure: Failure): failure is TransportFailure =>
	isTransportKind(failure.kind);

export const isDomain = (failure: Failure): failure is DomainFailure =>
	isDomainKind(failure.kind);

/* Cause chain */

/** Attach context on the way up. The outer failure is what the caller renders;
 * the inner is what the log needs. */
export const because = <F extends Failure>(failure: F, cause: Failure): F => ({
	...failure,
	cause
});

/** The chain, outermost first. Terminates on a cycle. */
export function chain(failure: Failure): Failure[] {
	const result: Failure[] = [];
	const seen = new Set<Failure>();
	let current: Failure | undefined = failure;
	while (current && !seen.has(current)) {
		seen.add(current);
		result.push(current);
		current = current.cause;
	}
	return result;
}

export const rootCause = (failure: Failure): Failure => chain(failure).at(-1) ?? failure;

/* Narrowing */

/** Build the mapper a service uses to say which domain kinds an operation can
 * produce. Transport kinds always pass through. An unpromised domain kind is a
 * contract break: it folds to `internal` with the original as cause. */
export function narrow<K extends DomainKind>(
	...allowed: K[]
): (failure: Failure) => TransportFailure | Fails<K> {
	const accepted = new Set<string>(allowed);
	return (failure) => {
		if (isTransport(failure)) return failure;
		if (accepted.has(failure.kind)) return failure as Fails<K>;
		return because(
			internal(failure.message, {
				type: failure.type,
				requestId: failure.requestId,
				correlationId: failure.correlationId,
				status: failure.status
			}),
			failure
		);
	};
}

/* Retry */

/** Three kinds, and `canceled` is deliberately not one of them. */
export function isRetryable(failure: Failure): boolean {
	return (
		failure.kind === 'rate_limited' ||
		failure.kind === 'unavailable' ||
		failure.kind === 'timeout'
	);
}

export const RETRY_BASE_MS = 250;
export const RETRY_CAP_MS = 8_000;

/** Return the retry delay in milliseconds, or null when retrying is not valid. */
export function retryDelay(failure: Failure, attempt: number): number | null {
	if (!isRetryable(failure)) return null;
	if (failure.kind === 'rate_limited' && failure.retryAfter !== undefined) {
		return failure.retryAfter * 1000;
	}
	return Math.min(2 ** Math.max(0, attempt) * RETRY_BASE_MS, RETRY_CAP_MS);
}

/** The sealed-trait guarantee for exhaustive switches. */
export function assertNever(value: never, context = 'value'): never {
	throw new Error(`unhandled ${context}: ${JSON.stringify(value)}`);
}
