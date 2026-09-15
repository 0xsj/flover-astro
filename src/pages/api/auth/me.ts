import type { APIRoute } from 'astro';
import { currentUser } from '../../../lib/services/session';
import { serverRoot } from '../../../lib/server/root';
import { respond } from '../../../lib/server/respond';

export const GET: APIRoute = async (context) => {
	const root = serverRoot(context);
	return respond(await currentUser(root.clientFor('session')), root.correlationId);
};
