/**
 * Combobox — searchable choices; selection is a value and the query is
 * temporary input.
 *
 * § CONTRACT
 *
 * A combobox chooses one option ID or no option. MultiSelect chooses an
 * ordered set of unique option IDs. Labels are for people; `value` is the
 * stable string submitted by the hidden form control. Typing a query alone
 * never submits that query. Disabled options cannot be selected, and empty
 * options and no matches are explicit states.
 *
 * The visible input owns the combobox keyboard contract: Arrow keys explore,
 * Enter commits or toggles, and Escape dismisses. The list is a labelled
 * `listbox`; MultiSelect keeps selected tags visible below the query and gives
 * each removable value a named button. The disclosure and removal actions are
 * real buttons with names.
 *
 * § ASTRO BOUNDARY
 *
 * The first Astro port keeps the component server-rendered and adds a small
 * native browser script for filtering, focus movement, and selection. It does
 * not invent a framework state callback; the selected ID remains in the hidden
 * input for ordinary form submission. Controlled state and the shared richer
 * picker engine belong in a later client-island slice.
 *
 * A portalled popup is also deliberately deferred. This list is complete for
 * normal flow; a later overlay contract can move it outside overflow-hidden
 * ancestors without changing the option or form semantics.
 */
export {};
