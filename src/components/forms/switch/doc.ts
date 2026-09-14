/**
 * Switch — a setting that takes effect when it is flipped.
 *
 * § CONTRACT
 * A switch reports `aria-checked` and changes immediately. It is for a setting,
 * not membership in submitted form data and not a view toggle. There is no
 * loading state: an asynchronous effect should make the surrounding region
 * busy and surface its failure where failures belong.
 *
 * The label remains outside the control. Use `Label for={id}` so the setting's
 * name is associated without making the switch own an ID or a label prop.
 *
 * § ASTRO MECHANICS
 * The platform has no native switch element. Astro renders a real button with
 * `role="switch"`; the small native browser script toggles `aria-checked` and
 * `data-state`. Button keyboard activation remains platform-owned, and the
 * native `disabled` attribute prevents interaction.
 */
export {};
