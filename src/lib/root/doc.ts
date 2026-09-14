/**
 * root — the composition root and the only tier that picks an adapter.
 *
 * It accepts token, backend, served-domain, fixture, latency, correlation, and
 * chaos inputs rather than reading cookies, headers, query strings, or framework
 * request state. The Astro server boundary assembles those values per request.
 *
 * One root belongs to one interaction. Domain clients share its correlation id,
 * while the root caches at most one memory client and one network client. A
 * backend can graduate domains independently through `served`.
 *
 * The fixture table is composed explicitly from the ported service domains. An
 * unserved request remains an explicit `internal` / `unserved_route` result.
 * Service ports never register routes through module-import side effects.
 */
export {};
