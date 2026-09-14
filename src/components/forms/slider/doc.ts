/**
 * Slider — one numeric value within a range.
 *
 * § CONTRACT
 * `label` is required. `min`, `max`, `step`, `value`, `defaultValue`,
 * `disabled`, and `name` map to the native range control. Arrow keys adjust one
 * step; Home and End select the bounds; a disabled slider leaves keyboard
 * interaction and form submission. A visible value is optional and belongs to
 * the caller through `outputId`.
 *
 * § ASTRO BOUNDARY
 * The sibling ports expose controlled values and change/commit callbacks from
 * their headless slider. This Astro first slice keeps the input native: the
 * `value` / `defaultValue` prop establishes the initial server value, and the
 * browser owns subsequent changes. When an output is named, a small native
 * browser script mirrors the range value and track progress into it.
 *
 * This slice has one thumb. A multi-thumb range needs a separate value and
 * keyboard contract and is intentionally not implied by this component.
 */
export {};
