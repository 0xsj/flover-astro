# 0002 — the semantic accent uses an Astro orange ramp

**Status:** Superseded by 0003 · **Date:** 2026-09-14

## Context

The shared Flover token contract uses a named primitive color family for the
semantic accent, fill, and accent/status examples. The Next port uses green and
the Svelte port uses coral. Astro needs its own identity without changing the
meaning of warning, critical, or informational colors.

## Decision

Replace the Astro port's green accent family with an orange family. Keep the
semantic names (`--accent`, `--accent-dim`, `--accent-tint`, `--accent-line`,
`--fill`, and `--fill-hover`) stable so components consume roles rather than a
framework brand color. Keep amber, red, and blue as separate status families.

Use `#ff5d01` as the dark-theme accent reference and a darker `#b9380b` for the
light-theme accent. Use darker orange fill steps with light foreground text so
the role remains readable in both themes.

## Alternatives

- **Keep green** — rejected because the Astro port would have no visual identity
  of its own.
- **Reuse the Svelte coral family** — rejected because that would make the
  framework ports visually indistinguishable at the point where branding is
  intentionally allowed to differ.
- **Use Astro's logo asset as the accent source** — rejected because the token
  layer needs a complete, contrast-tested ramp, not an imported mark or a
  component-specific color.
- **Change semantic token names to `--astro-*`** — rejected because semantic
  roles should stay portable while only primitive palette names change.

## Consequences

- The kitchen-sink palette must show the orange primitive family and the
  semantic section must show its resolved role mappings.
- Any later Astro component may use semantic accent tokens without knowing the
  orange values.
- The chosen orange steps are project palette values, not a claim that every
  Astro brand asset uses these exact colors.
- Contrast is checked for the primary accent/fill pairs; alpha tints and
  composited surfaces remain outside the stylesheet audit until the audit grows
  a compositor.

## Verification

WCAG contrast calculations against the current token surfaces give:

- dark `#ff5d01` on `#181818`: `5.77:1`;
- light `#b9380b` on `#ffffff`: `5.78:1`;
- light text `#fff8f2` on `#913300`: `7.46:1`; and
- light text `#fff8f2` on `#b83f00`: `5.32:1`.

The token kitchen sink will expose the raw and resolved values. A rendered
browser contrast pass is still owed when the kitchen-sink page is live.
