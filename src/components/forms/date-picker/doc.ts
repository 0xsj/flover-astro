/**
 * DatePicker and DateRangePicker — calendar dates, with no implied instant.
 *
 * § CONTRACT
 *
 * DatePicker accepts a Gregorian YYYY-MM-DD string or null. DateRangePicker
 * accepts { start, end } with inclusive dates, or null. Values stay date-only:
 * the native date control displays a calendar while form submission remains an
 * ISO calendar string with no timezone conversion.
 *
 * Min and max are inclusive. `unavailableDates` marks known dates that cannot
 * be chosen; the range control rejects a range crossing one of them. A range
 * must be complete and start must not follow end. Required, disabled,
 * read-only, hint, and error states remain ordinary form semantics.
 *
 * § ASTRO BOUNDARY
 *
 * The first port uses native date inputs, so typed segments, the browser
 * calendar, keyboard movement, validation, reset, and form serialization stay
 * platform-owned. The sibling predicate API and custom portalled calendar are
 * deliberately deferred until a client-island contract is needed.
 */
export {};
