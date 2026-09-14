/**
 * Toggle — a button that stays pressed.
 *
 * § CONTRACT
 * It reports `aria-pressed`, which makes it a toggle rather than a button that
 * merely looks different when active. Its job is a view change—bold text, an
 * active filter, a visible panel—not submitted data or an immediate setting.
 * `pressed` / `defaultPressed` provide the initial state; `size` and `shape`
 * select token-backed presentation.
 *
 * An icon-only toggle needs an accessible name through `aria-label`, just like
 * an icon-only Button. The component does not invent one from its children.
 *
 * § ASTRO MECHANICS
 * The rendered element is a native button. A small native browser script keeps
 * `aria-pressed` and `data-state="on|off"` synchronized after activation; the
 * state is intentionally not styled from an author-only class.
 */
export {};
