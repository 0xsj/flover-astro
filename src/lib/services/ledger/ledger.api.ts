import { narrow, type Result, type TransportFailure } from '../../kernel';
import type { HttpClient } from '../../http';
import type { AuditPage, PageOptions } from './ledger.types';
import { decodeAuditPage } from './ledger.responses';

/* Unknown facets and stale cursors are successful empty answers, so this
 * operation promises transport failures only. */
const asTransport = narrow<never>();

export async function getMyActivity(
	client: HttpClient,
	options?: PageOptions
): Promise<Result<AuditPage, TransportFailure>> {
	return (
		await client.get<unknown>('/me/activity', {
			params: {
				after: options?.after,
				limit: options?.limit,
				facet: options?.facet,
				correlation: options?.correlation
			},
			signal: options?.signal,
			trace: options?.trace
		})
	)
		.andThen((value) => decodeAuditPage(value, options?.trace))
		.mapErr(asTransport);
}
