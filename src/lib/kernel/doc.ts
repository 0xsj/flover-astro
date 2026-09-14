/**
 * kernel — the framework-free foundation of the Astro port.
 *
 * This module imports nothing from Astro, a UI framework, or a transport.
 * Every higher layer may depend on it; it must not depend upward.
 *
 * # Failure is a value
 *
 * `Failure` is a discriminated union of plain objects. That keeps failures
 * usable after an Astro endpoint serializes them or an island receives them.
 * Transport failures can happen on any call, while domain failures are the
 * operation-specific cases a service may promise through `narrow(...)`.
 *
 * `Result` carries the answer without throwing. It is a class for ergonomic
 * composition, but it must be unwrapped before crossing an endpoint or an
 * Astro client-island boundary. `Failure` may cross as plain data.
 *
 * # Three states
 *
 * `optional(...)` requires the caller to identify which `not_found` response
 * means legitimate absence. An unknown `not_found` becomes `internal` with
 * the original failure as its cause. `Presence` then names the three render
 * states explicitly: found, empty, and unmeasured.
 *
 * # Correlation and causes
 *
 * `correlationId` groups calls belonging to one interaction. `requestId`
 * identifies one transport attempt. A cause chain preserves the lower-level
 * failure when a layer adds context or folds an unexpected domain kind.
 *
 * # Retry
 *
 * Retry policy is expressed in terms of failure kinds, never HTTP status codes.
 * Rate limits honor the server's delay; unavailable and timeout use bounded
 * exponential backoff. Cancellation is an answer from the caller and is not
 * retried.
 *
 * # The floor
 *
 * The kernel stays small and dependency-free. URL, status, headers, endpoint
 * names, browser state, and framework behavior belong in higher layers.
 */
export {};
