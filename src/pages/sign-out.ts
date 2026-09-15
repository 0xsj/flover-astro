import type { APIRoute } from 'astro';
import { signOut } from '../lib/services/session';
import { serverRoot } from '../lib/server/root';
import { endSession } from '../lib/server/session';

export const POST: APIRoute = async (context) => {
	const root = serverRoot(context);
	await signOut(root.clientFor('session'));
	endSession(context);
	return context.redirect('/', 303);
};
