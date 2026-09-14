# The composition root selects adapters per domain

The Astro port now carries the sibling composition root under
`src/lib/root/`.

## Carried

- one root per interaction;
- one shared correlation ID across that interaction;
- at most one shared memory client and one shared network client;
- per-domain backend graduation through `served`;
- explicit fixture overrides and fixture provenance;
- eager chaos detection for surface-level warnings; and
- diagnostics outside the chaos decorator.

## Adapted

The fixture table is now composed from the session and ledger domains. The root
still does not read Astro cookies, headers, or URL state; those values will be
assembled by `src/lib/server` and passed into `createRoot` later.

The development chaos parser and decorator are also ported under
`src/lib/chaos/`, including explicit sequence simulations for later recovery
examples.

## Verification

The root, chaos, HTTP, diagnostics, and kernel barrels compile as standalone
modules. Focused root behavior checks are added here before domain fixture
routes are introduced.
