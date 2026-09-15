/**
 * The cache is intentionally framework-free. Result values are unwrapped at
 * the query boundary, failures remain values for callers, and live events
 * invalidate data rather than recreating component identity.
 */
export {};
