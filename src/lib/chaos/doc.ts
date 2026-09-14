/**
 * chaos — force states that ordinary fixtures do not naturally expose.
 *
 * Chaos is a decorator over `HttpClient`, not a fixture or an interceptor. It
 * can force failures, empty values, latency, or a cancellable hang while the
 * service and UI continue through their ordinary Result path. Plans can be
 * expressed in a link query string and seeded for replayability.
 *
 * A fixture reproduces what the server does; chaos forces what it could. The
 * composition root is the only application-wide caller, and production leaves
 * the client untouched. Explicit sequence clients are isolated simulations for
 * recovery examples, never implicit application configuration.
 */
export {};
