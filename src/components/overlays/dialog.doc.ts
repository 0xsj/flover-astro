/**
 * Dialog — a named, dismissible surface with a trapped focus contract.
 *
 * `title` is a prop rather than a slot so an accessible name cannot be omitted
 * while a styled heading still looks complete. `description` is optional and
 * is wired to the panel when present.
 *
 * The scrim and panel are siblings. The body is separate from the footer so a
 * long form can scroll without hiding its actions. `DialogTrigger` and
 * `DialogClose` are explicit Astro wrappers because slotted children cannot be
 * cloned into a primitive with `asChild`.
 */
export {};
