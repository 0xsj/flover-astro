/**
 * Input and Textarea — text controls that own nothing but themselves.
 *
 * § CONTRACT
 * Both share the same size scale (`sm`, `md`, `lg`) and optional `mono` style.
 * `Input` deliberately takes over the prop name `size` for control height, so
 * the platform input character-width attribute is not part of this primitive.
 * `Textarea` shares the styles and defaults to four rows, but remains a separate
 * element with a separate contract.
 *
 * Neither control owns a label, hint, error, or validation state. `Field` owns
 * those surrounding concerns and supplies the attributes that connect them.
 * Invalid styling keys off `[aria-invalid]`, so the announced state and the
 * visual state cannot drift into separate props.
 *
 * § ASTRO BOUNDARY
 * These are server-rendered native controls. Value changes, submission, and
 * validation remain browser/form concerns until a later interactive island is
 * explicitly justified.
 */
export {};
