# Cookbook dashboard and grid

The dashboard batch keeps the sibling split visible. `/cookbook/dashboard`
renders the account and session read on the server, then gives the browser a
separate session read/revoke panel. The dashboard example uses
`createDashboardExample`: an isolated memory root that still calls the real
session service decoders and preserves `found`, `empty`, and `unmeasured`
presence states.

`/cookbook/editable-dashboard` owns the browser document binding. Its saved
value is decoded by `decodeDashboardLayout` before use; edits refuse bounds and
overlap violations; pointer gestures remain previews until the user saves; and
the native arrange menus provide the keyboard path. The CSS grid stacks on
narrow screens without changing the saved desktop coordinates. Cross-tab
changes remain visible as an external-change warning rather than silently
overwriting a local draft.

Astro uses a small native workspace package and CSS/SVG visualizations backed
by portable widget data. The chart family, including the separate network chart
batch, can be composed into this surface without changing the layout or storage
contracts.
