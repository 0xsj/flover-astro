# Native select is the first Astro port

## Observation

The sibling Select components replace the platform control with a headless
trigger, portalled list, current-value primitive, keyboard highlight state, and
selection wiring. Astro's current port has no client component contract for
that larger interaction surface.

## Consequence

The first Astro Select renders a real `<select>` with ordinary `<option>`
children. It keeps the current value, form serialization, keyboard behavior,
option announcement, and field ARIA wiring in the platform control. The visual
wrapper only adds token-backed styling and a non-interactive chevron.

## Boundary

This is not a second fallback shipped beside a custom select. It is the complete
first slice. A later custom list should be added only with a documented
client-island decision covering focus, keyboard highlight, portal placement,
outside dismissal, and form value synchronization.
