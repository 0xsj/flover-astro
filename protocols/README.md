# protocols

Procedures, as documents. No runtime is assumed and none is required: a person
can follow these by reading them.

This directory travels with Flover as a choice, not a framework. Adopt none,
some, or all, and delete what does not fit. Nothing in the application imports
anything here.

## The set

| Protocol | Job | Adopt when |
| --- | --- | --- |
| [`spec-tests`](spec-tests.md) | derive tests from a specification behind an information barrier | a contract is worth testing independently |
| [`spec-tests.role`](spec-tests.role.md) | define what the test writer can and cannot access | the barrier is being bound to a runtime |
| [`render-verification`](render-verification.md) | measure the running render rather than trusting a screenshot | a screen has forms, themes, small text, or hydrated state |
| [`accessibility`](accessibility.md) | set the component accessibility floor | the project ships interactive UI |
| [`enforcement`](enforcement.md) | turn conventions into detection specifications | more than one session edits the tree |
| [`fixtures`](fixtures.md) | make memory mode reproduce server behavior honestly | a transport has more than one adapter |
| [`notes`](notes.md) | preserve findings that code cannot communicate | the reasoning should outlive the current edit |
| [`decisions`](decisions.md) | record choices before they are re-litigated | a choice is expensive to reverse |
| [`custody`](custody.md) | record provenance for an evidence claim | somebody outside the run must trust it |

Start with `notes` and `enforcement`. Notes cannot be backfilled honestly, and
enforcement only works when boundaries exist from the first module. The other
protocols can be adopted when their trigger occurs.

## Three rules

1. **Nothing imports a protocol.** Removing this directory must not break the
   application, its build, or its tests.
2. **Each document states its cost.** An adoptable protocol opens with when to
   adopt it, what it costs, and when to decline it.
3. **Off carries a reason.** Declining a protocol because it does not apply is
   different from declining it because it is inconvenient. Silence is not an
   answer.

## The free decision

Write a contract before writing the implementation. A specification written
before the code cannot have been derived from the code. The same applies to the
`Alternatives` section of a decision record. Everything else can be adopted
late; this cannot be recovered.

## Document format

```markdown
# Title

> **The job, in one sentence.**
> Use when … Ends in <what it produces>.

**Adopt this when** … **It costs you** … **Decline it** for …
```

Each protocol names what it cannot detect as well as what it can. A document
that lists only its catches is read as a guarantee.

## Astro boundary

These procedures do not choose Astro's output mode, deployment adapter, route
layout, or island framework. Those are project decisions and belong in
`decisions/` before the implementation makes them expensive to change.
