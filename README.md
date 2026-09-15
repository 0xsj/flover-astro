# flover-astro

An Astro port of the Flover starter series. It carries the
architecture and behavior of [`flover-next`](../flover-next/) and
[`flover-svelte`](../flover-svelte/) into an Astro-specific implementation.

The feature port is complete. The current state is the Astro starter with
server output, the Node adapter, the global token/cascade layer,
the kernel, HTTP, diagnostics, chaos, composition root, server boundary, and
the session, ledger, example, access, and jobs service contracts. It also now
has validated storage, URL-state, runtime state machines, locale formatting,
query invalidation, realtime sources, a native browser preference binding,
isolated cookbook composition roots, and native Astro recipe pages for item
workflows, session recovery, resilience, access, jobs, activity, localization,
chaos, diagnostics, failures, URL state, canvas, and live updates. The public
cookbook manual and Markdown download are included as well. The dashboard and
editable dashboard are included with validated browser-document persistence.
The chart family is included too: pure scales and encodings, semantic chart
framing, legends, ordinary metric charts, statistical marks, deterministic
graph/network layouts, reusable presets, and matching kitchen-sink pages. The
auth UI, protected `/app` workspace, all cards/tables/workspaces/data
kitchen-sink pages, and native shell previews are included. Verification is
still recorded as build and route smoke evidence rather than a claim of full
cross-browser parity. Runtime chrome now consumes the browser preference layer
through native segmented controls and the Astro wordmark. The page-pattern
layer includes headers, collection toolbars, selection cards, and composed
screen recipes. Page-level shells include standard, rail, contextual,
navigation, and authentication frames.

## Start

The sibling projects use Node `24.19.0`. Astro currently has no `.nvmrc`; its
package declares Node `>=22.12.0`. Pinning the Astro port's runtime is an early
setup decision, so do not treat the sibling version as an Astro contract yet.

Until that decision is recorded, install and run it with:

```sh
nvm use
yarn install
yarn dev
```

The current starter exposes the landing page, the complete kitchen-sink
catalog, cookbook/manual routes, auth routes, a protected `/app` canvas, and
session/activity API endpoints. The background-server form used during longer
work is:

```sh
yarn astro dev --background
yarn astro dev stop
yarn astro dev status
yarn astro dev logs
```

Available checks at this stage:

```sh
yarn build
yarn preview
yarn astro -- --help
```

`yarn run check` is available through `@astrojs/check` and TypeScript 6. The current
port still reports legacy diagnostics in earlier inline scripts and components,
so it is a diagnostic command rather than a clean gate yet. Unit tests,
architecture checks, browser checks, and resilience mutations remain follow-up
tooling; the passing evidence is the production build plus local route/auth
smoke checks.

## Port target

The target is the same user-facing foundation demonstrated by the siblings:

- a public gradient landing page;
- a component kitchen sink with source-visible examples;
- cookbook recipes and a public seven-chapter manual;
- sign-in, sign-up, return-to addresses, and a fresh `/app` canvas;
- standard, rail, and authentication shells;
- explicit `Result`/`Failure` handling, injected transports, and memory fixtures;
- storage, realtime, diagnostics, locale, URL-state, and recovery examples; and
- production-build and browser verification at narrow and wide viewports.

The Svelte port records the behavioral parity scope and evidence in
[`flover-svelte/docs/port-parity.md`](../flover-svelte/docs/port-parity.md).
That document is a reference for acceptance criteria, not a claim that Astro
already satisfies them.

## Intended layout

Astro's names will be adapted to its own routing and rendering model:

```text
src/pages/                 file-based routes and endpoint handlers
src/layouts/               document, workspace, auth, and recipe layouts
src/components/<group>/    Astro primitives and compositions
src/lib/                   portable kernel, services, runtime, and bindings
src/styles/                cascade layers, reset, base, and design tokens
public/                    static assets
protocols/                 optional working procedures; never imported at runtime
notes/                     findings that code cannot communicate
decisions/                 choices that would otherwise be re-litigated
custody/                   provenance records, only when a claim needs one
tools/                     architecture, browser, and resilience checks
```

The exact route and component layout is part of the port. In particular, the
Next route groups and SvelteKit layouts cannot be copied mechanically into
Astro. Their ownership and behavior must be retained while their framework
syntax changes.

## Boundaries that must survive the port

- A service receives its transport as an argument; it never constructs or
  imports a transport, framework router, or UI library.
- The composition root is the only place that selects memory versus network
  adapters and composes domain fixtures.
- Successful `unknown` responses are decoded before domain values are exposed.
- `Result` instances do not cross an Astro serialization or server/client
  boundary; unwrap them into plain data at the boundary.
- Expected failures retain their meaning. Unknown is not empty, an uncertain
  write is not a rejected write, and stale permission is not authorization.
- Third-party primitives are hidden behind owned wrappers. Components receive
  caller data and callbacks rather than manufacturing behavior.
- Memory mode is a supported application mode, not an instant happy-path stub.
- Protocols are optional documents. Nothing in the application imports them.

Astro-specific decisions still owed before the relevant implementation begins
(the output mode and initial island strategy are settled in
[`ADR 0001`](decisions/0001-server-output-and-native-islands.md)):

1. the mapping of grouped routes and nested layouts; and
2. the client-side ownership model for runtime state, query caches, and browser
   history.

Each decision belongs in `decisions/` before the implementation makes it hard
to reverse. A substrate finding belongs in `notes/substrate/` only after it
has been observed against a pinned Astro/dependency version.

## Port sequence

The work is intentionally staged:

1. establish this README, onboarding, protocols, and the first port notes;
2. port the design tokens and global cascade entry point;
3. port framework-neutral kernel, HTTP, root, service, and runtime layers;
4. establish Astro layouts, server boundaries, sessions, and endpoint routes;
5. port primitives and shells, adding interaction through explicit islands;
6. port the kitchen sink, cookbook, manual, and route-local examples; and
7. add architecture, resilience, render, and browser evidence incrementally.

The port is complete only when the final parity record names what was carried,
what was adapted, what was not carried, and which checks actually ran.

## References

- [`flover-next`](../flover-next/) — architecture and current reference shape.
- [`flover-svelte`](../flover-svelte/) — completed framework port and behavior
  parity evidence.
- [`protocols/README.md`](protocols/README.md) — optional working procedures.
- [`AGENTS.md`](AGENTS.md) — local onboarding and development rules.
