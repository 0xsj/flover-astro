/**
 * RadioGroup and Radio — one of several, with the group owning the value.
 *
 * § CONTRACT
 * `Radio` renders a native radio input with an explicit shared `name` and
 * `value`. `RadioGroup` supplies the visual wrapper; `Fieldset` owns the
 * question through its `<legend>`. The group has no indeterminate state: no
 * answer yet is simply no radio selected.
 *
 * Same-name native radios provide one tab stop for the group and arrow-key
 * movement between options. The browser owns that interaction and form
 * serialization; the component does not replace it with a custom roving-tab
 * index or activation handler.
 *
 * § ASTRO BOUNDARY
 * Astro slots cannot inject the group's `name` into each slotted Radio. The
 * Astro port therefore requires `name` on every Radio so the server HTML is
 * fully functional even before any browser script runs. This is deliberately
 * explicit rather than relying on client-side DOM repair.
 */
export {};
