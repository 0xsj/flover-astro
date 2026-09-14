# Enforcement

> **A convention is real only when a check can find its violation.**
> Use when a boundary matters enough to defend. Ends in a rulebook whose checks
> have negative controls and whose gaps are named.

**Adopt this when** more than one person or session edits the tree. **It costs
you** a rule registry and deliberately invalid fixtures. **Decline it** for a
throwaway spike, and record that reason rather than presenting review as an
automated guarantee.

## Rule shape

Every rule has four fields:

| Field | Meaning |
| --- | --- |
| Statement | what must be true |
| Detect | how a checker finds a violation |
| Message | names the file and rule id |
| Exempt | what is excluded and why |

```text
S1 · services are framework-free
Statement — service modules import neither Astro nor a UI framework
Detect    — resolve imports from lib/services/** and flag framework edges
Message   — lib/services/example imports astro — services are plain (S1)
Exempt    — framework bindings and test fixtures, with reasons
```

A rule with no detection method is guidance, not enforcement. A disabled rule
must carry a reason; `false` is not a reason.

## First boundaries for Flover Astro

Once the source tree exists, the first mechanical checks should cover:

- no sibling project imports;
- framework imports confined to named Astro bindings or islands;
- third-party primitives imported only by their owned wrappers;
- services and portable models free of Astro/framework imports;
- URL, status, and header knowledge owned by transport/service boundaries;
- protocols never imported by application code; and
- the global cascade entry point appearing before component style imports.

The exact tiers and exemptions are not declared enforced yet. They should be
recorded in a project rulebook when the first detector is ported.

## The checks must check themselves

Zero matched files is not zero violations. A checker must fail when its include
matches no files. Every mechanical rule needs a deliberately invalid fixture,
and every browser or measurement harness needs a negative control whose result
must be the opposite of the normal case.

Do not confuse a clean mechanical report with a semantic review. Reuse,
meaningful failure recovery, visual legibility, and whether a component makes
the right promise remain human judgments unless a precise detector is added.

## What stays human

No static rule can reliably decide whether a domain word belongs in a primitive,
whether a client permission check replaces a server check, whether compact
density is usable, or whether the chosen token expresses the intended meaning.
Report those as review lenses rather than pretending the detector closed them.
