# The kernel is the Astro-free floor

The first service-layer port carries the framework-neutral kernel from the
Next and Svelte siblings into `src/lib/kernel/`.

## Carried

- plain-data `Failure` variants split into transport and domain kinds;
- `Result` composition with `Ok` and `Err` classes;
- cause chains and domain-failure narrowing;
- explicit optional absence and three-state `Presence`;
- bounded retry policy based on failure kind;
- `AppError`, `unwrap`, and `asFailure` as the controlled throw boundary; and
- the dependency-free `cn` class joiner.

## Adapted

The kernel documentation names Astro endpoint and island boundaries rather than
React Server Components or SvelteKit bindings. The implementation remains
framework-free and uses the newer Svelte refinements: `isDomain`, exported
retry constants, non-negative retry attempts, and identity-preserving no-op
`Result` transformations.

## Boundary rule

`Failure` may be serialized as plain data. `Result` must be unwrapped before it
is returned from an Astro endpoint or passed into a hydrated island.

## Verification

`yarn build` passes after the port. A dedicated kernel test command remains
unimplemented in this project and will be added with the verification tooling.
