# Page-level shells

The shell batch ports the sibling `AppShell`, `AuthShell`, `SidebarNav`,
`NavigationRail`, `RailLink`, `ContextSidebar`, and `RailShell` contracts as
Astro compositions. The shells own landmarks, layout, responsive geometry,
and small browser bindings; callers still own navigation data, forms, content,
and submit behavior.

`SidebarNav` is the data-driven exception among the frame components. It
matches the current URL by path segment, so a section remains selected on
nested routes without treating `/app` as a match for `/apples`. `RailLink`
keeps the compact rail accessible by pairing its caller-provided glyph with a
tooltip label and description.

The `/shell-preview/[variant]` route renders isolated documents for the
standard, rail, and authentication frames. This prevents nested page
landmarks and preference controls from contaminating the kitchen-sink page.
`RailShell` keeps a native disclosure button for the contextual sidebar and
uses a container query so the same composition moves the sidebar below the
header at narrow widths.

The siblings use framework-specific navigation and icon primitives. Astro
keeps those as owned wrappers and caller-supplied glyph content in this batch;
the transport, form, and navigation behaviors remain replaceable at their
boundaries.
