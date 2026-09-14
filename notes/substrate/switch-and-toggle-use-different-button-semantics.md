# Switch and Toggle use different button semantics

## Observation

HTML has no native switch element. A switch is therefore a button with
`role="switch"` and an `aria-checked` value. A toggle is already a button and
reports its pressed state with `aria-pressed`.

## Consequence

The Astro `Switch` and `Toggle` components render native buttons and use a
small browser script to synchronize their ARIA state and token-facing
`data-state` after activation. Keyboard activation and disabled behavior remain
owned by the native button.

## Boundary

These controls are intentionally not interchangeable. A Checkbox represents
submitted membership, a Switch changes an immediate setting, and a Toggle
changes a view. The kitchen sink keeps the comparison copy beside each case so
the similar silhouettes do not erase the semantic difference.
