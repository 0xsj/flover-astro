import { manualMarkdown } from '../manual/_lib/markdown';

export const GET = ({ request }: { request: Request }) => {
	const body = manualMarkdown(new URL(request.url).origin);
	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Content-Disposition': 'attachment; filename="flover-astro-manual.md"'
		}
	});
};
