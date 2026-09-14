/**
 * Utility — small mechanisms other components need.
 *
 * `Icon` is the inventory of the seven visual marks currently used by the
 * Astro port. Decorative icons are hidden at the call site. `AccessibleIcon`
 * is for the rare case where the icon itself is the meaning; Astro uses a
 * named wrapper because slots cannot clone child SVG attributes.
 *
 * `VisuallyHidden` keeps text in the accessibility tree with frozen inline
 * clipping styles. Its `as` prop lets it own an existing semantic element;
 * child-as-element cloning is not available across an Astro slot boundary.
 * `Portal` progressively moves its server-rendered placeholder's children to
 * a target after load. It is not a substitute for an overlay's own focus and
 * dismissal contract.
 */
export {};
