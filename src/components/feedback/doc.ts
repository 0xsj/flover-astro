/**
 * Feedback — messages about the page rather than about a field.
 *
 * A field's error belongs to its Field, which owns the wiring that connects it
 * to a control. Anything wider than one input belongs here.
 *
 * `live` is off by default. A live region announces when its contents change;
 * most alerts are rendered with the page and should be read in document order
 * like prose. `polite` waits for the reader's current sentence, while
 * `assertive` interrupts for something that must be acted on immediately.
 *
 * Skeletons are hidden from assistive technology. The busy state belongs on
 * the containing region as `aria-busy`, which gives one useful announcement
 * instead of repeating "loading" for every placeholder.
 *
 * Progress distinguishes a measured zero from an unknown amount: `null` is
 * indeterminate, not zero. ErrorSurface avoids presenting redacted server
 * detail as meaningful and offers retry only when trying again could change
 * the answer.
 *
 * Astro's server component boundary means dismissible alerts use a small
 * bundled browser script, while application-specific retry callbacks belong in
 * a client island. The server-safe ErrorSurface accepts a retry URL instead.
 */
export {};
