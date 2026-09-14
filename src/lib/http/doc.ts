/**
 * http — the transport port and its two adapters. The only layer that knows
 * HTTP status codes, headers, URLs, and wire keys.
 *
 * Calls return `Result`, so routine transport failure is explicit. The memory
 * adapter implements the same port as fetch and reproduces refusals, latency,
 * cancellation, request ids, and correlation ids. The root chooses the
 * implementation; services receive the selected client.
 *
 * Successful bodies remain `unknown`. Response readers validate and project
 * domain DTOs after either adapter answers. A malformed 2xx body is an
 * `internal` / `invalid_response` contract failure, not an unavailable server.
 *
 * `envelope.ts` is the only wire anti-corruption layer. It is total, accepts
 * snake_case and camelCase metadata, preserves unrecognized server kinds in
 * `type`, and maps status codes to behavior only when the body has no kind.
 *
 * Timeout and caller cancellation are combined, but remain distinguishable by
 * error name. An unserved fixture path is `internal` / `unserved_route`, not
 * `not_found`, because no fixture answered it.
 */
export {};
