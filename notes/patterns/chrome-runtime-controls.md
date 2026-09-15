# Runtime chrome controls

The chrome batch ports the sibling `Mark`, `Segmented`, `ThemeToggle`, and
`DensityToggle` components. `Segmented` is a named native radio group with one
roving tab stop, checked state, pointer activation, and arrow/Home/End keyboard
movement. The two preference controls are thin bindings over `src/lib/runtime`;
they do not create a second preference store.

The root boot string still handles first paint. After the page is interactive,
the controls hydrate the persisted browser choice and keep the radio state and
the document token attributes synchronized. `system` remains a real theme
choice and is represented by removing `data-theme`; density remains a two-state
browser preference with no invented system mode.

`Mark` owns the `flover-astro` spelling once while the caller chooses `span`,
`h1`, or `h2` and the inline/display size. The kitchen-sink header now uses
these same components, so the catalog controls and the documented examples
cannot drift apart.
