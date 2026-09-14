/**
 * Field — the owner of a control's label, hint, and error.
 *
 * § CONTRACT
 * `label` and `controlId` are required. The label points to the control by
 * identifier. `hint` and `error` render only when supplied; when both exist,
 * the error is named first in `aria-describedby`. `required` marks the control
 * and the visible asterisk is hidden from assistive technology.
 *
 * The control itself remains the caller's responsibility. Apply the result of
 * `fieldControlProps({ id, hint, error, required })` to that control so its
 * `id`, `aria-describedby`, `aria-invalid`, and `required` attributes match the
 * Field.
 *
 * § ASTRO BOUNDARY
 * The sibling ports use a render function / snippet parameter so Field can hand
 * these attributes directly to its child. Astro's default slots are content-
 * only, so this port requires an explicit control id and a shared wiring helper.
 * That is more ceremony, but it keeps the IDs and attribute order inspectable
 * instead of cloning or guessing at slotted markup.
 *
 * § DELIBERATELY ABSENT
 * Field owns no `name`, value, change handler, validation source, or control
 * element. It owns the things around one control; it is not a form library.
 */
export {};
