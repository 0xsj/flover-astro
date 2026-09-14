/**
 * Checkbox — membership in a set, with a real third state.
 *
 * § CONTRACT
 * `checked`, `unchecked`, and `indeterminate` are states, not visual variants.
 * The mixed state reports `aria-checked="mixed"`; it is not a checked box with
 * a different color. The label remains outside the control so the caller can
 * make the entire phrase the hit target with `Label for={id}`.
 *
 * There is no CheckboxGroup. A group of checkboxes uses `Fieldset` with a
 * `legend`, the same platform grouping needed by radio controls.
 *
 * § ASTRO MECHANICS
 * HTML has no indeterminate attribute. The server emits the initial state and
 * the bundled native script sets the DOM `indeterminate` property after the
 * document is available, then synchronizes `data-state` and `aria-checked` on
 * native change events. No custom activation handler replaces the checkbox.
 */
export {};
