import type { APIRoute } from 'astro';
import { getMyActivity } from '../../../lib/services/ledger';
import { serverRoot } from '../../../lib/server/root';
import { respond } from '../../../lib/server/respond';

/** Browser door for the cursor-paginated audit log. */
export const GET: APIRoute = async (context) => {
	const root = serverRoot(context);
	const query = context.url.searchParams;
	return respond(
		await getMyActivity(root.clientFor('ledger'), {
			after: query.get('after') ?? undefined,
			facet: query.get('facet') ?? undefined,
			correlation: query.get('correlation') ?? undefined,
			limit: Number(query.get('limit')) || undefined
		}),
		root.correlationId
	);
};
