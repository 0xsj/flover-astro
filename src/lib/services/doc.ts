/**
 * services — one directory per domain, and the only tier that names endpoints.
 *
 * A service receives its `HttpClient` as the first argument, declares its
 * transport and domain failures, decodes successful `unknown` responses, and
 * leaves caching, rendering, adapter selection, and framework behavior to
 * higher layers. `CallOptions` stays last so cancellation and diagnostics are
 * available without handing callers the endpoint back.
 */
export {};
