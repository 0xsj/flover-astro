import type { APIRoute } from 'astro';
import { signOut } from '../../../lib/services/session';
import { serverRoot } from '../../../lib/server/root';
import { endSession } from '../../../lib/server/session';
import { respond } from '../../../lib/server/respond';

export const POST: APIRoute = async (context) => {
	const root = serverRoot(context);
	const result = await signOut(root.clientFor('session'));
	endSession(context);
	return respond(result, root.correlationId);
};
