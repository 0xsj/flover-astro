import type { APIRoute } from 'astro';
import { CORRELATION_HEADER } from '../../../lib/http';
import { signUp } from '../../../lib/services/session';
import { serverRoot } from '../../../lib/server/root';
import { startSession } from '../../../lib/server/session';
import { respond } from '../../../lib/server/respond';

type ParsedBody = { body: Record<string, unknown>; formEncoded: boolean };

const bodyOf = async (request: Request): Promise<ParsedBody> => {
	const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim();
	if (contentType === 'application/x-www-form-urlencoded' || contentType === 'multipart/form-data') {
		const form = await request.formData();
		return { body: Object.fromEntries(form.entries()), formEncoded: true };
	}
	try {
		const value = await request.json();
		return { body: value && typeof value === 'object' ? (value as Record<string, unknown>) : {}, formEncoded: false };
	} catch {
		return { body: {}, formEncoded: false };
	}
};

const safeReturnTo = (value: unknown): string => {
	const path = typeof value === 'string' ? value : '/app';
	return path.startsWith('/') && !path.startsWith('//') ? path : '/app';
};

const formErrorRedirect = (context: Parameters<APIRoute>[0], body: Record<string, unknown>, result: { ok: false; error: { message: string; fields?: Record<string, string> } }) => {
	const url = new URL('/sign-up', context.url);
	url.searchParams.set('returnTo', safeReturnTo(body.returnTo));
	url.searchParams.set('error', result.error.message);
	for (const [field, message] of Object.entries(result.error.fields ?? {})) url.searchParams.set(`field_${field}`, message);
	return context.redirect(`${url.pathname}${url.search}`, 303);
};

export const POST: APIRoute = async (context) => {
	const parsed = await bodyOf(context.request);
	const body = parsed.body;
	const root = serverRoot(context);
	const result = await signUp(root.clientFor('session'), {
		name: typeof body.name === 'string' ? body.name : '',
		email: typeof body.email === 'string' ? body.email : '',
		password: typeof body.password === 'string' ? body.password : ''
	});
	if (!result.ok) return parsed.formEncoded ? formErrorRedirect(context, body, result) : respond(result, root.correlationId);
	startSession(context, result.value.token);
	if (parsed.formEncoded) return context.redirect(safeReturnTo(body.returnTo), 303);
	return Response.json({ user: result.value.user }, { headers: { [CORRELATION_HEADER]: root.correlationId } });
};
