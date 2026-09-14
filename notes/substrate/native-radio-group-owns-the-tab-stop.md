# Native radio groups own the tab stop

## Observation

Radio inputs with the same `name` are already a platform group: Tab enters the
selected option (or the first available option), arrow keys move within the
group, and form submission serializes one value. A custom roving-tab index
would duplicate that contract and create another place for it to drift.

## Consequence

The Astro port keeps `RadioGroup` as a styling wrapper and renders each `Radio`
as a real input with an explicit shared `name`. The `Fieldset` legend supplies
the question announced before the options.

## Boundary

Because Astro default slots cannot inject props into slotted children, the
shared `name` is intentionally repeated on each `Radio`. This keeps the server
HTML functional with JavaScript unavailable and makes the form contract visible
at the call site.
