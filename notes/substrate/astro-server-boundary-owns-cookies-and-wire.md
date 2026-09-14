# The Astro server boundary owns cookies and wire responses

The first Astro server boundary now lives under `src/lib/server/` and
`src/pages/api/`.

## Carried

- request-local root memoization through `APIContext.locals`;
- lazy token and environment configuration at the Astro boundary;
- an HttpOnly, same-origin session cookie;
- three-state current-session lookup;
- one response serializer matching the HTTP failure envelope; and
- API routes for session listing, session revocation, and activity reads.

## Adapted

Astro uses `APIContext.cookies`, `APIContext.url`, `APIContext.locals`, and
`APIRoute` handlers instead of Next request helpers or SvelteKit `RequestEvent`.
The session cookie is named `flover_astro_session` so the sibling projects can
run on the same local origin without sharing credentials.

Sign-in and sign-up are intentionally not JSON API routes yet. Their successful
service result contains a token, so the future form/action boundary must store
it through `startSession` without serializing it to the browser.

## Verification

The server boundary compiles with the Astro route types, its root/service/API
barrels compile standalone, and `yarn build` passes.
