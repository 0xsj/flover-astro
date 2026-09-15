# Cookbook resilience recipes use real boundaries

The chaos and failures recipes run through the Astro server root, so their
query plan is parsed at the request boundary and their failure answer comes
from the same memory/network selection used by an endpoint. The chaos builder
therefore links to the available server-backed failure surface and sessions
endpoint until the authenticated application shell exists; it does not claim
to preview the future app.

The diagnostics recipe stays visit-local: `createMemoryDiagnostics`,
`createTrace`, `createLatestRead`, and the response-demo root are composed in a
native browser script. The URL-state recipe follows the same rule with
`createUrlState`, preserving back/forward behavior while a portable collection
fixture supplies the rows.

This split keeps the two meanings visible: chaos tests a boundary and the
surfaces beneath it, while diagnostics and URL state demonstrate local
interaction behavior without touching account data. The four routes are
build- and preview-route verified with Astro 7.3.2 on 2026-09-15; click-level
browser verification remains separate.
