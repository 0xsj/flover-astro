/**
 * Button — the actionable primitive.
 *
 * § CONTRACT
 * Button renders a native button by default, with `type="button"` as its
 * safe form default. `intent` and `size` select token-backed variants. Loading
 * keeps the label visible, implies inertness, and announces `aria-busy`.
 * Navigation uses an anchor via `href` rather than making a button pretend to
 * be a link. Caller attributes and children remain available.
 *
 * § MECHANICS
 * The Astro port uses native elements and attributes rather than manufacturing
 * activation handlers. An inert link loses its href, leaves the tab order, and
 * carries `aria-disabled`; an inert button receives native `disabled`.
 */
export {};
