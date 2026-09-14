# flover-astro onboarding

Read this file and [`protocols/README.md`](protocols/README.md) first. This is
an in-progress port, not a completed application. Read the sibling source only
when the current port slice needs a reference:

- [`flover-next`](../flover-next/) is the architecture reference.
- [`flover-svelte`](../flover-svelte/) is the behavior and framework-adaptation
  reference.

## Development

Run the current Astro starter from this directory:

```sh
yarn install
yarn dev
```

The siblings pin Node `24.19.0`; this Astro starter currently has no `.nvmrc`
and only declares Node `>=22.12.0` in `package.json`. Record the Astro runtime
choice before treating it as a project contract.

For a background server, use:

```sh
yarn astro dev --background
yarn astro dev status
yarn astro dev logs
yarn astro dev stop
```

Do not claim a check exists until it is wired into `package.json` and has been
run. At the current scaffold stage, the available project commands are:

```sh
yarn build
yarn preview
yarn astro -- --help
```

## Working rules

- Work in small port slices. Keep the current port runnable after each slice.
- Do not import from a sibling project. Portable modules are copied locally and
  adapted only at named Astro boundaries.
- Write a note when the implementation exposes a non-obvious failure mode or
  framework fact. Do not use notes to restate code.
- Write a decision before choosing an expensive-to-reverse dependency, output
  mode, island strategy, route convention, or public contract.
- Keep `Result`/`Failure` meanings intact across server and browser boundaries;
  pass plain data through serialized props and endpoint responses.
- Third-party imports belong in the wrapper that owns them. Pages and recipes
  should consume Flover wrappers, not vendor primitives directly.
- Verify behavior at the boundary where it occurs. A build is not a form test,
  a screenshot is not a hydration test, and a green harness needs a negative
  control.

## Astro documentation

Use the official Astro documentation for the relevant slice:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components and islands](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Middleware](https://docs.astro.build/en/guides/middleware/)

The current Astro version and package choices are recorded in
`package.json`. The first output/island decision is in
`decisions/0001-server-output-and-native-islands.md`. When a dependency or
Astro behavior matters to a future caller, record the version and whether it
was read from documentation or measured locally in a substrate note.
