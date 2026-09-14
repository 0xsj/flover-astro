import { CORRELATION_HEADER } from '../http';
import type { Failure, Result } from '../kernel';

/** The one place a Result becomes an HTTP response. */
export function respond<T>(answered: Result<T, Failure>, correlationId: string): Response {
	const headers = { [CORRELATION_HEADER]: correlationId };

	if (answered.ok) {
		return answered.value === null || answered.value === undefined
			? new Response(null, { status: 204, headers })
			: Response.json(answered.value, { headers });
	}

	const failure = answered.error;
	return Response.json(
		{
			kind: failure.kind,
			message: failure.message,
			type: failure.type,
			correlation_id: failure.correlationId ?? correlationId,
			request_id: failure.requestId,
			...(failure.kind === 'rate_limited' ? { retry_after: failure.retryAfter } : {}),
			...(failure.kind === 'invalid' ? { fields: failure.fields } : {})
		},
		{ status: failure.status ?? 500, headers }
	);
}
