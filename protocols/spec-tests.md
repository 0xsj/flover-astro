# Specification tests

> **Tests written from a specification behind an information barrier, then
> scored by mutation rather than trusted because they passed.**
> Use when a contract is worth testing independently. Ends in a result whose
> provenance and limitations are stated.

**Adopt this when** implementation-visible regression tests are not enough and
the contract can be written before the implementation is inspected. **It costs
you** an oracle, a separate writer, a mutation run, and triage of ambiguity.
**Decline it** when no independent specification exists; this method cannot
manufacture one.

## Procedure

1. Write or select the specification before reading the implementation.
2. Extract only contract material; remove current implementation fragments and
   record any leak.
3. Give the writer the oracle inline behind a capability barrier.
4. Preserve the as-written suite before anyone runs or edits it.
5. Audit and run it separately from the writer; a failure is a finding first.
6. Mutate one source file at a time, restoring it in `finally`.
7. Classify compile errors as invalid mutants, not killed mutants.
8. Check a negative control before trusting a uniform result.
9. Record survivors, equivalent mutants, and the limits of the oracle.

## Test priority

Prefer property tests—round trips, totality, idempotence, conservation,
monotonicity, and fail-closed behavior. Then test security-relevant contract
promises, then examples pinned by a decision. Do not hard-code a value the
specification never states. Report silence and ambiguity instead of quietly
guessing.

## Astro scope

This procedure is initially for portable TypeScript models and services. A
hydrated Astro component requires a different browser binding and must not be
presented as independently specified merely because its HTML rendered.

No spec-test runner or custody evidence exists in the Astro port yet.
