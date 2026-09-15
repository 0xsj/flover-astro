# Cookbook composition roots stay isolated

The item workflow, session-recovery, and resilience examples are composed under
`src/lib/root/`, alongside the production root but outside its default route
table. This mirrors the sibling projects' deliberate separation between
application composition and cookbook simulations.

The examples construct their own memory clients, fixtures, storage namespace,
and finite chaos sequence. They do not read the Astro session cookie, use the
server root, consume a URL-provided chaos plan, or mutate module-global fixture
state. The item workflow injects `StoragePort`, so reload and account-isolation
behavior can be exercised without a browser.

The important distinction is outcome semantics:

- a refused or stale save is a definite failure;
- a lost response is unknown until its operation receipt is checked; and
- an empty response remains a valid value, while malformed or unavailable data
  remains a visible failure.

This port was build-verified with Astro 7.3.2 on 2026-09-15. A browser run of
the future Astro recipe pages is still owed; these roots currently have direct
Node smoke coverage rather than route-level UI coverage.
