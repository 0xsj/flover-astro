/**
 * Badge — a status. Never colour alone.
 *
 * # The word is the status; the colour and the glyph are reinforcement
 *
 * A badge that says only *red* is unreadable in greyscale, on a projector, in
 * bright sun, and to the eight percent of men who cannot separate red from
 * green. The text is always present and is what a screen reader announces; the
 * tone tints it, and `glyph` adds a second non-colour channel for the cases
 * where a scan is by shape.
 *
 * The glyph is `aria-hidden`. It repeats the text for the eye, and announcing
 * "black circle healthy" helps nobody.
 *
 * # Five tones, and they are semantic
 *
 * `neutral · accent · warn · crit · info` — the token layer's own vocabulary,
 * so a badge cannot introduce a sixth meaning that exists in one component. A
 * caller wanting a colour that is not a status wants something that is not a
 * badge.
 *
 * # Deliberately absent
 *
 * A `size`. A status is read at one size; a second one is a request for a
 * different component in disguise, usually a tag or a chip.
 *
 * Dismissal. A badge that can be removed is a chip, it needs a control,
 * a keyboard contract and an announcement, and none of that belongs in a span
 * whose job is to say a word.
 */
export {};
