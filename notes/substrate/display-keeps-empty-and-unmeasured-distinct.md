# Display keeps empty and unmeasured distinct

The Display group is where a successful read is most easily mistaken for a failure or a zero. `Presence` preserves `found`, `empty`, and `unmeasured`; `Stat` renders an omitted value as an em dash; `Empty` describes a successful empty collection; and `Mock` labels fixture content so a demonstration cannot quietly read like a production record.

The Astro port keeps the sibling composition model with slots for card parts, panel actions, description values, and empty-state actions. Where the siblings accept framework render values, the Astro components also expose small serializable props for plain summaries. Rich content remains markup in a slot rather than being reduced to a string-only API.

Tables remain native and compositional. `Table` adds only the keyboard-scroll region and caption contract; `THead`, `TBody`, `TFoot`, `Tr`, `Th`, `Td`, and `SortableTh` leave cell content to the caller. A header always receives a scope, and row selection is represented with a data attribute so CSS cannot become the only state channel.
