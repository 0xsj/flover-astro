/**
 * Display — what a screen shows when it is not asking for anything.
 *
 * This is where the three-state rule is easiest to lose. `Presence` keeps
 * found, empty, and unmeasured distinct; `Stat` renders an omitted value as
 * `–`, never as zero; and `Empty` presents a successful empty result rather
 * than styling it like a failure. `Mock` makes fixture data visible as a
 * disclaimer instead of letting a demonstration look like a record.
 *
 * Cards, panels, and description lists are compositional surfaces. The caller
 * supplies the actual content and controls, while the primitives provide
 * headings, spacing, borders, and link behavior. Tables stay native and
 * compositional instead of taking rows and columns that would need a renderer
 * prop as soon as one cell contains a link, badge, or control.
 *
 * Astro boundary: child content is carried by slots and named slots rather
 * than framework render functions. Components that need a small textual
 * summary also expose a serializable prop, while richer content remains a
 * slot. `Presence` uses its default slot only for the found state; absent
 * states own their words and explanations.
 */
export {};
