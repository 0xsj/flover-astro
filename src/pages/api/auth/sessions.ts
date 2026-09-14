import type { APIRoute } from 'astro';
import { listSessions } from '../../../lib/services/session';
import { serverRoot } from '../../../lib/server/root';
import { respond } from '../../../lib/server/respond';

/** Browser door for the HttpOnly session cookie. */
export const GET: APIRoute = async (context) => {
	const root = serverRoot(context);
	return respond(await listSessions(root.clientFor('session')), root.correlationId);
};
