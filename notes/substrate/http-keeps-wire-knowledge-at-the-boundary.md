# HTTP keeps wire knowledge at the boundary

The Astro port now carries the sibling HTTP contract under `src/lib/http/` and
the opt-in diagnostics contract under `src/lib/diagnostics/`.

## Carried

- one `HttpClient` port shared by network and memory adapters;
- `Result` for routine transport outcomes rather than exceptions;
- total response failure decoding with status fallback;
- unknown success bodies decoded by explicit response readers;
- lazy tokens and correlation IDs;
- mount-safe URL joining and undefined-free query encoding;
- abortable fixture latency, request IDs, and explicit unserved-route failures;
- bounded, redacted in-memory diagnostics; and
- best-effort request/decode traces that cannot alter the original result.

## Adapted

The implementation uses Astro-neutral Web APIs and does not import Astro, a UI
framework, or route code. The response and diagnostics documentation refers to
Astro endpoint and island boundaries. Framework-specific request extraction and
composition-root wiring remain a later `src/lib/server` concern.

## Boundary rule

Only the HTTP layer names URLs, headers, status codes, and wire keys. Services
will receive `HttpClient` and response readers; they will not construct fetch
requests directly.

## Verification

The HTTP and diagnostics barrels compile as standalone modules. Focused smoke
tests passed for URL/query behavior, memory success and refusal paths,
cancellation, retry metadata, and diagnostic event recording. `yarn build` also
passes.
