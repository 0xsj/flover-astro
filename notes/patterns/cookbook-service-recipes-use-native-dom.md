# Cookbook service recipes use native DOM bindings

The access, jobs, activity, and localization recipes keep their service and
runtime contracts in `src/lib/`, while each Astro route owns a small browser
binding in its page script. This is the same separation as the sibling demos,
adapted to Astro's server-rendered HTML and native browser enhancement model.

The access page composes `createAccessExample`, `createCapabilities`, and
`createLatestRead`; the jobs page composes `createJobExample` and
`createJobObserver`; the activity page calls `getMyActivity` through a root with
a demo bearer and retains its cursor, facets, and correlation filter locally;
and localization uses an explicit `Intl` context plus a small route-local copy
catalog because the Astro locale layer has not been ported yet.

The activity demo token is deliberately scoped to the in-memory fixture. It
does not bypass the server endpoint's cookie boundary or claim that the auth
UI is complete. The pages are build-verified with Astro 7.3.2 on 2026-09-15;
click-level browser verification remains a separate check.
