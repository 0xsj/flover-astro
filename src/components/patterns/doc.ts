/**
 * Patterns — common arrangements of primitives with caller-owned behavior.
 *
 * `PageHeader` composes a required title, optional description, leading
 * context, actions, and an explicit heading level. `CollectionToolbar` keeps
 * controls, summary, and actions as independent slots that wrap cleanly.
 * `SelectionCard` supplies a visual card around a native radio or checkbox;
 * its group name, checked state, and disabled state remain caller-owned.
 *
 * None of these components fetch, change routes, or invent permissions. Astro
 * renders their structure on the server and adds only the small native binding
 * needed to keep selection-card state visible to the composition.
 */
export {};
