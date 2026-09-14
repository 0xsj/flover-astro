/**
 * Overlays — content that appears over the page and the interaction obligations
 * that come with it.
 *
 * The browser runtime owns four behaviours that a screenshot cannot prove:
 * focus enters the overlay, Tab stays inside it, Escape and the correct outside
 * action dismiss it, and focus returns to the trigger. Dialogs and popovers
 * also lock page scrolling while open.
 *
 * Astro boundary: triggers and close controls are explicit wrappers around
 * slotted HTML. Astro does not clone a child the way a React `asChild` or a
 * Svelte snippet can, so the runtime finds the first focusable descendant and
 * wires that real control instead of manufacturing a second button.
 *
 * Dialog is dismissible: outside click, Escape, and a close button are valid
 * exits. Its `title` is a required prop and remains in the accessibility tree
 * when `hideTitle` is used.
 *
 * AlertDialog requires a choice. It has no close button and no outside click
 * dismissal; Escape is the safe cancel path. Its `description` is required,
 * and focus starts on the panel rather than the destructive action.
 *
 * Popover is focusable and may contain controls. Tooltip is supplementary,
 * opens on hover or focus, and must never be the only name or instruction for
 * its trigger. DropdownMenu is a list of actions: it has no current value and
 * nothing is submitted. A Select is the value-owning form control.
 */
export {};
