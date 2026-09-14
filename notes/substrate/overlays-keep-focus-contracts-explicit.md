# Overlays keep focus contracts explicit

The sibling projects use a focus primitive for overlays. Astro does not provide a framework-owned overlay state machine, so this port keeps the contract in a small browser runtime and keeps the server output meaningful before it runs.

Dialog and AlertDialog render named panels, a scrim, and explicit trigger/close wrappers. Dialog accepts outside dismissal and a close affordance; AlertDialog does not, and its required description plus panel-first focus make the destructive choice deliberate. Popover and DropdownMenu position fixed panels and restore focus on exit; the menu also exposes keyboard highlight through `data-highlighted`. Tooltip opens from hover and focus but remains supplementary and non-interactive.

The trigger wrappers are an Astro-specific adaptation of the siblings' `asChild` composition. They do not manufacture another control: the runtime finds and annotates the first focusable slotted descendant. Panel IDs are assigned and collision-checked so repeated instances retain valid `aria-controls`, `aria-labelledby`, and `aria-describedby` relationships.
