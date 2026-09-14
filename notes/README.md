# Astro port notes

This directory will hold findings that the implementation cannot communicate
by itself. It is intentionally empty of invented history at the documentation
stage.

Write a note when the port exposes a non-obvious failure mode, a framework or
dependency behavior, or a reusable architectural pattern. Do not backfill a
note from a plan and do not restate a file's implementation.

Use the kinds defined by [`protocols/notes.md`](../protocols/notes.md):

```text
modules/       a finding tied to one Astro port file
substrate/     Astro or dependency behavior at a pinned version
patterns/      architecture that can travel between projects
techniques/    broadly reusable working methods
language/      TypeScript, CSS, or Astro language behavior
concepts/      domain reasoning
```

The first real note should be written when a real port slice teaches us
something—not merely because the directory exists.
