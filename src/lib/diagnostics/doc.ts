/**
 * Diagnostics are opt-in, dependency-free observation scopes.
 *
 * A trace records only ids, trusted operation labels, stage, timing, and safe
 * failure classification. It never records URLs, headers, bodies, credentials,
 * failure messages, or arbitrary metadata. Recording is best effort: broken
 * sinks and clocks cannot change the original Result or thrown value.
 *
 * The memory recorder bounds entries and strings, projects events before
 * retaining them, supports stable snapshots, and counts evictions. Transport
 * decorators observe request outcomes; response decoders may observe their own
 * decode stage. No trace means no recording.
 */
export {};
