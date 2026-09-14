# Astro default slots do not carry child props

## Observation

The sibling `Field` components accept a render function / snippet parameter and
hand the generated `id`, `aria-describedby`, `aria-invalid`, and `required`
attributes directly to the control. Astro's default slots are content-only, so
an Astro component cannot pass that props object into slotted markup.

## Consequence

The Astro port keeps the same wiring rules with an explicit `controlId` on
`Field` and the shared `fieldControlProps` helper in
`src/components/forms/field/field.ts`. The page applies the returned attributes
to the native control. This is more visible ceremony than the sibling APIs, but
it avoids cloning, DOM guessing, or a custom client-side handler just to connect
a label and its descriptions.

## Boundary

This is an Astro substrate constraint, not a reason to add a framework island.
The controls remain native server-rendered HTML until a later component has a
concrete interaction contract that requires client state.
