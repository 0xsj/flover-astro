# Ordinary metric charts

The first chart batch ports the small dependency-free family from the sibling
projects. `ChartFrame` owns the figure contract and composition slots;
`ChartLegend` makes series identity visible through a label and line style;
`LineChart` owns SVG geometry plus an exact-value disclosure table; and
`BarChart` keeps labelled values beside their bars.

The boundary semantics are intentional: zero is measured, `null` or non-finite
values are unavailable, a missing line value breaks the path, and empty rows are
not silently converted to a loading or success state. Values use the shared
chart token family, which stays separate from application status colors.

The Astro adaptation is server-rendered and dependency-free. The period switch
on the kitchen-sink example is a small native browser binding that swaps two
already-rendered data windows. The graph/network family now composes over the
same pure kernel in its own kitchen-sink batch.
