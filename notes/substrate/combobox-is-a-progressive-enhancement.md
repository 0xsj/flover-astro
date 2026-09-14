# Combobox starts as a progressive enhancement

The first Astro picker slice renders its label, input, listbox options, disabled state, selected value, and form value on the server. A small native browser script adds filtering, arrow-key movement, Escape restoration, and option commitment.

The search query is never the submitted value. The selected option ID lives in a hidden input, while the visible input carries the human-readable label. Controlled callbacks, multi-selection, and a portalled popup remain later client-island contracts.
