# Notes

> **Write only what the code cannot say.**
> Use as the work happens, never as a documentation pass at the end. Ends in a
> corpus where transferable findings can be separated from port-local ones.

**Adopt this when** the reasoning should survive the current repository. **It
costs you** a few minutes at the moment a failure is understood. **Decline it**
only if you accept re-deriving every non-obvious choice from code later.

## What a note records

| Record | Do not record |
| --- | --- |
| the alternative that lost | what the function does |
| the invisible failure mode a shape prevents | the parameter list |
| the trap at a framework or dependency boundary | a summary of the file |
| the consequence that made a rule worth having | a defense of unfinished work |

A note answers **why this looks like this** for someone who can already see what
the code does. Restating code rots as soon as the code changes.

## Kinds

The directory is the type system for the corpus:

```text
notes/
  modules/       this port file; expected to age with the file
  substrate/     Astro or dependency behavior at a pinned version
  patterns/      this architecture; portable until the architecture changes
  techniques/    broadly reusable working methods
  language/      TypeScript, CSS, or Astro language behavior
  concepts/      domain reasoning
```

A module note may cite a transferable note; a transferable note must not name a
path that exists only in this project. Do not create a module note merely to
reach a quota. Write the note when a file surprises somebody.

## Substrate notes

Every substrate note states the dependency/runtime version, date, origin, and
whether the claim was read or measured:

```text
True of Astro <version> · verified 2026-09-14
Origin — measured against the production preview, not inferred from source.
```

It also cites the primary documentation or source that should be revisited when
the dependency changes. A substrate note without an origin is a rumour with
formatting.

## Shape

```text
<one claim sentence before the first heading>
Origin      what taught this and whether it was read or measured
What        the finding, for a reader who has not seen it
Why         the alternative that lost and the cost it avoids
Example     the smallest real use, when useful
Gotchas     what will surprise the next person
Used in     current callers or an explicit "not used yet"
Related     links to nearby notes
```

The first sentence must be a claim that could be disagreed with, not a label.
`Used in` is mandatory because it is the section that catches moved or obsolete
knowledge. Mark uncertainty as `WORKING`; silence must not turn a hypothesis
into a settled rule.

## Checklist

```text
[ ] the note says something the code cannot
[ ] its kind matches its directory
[ ] the claim line differs from the title
[ ] Origin says what taught this and whether it was measured or read
[ ] substrate notes carry a version and primary source
[ ] Used in is present and current
[ ] transferable notes do not name project-only paths
[ ] unsettled findings are marked WORKING
```
