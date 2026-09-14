# Render verification

> **Read the running render with a program rather than with an opinion.**
> Use after a visual pass, when a form builds cleanly, or when a theme/focus
> claim depends on hydration. Ends in a measurement or an explicit limit.

**Adopt this when** a screen carries small text, themes, forms, or post-hydration
state. **It costs you** one render, one measurement, and one focused correction
pass. **Decline it** for a page whose only claim is static layout, and do not
claim more than a screenshot proves.

## Four claims and their instruments

| Claim | Instrument | Silent failure without it |
| --- | --- | --- |
| a colour is legible | sample pixels and compute contrast | a colour that looks fine |
| a form works | drive submit/error/clear and read accessible output | a form that merely renders |
| a control preserves existing state | load the hydrated page and sample after mount | a post-hydration flip |
| a showcase is true | derive navigation/source/claims from the same data | stale presentation |

Contrast must be measured against the region the claim concerns, and the token
value should be checked separately because antialiasing makes glyph-edge pixels
conservative. Assertions should read accessible output such as `aria-invalid`,
live-region text, and error content rather than class names.

## Form probes

- Select controls by `name`, never by index; frameworks add hidden fields.
- Set values through the native property setter and dispatch a bubbling `input`
  event so the island sees the change.
- Count document loads so an unexpected native navigation is visible.
- Wrap the probe in `try/catch` and always emit a result.
- Test idle → pending → failure → cleared, not only the initial picture.

## Hydration and Astro islands

If a preference belongs to the document, the first paint must be correct before
the island mounts. The hydrated test should distinguish **adopt**—read the
existing document state—from **assert**—overwrite it with a component default.
The latter creates a visible flip that static HTML and a screenshot can miss.

## Negative controls and limits

Every probe needs one case that must fail and one that must pass before a uniform
result is trusted. A perfect score can mean that the harness never ran.

Record what was measured, what was only asserted from source, and what was not
tested. A hand-written contrast list does not prove that every real text/surface
pair was audited.
