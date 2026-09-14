/**
 * URL state — contract written before implementation.
 *
 * Portable codecs for public, shareable query state. Text, string choices, and
 * bounded positive integers have typed defaults. A schema owns named query keys
 * and infers its state type. It knows no route, router, browser, or framework.
 *
 * Reading never rewrites a URL. Missing keys use defaults without an issue.
 * Duplicate scalar keys and malformed values use that key's default AND return
 * a named issue. Other valid keys are retained. Issue messages never echo raw
 * values. Writing validates the full proposed state, preserves unrelated query
 * keys, omits defaults, and returns Result without changing browser state.
 *
 * Query values are intentionally visible in history and shared links. Keep
 * credentials, secrets, and private form contents out of this state.
 */
export {};
