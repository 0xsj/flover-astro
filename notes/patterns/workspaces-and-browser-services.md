# Workspaces and browser-owned services

The workspace batch ports the sibling dashboard and canvas contracts without
bringing a React or Svelte rendering engine into Astro. `DashboardGrid` renders
the caller's validated desktop layout, exposes arrange actions as native
buttons, and adds pointer move/resize gestures. Narrow screens stack the same
items visually; the saved layout model is not rewritten. `Canvas` renders a
deterministic node/edge surface with selection, arrow-key movement, pointer
node dragging, viewport panning, and bounded zoom controls.

The framework-free service tiers now include explicit locale formatters, a
memory/WebSocket event-source port, a prefix-aware query cache, and a live
bridge that batches invalidations and resynchronizes declared keys after an
open. Query and connection failure remain separate so a screen can retain its
last successful value while reporting a disconnected source.

Astro routes compose these modules through server-rendered HTML and explicit
`<script>` boundaries. The auth endpoints are the exception that must own the
server side: sign-in and sign-up store the returned token as an HttpOnly cookie
and return only the public user value. The protected `/app` route checks that
cookie before rendering the rail shell.
