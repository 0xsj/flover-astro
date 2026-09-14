# Decisions

> **A decision that is not recorded will be re-litigated after the information
> that produced it is gone.**
> Use before making a choice that is expensive to reverse. Ends in a record with
> real alternatives, named verification, and an explicit status.

**Adopt this when** a dependency, boundary, public contract, or declared scope
will be questioned later. **It costs you** a short record before coding. **Decline
it** for a reversible local choice that nobody needs to revisit.

## Shape

```markdown
# 0001 — a claim, not a topic

**Status:** Proposed · **Date:** 2026-09-14

## Context
The constraint that made this require deciding.

## Decision
What is now true, written imperatively.

## Alternatives
What else was considered and why each lost.

## Consequences
What this enables and what it makes harder.

## Verification
The check, test, measurement, or explicit "not verified".
```

The title is a claim. `Astro architecture` is a topic; `Astro server output
uses an adapter so session cookies remain server-owned` is a decision.

## Before the implementation

A record written after the code is a justification. A real `Alternatives`
section is evidence that the choice was made rather than rationalized. This is
the same independence property required by [`spec-tests`](spec-tests.md).

## Status and immutability

Use the closed set `Proposed`, `Accepted`, `Superseded`, or `Rejected`.
Rejected decisions stay recorded because deletion invites the same argument
again. An accepted decision is not rewritten; a new record supersedes it, and
the old record points to the replacement.

The sealing checker is not present yet. Until it is ported, treat accepted
records as review-protected and say `not verified` where an automated check does
not exist. Do not imply that a checksum is protecting a file when none exists.

## When a record is required

- an expensive-to-remove dependency is added;
- the Astro output mode, deployment adapter, or island strategy is chosen;
- a route, serialization, storage, or wire contract changes;
- the project's parity scope changes; or
- an already-settled boundary is about to be reversed.

## Citation

Cite decisions by their full slug, not only by number. Across sibling projects,
name the repository as well. A rule should lead to the decision that made it a
rule.
