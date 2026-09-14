# Spec-test writer — the role

> **An actor that writes tests from a specification while being structurally
> unable to read the implementation.**
> Use only as the writer step of [`spec-tests`](spec-tests.md). Ends in a binding
> whose capabilities can be audited.

## Required constraints

The writer must not be able to:

- read a file;
- run a command or search the tree;
- compile or execute the suite;
- request more material mid-run; or
- write outside the assigned output path.

The reason is structural, not ceremonial: a writer with a compiler can iterate
until green and silently adopt the implementation as its oracle. Everything the
writer is permitted to know must be inline in the prompt or oracle.

## What the writer reports

The writer reports counts by property/contract/example test, every ambiguity and
how it was handled, predicted failures, and promises it could not test. It does
not paste the suite into the report or claim independence without the binding
and custody record that establish it.

## Binding status

No Astro-specific writer binding exists yet. Until one does, ordinary tests are
implementation-visible and must be described that way.
