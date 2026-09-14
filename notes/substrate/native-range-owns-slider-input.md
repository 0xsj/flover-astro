# Native range owns the first Astro Slider

## Observation

The sibling Slider components adapt a headless one-thumb control into numeric
values and change/commit callbacks. The browser's native range input already
owns the essential interaction: arrows adjust by `step`, Home and End select
the bounds, pointer dragging changes the value, and `name` participates in form
submission.

## Consequence

The first Astro Slider renders a real `<input type="range">` with token-backed
track/thumb styling. An optional output is a separate native `<output>` named by
`outputId`; a small browser script mirrors input events and progress into it.

## Boundary

The initial `value` / `defaultValue` establishes server-rendered state. Controlled
callbacks, commit tracking, and multi-thumb ranges are deferred until they have
a concrete client-state contract rather than being simulated with a partially
controlled component.
