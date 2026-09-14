import {
	isFailureKind,
	type Failure,
	type FailureKind,
	type FailureMeta,
	unavailable,
	timeout,
	canceled
} from '../kernel';
import { CORRELATION_HEADER, REQUEST_ID_HEADER } from './port';
import type { FailureDecoder } from './port';

/* The one file permitted to name a wire key, a header, or a status code. */

type Problem = {
	kind?: unknown;
	message?: unknown;
	detail?: unknown;
	title?: unknown;
	type?: unknown;
	fields?: unknown;
	request_id?: unknown;
	correlation_id?: unknown;
	retry_after?: unknown;
	requestId?: unknown;
	correlationId?: unknown;
	retryAfter?: unknown;
};

function kindFromStatus(status: number): FailureKind {
	switch (status) {
		case 400:
			return 'invalid';
		case 401:
			return 'unauthenticated';
		case 403:
			return 'forbidden';
		case 404:
			return 'not_found';
		case 409:
			return 'conflict';
		case 412:
			return 'conflict';
		case 422:
			return 'invalid';
		case 428:
			return 'invalid';
		case 429:
			return 'rate_limited';
		case 499:
			return 'canceled';
		case 503:
			return 'unavailable';
		case 504:
			return 'timeout';
		default:
			return 'internal';
	}
}

function stringMap(value: unknown): Record<string, string> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
	const result: Record<string, string> = {};
	for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
		if (typeof entry === 'string') result[key] = entry;
	}
	return result;
}

const str = (value: unknown): string | undefined =>
	typeof value === 'string' && value ? value : undefined;

const num = (value: unknown): number | undefined => {
	const number = typeof value === 'string' ? Number(value) : value;
	return typeof number === 'number' && Number.isFinite(number) ? number : undefined;
};

function build(
	kind: FailureKind,
	meta: FailureMeta,
	problem: Problem,
	response: Response
): Failure {
	switch (kind) {
		case 'invalid':
			return { kind, ...meta, fields: stringMap(problem.fields) };
		case 'rate_limited':
			return {
				kind,
				...meta,
				retryAfter:
					num(problem.retry_after) ??
					num(problem.retryAfter) ??
					num(response.headers.get('retry-after'))
			};
		default:
			return { kind, ...meta };
	}
}

/** Total: every response becomes exactly one Failure. */
export const failureFromResponse: FailureDecoder = async (response) => {
	let problem: Problem = {};
	try {
		const text = await response.text();
		if (text) problem = JSON.parse(text) as Problem;
	} catch {
		/* Non-JSON bodies fall through to status classification. */
	}

	const declared = problem.kind;
	const known = isFailureKind(declared);
	const meta: FailureMeta = {
		message:
			str(problem.message) ??
			str(problem.detail) ??
			str(problem.title) ??
			str(response.statusText) ??
			'Request failed',
		type: str(problem.type) ?? (!known ? str(declared) : undefined),
		requestId:
			str(problem.request_id) ??
			str(problem.requestId) ??
			response.headers.get(REQUEST_ID_HEADER) ??
			undefined,
		correlationId:
			str(problem.correlation_id) ??
			str(problem.correlationId) ??
			response.headers.get(CORRELATION_HEADER) ??
			undefined,
		status: response.status
	};

	return build(known ? declared : kindFromStatus(response.status), meta, problem, response);
};

/** A failure with no response at all: DNS, a dropped socket, or an abort. */
export function failureFromTransport(cause: unknown): Failure {
	const name = (cause as { name?: unknown } | null)?.name;
	if (name === 'AbortError') return canceled('The request was cancelled.');
	if (name === 'TimeoutError') return timeout('The server took too long to respond.');
	return unavailable(cause instanceof Error ? cause.message : 'The server could not be reached.');
}
