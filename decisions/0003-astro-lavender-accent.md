# 0003 — the semantic accent uses an Astro lavender ramp

**Status:** Accepted · **Date:** 2026-09-14 · **Supersedes:** 0002

## Context

The first Astro token pass used orange as its accent family. That overlaps with
the Svelte port's visual identity, so the Astro port needs a distinct accent
while preserving the shared semantic token contract.

## Decision

Use a lavender primitive family for Astro. Keep the semantic names
(`--accent`, `--accent-dim`, `--accent-tint`, `--accent-line`, `--fill`, and
`--fill-hover`) stable so components consume roles rather than framework brand
values. Keep amber, red, and blue as separate status families.

Use brighter lavender values for dark-theme accents and a darker lavender value
for the light-theme accent. Use darker lavender fill steps with light text so
the role remains readable in both themes.

## Alternatives

- **Keep orange** — rejected because it overlaps with the Svelte port.
- **Reuse the Svelte coral family** — rejected because the framework ports need
  distinct visual identities.
- **Keep green** — rejected because it does not establish a clear Astro accent.
- **Change semantic token names to `--astro-*`** — rejected because semantic
  roles should stay portable while only primitive palette names change.

## Consequences

- The kitchen-sink palette shows the lavender primitive family and resolved
  semantic role mappings.
- Astro components can use semantic accent tokens without knowing lavender
  values.
- The chosen lavender steps are project palette values, not a claim about an
  official Astro brand color.
- Contrast is checked for the primary accent/fill pairs; alpha tints and
  composited surfaces remain outside the stylesheet audit.

## Verification

`yarn build` must pass, and the token kitchen sink must expose the raw lavender
ramps, resolved semantic roles, and dark/light contrast audit.

The selected reference pairs calculate to:

- dark `#b899ff` on `#181818`: `7.64:1`;
- light `#7150b3` on `#ffffff`: `6.00:1`;
- dark light-text fill `#fbf9ff` on `#6545a0`: `6.90:1`; and
- light white-text fill `#ffffff` on `#6545a0`: `7.21:1`.
