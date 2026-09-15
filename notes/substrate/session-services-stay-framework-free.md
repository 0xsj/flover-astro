# Session services stay framework-free

The first domain service port carries `session` and its audit dependency under
`src/lib/services/`. The public service functions receive an `HttpClient` and
return `Result` values; they do not read cookies, set cookies, import Astro, or
select memory versus network adapters.

## Carried

- sign-in and sign-up validation with shared server-shaped field failures;
- transport failures preserved through service narrowing;
- current-user and session-list reads;
- explicit `not_found` and `conflict` semantics for session revocation;
- token-free `SessionSummary` responses;
- memory fixtures for expiry, rate limiting, duplicate accounts, and audit side
  effects; and
- the cursor-paginated ledger contract used by the activity service.

## Adapted

The fixture cursor uses Web `btoa`/`atob` rather than Node `Buffer`, so the
portable fixture can later serve either an Astro server request or an explicit
browser island root. Session TTL configuration is read defensively through the
global runtime instead of importing a framework environment module.

## Boundary rule

The Astro server boundary owns the HttpOnly cookie. A successful service result
contains the token for that caller to store; the service never assumes where
storage happens.

## Verification

Focused smoke tests passed for validation, sign-in, authenticated user lookup,
session listing without token leakage, self-revocation conflict, audit reads,
duplicate signup conflict, and sign-out. `yarn build` passes.
