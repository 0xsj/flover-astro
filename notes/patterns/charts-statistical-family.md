# Statistical chart family

The statistical batch shares one `PlotFrame` for axes, grid lines, rules, tick
formatting, and scrollable named SVG regions. `Volcano`, `BubblePlot`, and
`RankedBar` keep their transforms explicit: callers provide already-transformed
values, bubbles map weight to area, and ranked bars sort because order is part
of the finding.

`Matrix` preserves four states: a measured value, looked-and-empty, never
checked, and not applicable. The last state is excluded from coverage ratios;
the other three never collapse into an invented zero. Its exact-value table is
always available, and the Astro binding adds pointer, Enter, Space, and table
selection without introducing a chart runtime.

This batch is server-rendered and dependency-free. It ports the statistical
marks, color ramp, category legend, absence key, and colour bar. The graph/network
family is intentionally separate because deterministic layout and selection
introduce a different interaction contract; it is now documented in the network
chart note and demonstrated beside these charts in the catalog.
