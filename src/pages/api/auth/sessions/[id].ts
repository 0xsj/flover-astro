import type { APIRoute } from 'astro';
import { revokeSession } from '../../../../lib/services/session';
import { serverRoot } from '../../../../lib/server/root';
import { respond } from '../../../../lib/server/respond';

export const DELETE: APIRoute = async (context) => {
	const root = serverRoot(context);
	return respond(
		await revokeSession(root.clientFor('session'), context.params.id ?? ''),
		root.correlationId
	);
};
