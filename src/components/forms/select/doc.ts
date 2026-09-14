/**
 * Select — a value bound to a form, not a menu.
 *
 * § CONTRACT
 * `Select` renders a native single-value `<select>` and accepts ordinary
 * `<option>` children. The caller owns the option list and marks the initial
 * choice with the platform `selected` attribute. Field owns its label, hint,
 * error, and the attributes that connect them to this control.
 *
 * A select picks a submitted value and reopening it reveals the current value.
 * A menu picks an action and has no submitted value. They may look similar but
 * announce different things, so this component does not pretend to be a menu.
 *
 * § ASTRO BOUNDARY
 * This first Astro slice intentionally keeps the native control. The sibling
 * ports add a portalled headless list with keyboard highlight state and a custom
 * trigger; that requires a concrete client interaction contract and is deferred
 * rather than shipped as a partially functional popover.
 */
export {};
