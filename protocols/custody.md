# Custody

> **A request-side record of what an actor was permitted to do and what came
> back, for evidence that somebody outside the run must trust.**
> Use rarely. Ends in hashes, an action record, and a re-runnable result.

**Adopt this when** a provenance claim will be made to a third party or an
independent test suite's origin will otherwise be disputed. **It costs you** a
record per run and careful preservation of inputs. **Decline it** for ordinary
implementation-visible tests.

## What to record

```text
oracle        hash and origin of every specification input
leak surface  implementation fragments found in the oracle
grant         capabilities the actor was given
actions       runtime record of what actually happened
output        the suite or artifact before human edits
prediction    expected failures, recorded before execution
subject       hashes of sources and output under test
result        compile status, pass/fail, and mutation ratio
```

Capability is stronger than intention: record what the actor could access, not
only what it says it accessed. A hash chain makes later edits visible, but the
store is still tamper-evident rather than tamper-proof.

## Limits

Custody cannot prove what an actor already knew, cannot prove that a suite is
good merely because it passed, and cannot turn a measurement into a claim about
states the measurement did not cover. A null result is a result and belongs in
the record.

No custody tooling exists in the Astro port yet. Until it does, do not describe
ordinary test output as custody evidence.
