# Graph and network chart family

The network batch ports the sibling graph contract into an Astro-native SVG
renderer. `GraphFrame` owns the shared geometry and accessibility boundary;
the preset components only choose a layout and a small set of semantic defaults.
Every graph also exposes exact node and edge data through a disclosure table.

The layout kernel is pure and deterministic: seeded force placement, concentric
rings, circular, tiered, longest-path columns, and an honest grid fallback.
Dropped or dangling edges are ignored by the renderer and its data table, while
pins are applied after layout so a caller's explicit position always wins.

Selection is a small native browser binding. Pointer hover and focus keep the
selected node and its neighbours bright; pointer, Enter, Space, and data-table
buttons all share the same selection event. This preserves the Svelte behavior
without turning every graph into a client island.

The sibling projects use Cytoscape's synchronous CoSE engine for their `cose`
preset. Astro does not add that runtime dependency in this batch. `ForceNetwork`,
`HairballNetwork`, `CorrelationNetwork`, `EnrichmentMap`, and `ModuleNetwork`
use the seeded native force implementation instead, keeping server output stable
and leaving room for a future adapter behind the same `GraphFrame` contract.
