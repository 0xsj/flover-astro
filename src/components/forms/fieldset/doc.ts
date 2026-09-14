/**
 * Fieldset — the group counterpart to Field.
 *
 * § CONTRACT
 * `legend` names the shared question and is rendered as a real `<legend>`.
 * `hint` qualifies the group before its controls; `error` follows the controls.
 * When either is present, the fieldset keeps the description wiring on its own
 * container. Children are plain slot content because there is no single control
 * to receive group-level attributes.
 *
 * § MECHANICS
 * `min-inline-size: 0` is intentional: native fieldsets default to a min-content
 * size that can force a grid column open. The error state uses `aria-invalid`
 * so the container's announced state and its visual border share one signal.
 */
export {};
