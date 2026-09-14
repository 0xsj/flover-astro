# Service-domain contracts stay framework-free

The next service batch can move from Next and Svelte into Astro without changing its failure semantics because the domain layer only knows an injected HTTP port.

## Origin

Read against the matching service and composition-root implementations in
`flover-next` and `flover-svelte`, then ported into Astro on 2026-09-14.

## What

The `example`, `access`, and `jobs` domains decode untrusted response values,
preserve meaningful failures, and verify response identity before exposing data.
Their isolated fixtures belong in composition roots, not in module-global state
or framework loaders.

## Why

The losing alternative was to make Astro endpoints own service behavior. That
would duplicate validation and failure narrowing at the framework boundary,
making a server-rendered path and a future browser island disagree about
unknown responses, stale permissions, or uncertain job cancellation.

## Gotchas

- A missing capability denies by default; it never inherits a previous grant.
- A lost job-cancel response leaves cancellation unknown; it does not invent a
  canceled state.
- A lost item-save response requires receipt reconciliation before retrying.
- The default application fixture table intentionally does not pretend to serve
  these isolated cookbook contracts; their roots own their route tables.

## Used in

The Astro service ports under `src/lib/services/example`,
`src/lib/services/access`, and `src/lib/services/jobs`, with access and job
demonstrations under `src/lib/root`.

## Related

- `notes/substrate/session-services-stay-framework-free.md`
- `notes/substrate/root-selects-adapters-per-domain.md`
