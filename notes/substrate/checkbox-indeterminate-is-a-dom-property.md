# Checkbox indeterminate is a DOM property

## Observation

HTML can express a checkbox's checked state, but it has no `indeterminate`
attribute. The mixed state exists as a DOM property on the input element and is
announced as `aria-checked="mixed"`.

## Consequence

The Astro Checkbox emits the initial mixed state as `data-state="indeterminate"`
and `aria-checked="mixed"`. Its small native browser script sets
`input.indeterminate` after the document is available and synchronizes the
visual state and ARIA value when the user changes the checkbox.

## Boundary

This is a browser enhancement around a native control, not a replacement
activation model. The control remains a real `<input type="checkbox">`, so its
labeling, keyboard behavior, form participation, and disabled behavior stay
platform-owned.
