# Port status

The feature port now covers all 22 Svelte kitchen-sink categories: foundations,
primitives, cards, tables, chart families, page patterns, shells, interactive
workspaces, runtime chrome, and data/failure examples. The Astro cookbook has
all 15 sibling recipe surfaces, including canvas and live updates, plus the
public seven-chapter manual.

The framework-free layers include kernel, HTTP, diagnostics, chaos, roots,
storage, URL state, locale, query invalidation, realtime sources, and the
session, ledger, example, access, and jobs service contracts. Astro-specific
server boundaries include auth endpoints, HttpOnly cookie ownership, protected
`/app`, shell previews, and the existing activity/session API doors.

Evidence collected during this pass:

- `yarn build` passes in server mode with the Node adapter.
- Unauthenticated `/app` redirects to `/sign-in?returnTo=/app`.
- Demo sign-in returns only `{ user }` and sets the HttpOnly session cookie.
- Form-encoded sign-in and sign-up fall back to same-origin redirects, while
  scripted submissions retain JSON responses and field-level errors.
- Canvas supports keyboard movement plus pointer node dragging, panning, and
  zoom controls; editable dashboard surfaces support pointer move/resize and
  keyboard arrangement.
- Authenticated `/app`, shell preview, and live-updates routes return 200.

`yarn run check` now exists, but it reports 380 legacy diagnostics from the earlier
Astro port's untyped inline scripts and a few pre-existing component contracts.
The newly added workspace, auth, locale, query, realtime, cards, tables, data,
canvas, and live-update surfaces introduce no filtered diagnostics. A future
verification pass should make the checker clean before treating it as a gate;
cross-browser and accessibility suites are not claimed by this record.
