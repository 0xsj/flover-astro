# Accessibility

> **A floor every interactive component clears before it ships, with the worst
> defects made structurally difficult to create.**
> Use when adding a control, field, overlay, or shell. Ends in a detection
> mechanism per rule and an honest list of what remains review-only.

**Adopt this when** the project ships interactive UI. **It costs you** keyboard
tests, accessible-output assertions, and a review pass. **Decline it** only for a
surface with no controls, and record that scope explicitly.

## The floor

| Rule | Detection |
| --- | --- |
| Every interactive primitive is keyboard reachable and operable | browser test and axe |
| Focus remains visible and uses the focus-ring token | CSS check plus render measurement |
| Disabled controls are not focusable and links drop `href` | source check and browser test |
| Loading controls set `aria-busy` and keep their accessible name | review and interaction test |
| Colour is never the only carrier of meaning | review |
| Icon-only controls have an accessible name | type/source check and axe |
| Overlays restore focus to their trigger | hydrated browser test |

## Two shapes worth preserving

**Hand form wiring to the caller.** A field wrapper should provide a complete
bag—`id`, `aria-describedby`, `required`, and `aria-invalid`—and the caller
should place it on the actual control. A wrapper that clones or guesses its
child loses the wiring when the child becomes a row, adapter, or conditional
fragment. Error text should precede the hint in `aria-describedby`; the hint is
not replaced when an error appears.

**Primitives do not manufacture handlers.** Pass behavior through from the
caller and express inertness with platform state: `disabled`, removed `href`,
`tabindex`, and data attributes for styling. Astro server-rendered markup and
interactive islands must not acquire an unrequested handler as a side effect
of rendering a primitive.

## Astro boundary

Server HTML is not proof of hydrated behavior. Focus restoration, live-region
announcements, keyboard interaction, and browser-owned state must be checked on
the running island. The island mechanism may differ from the siblings, but the
accessible contract must not.

## What nothing detects

Automation cannot decide whether a loading name is intelligible, whether colour
is being used meaningfully, whether compact density is usable at zoom, or what a
particular screen reader announces. An axe-clean result is a floor, not a claim
that assistive-technology testing was complete.
