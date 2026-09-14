# 0001 — server-rendered pages with explicit Astro-native islands

**Status:** Accepted · **Date:** 2026-09-14

## Context

The parity target includes request-local authentication, HttpOnly session
cookies, same-origin API endpoints, and pages whose output depends on the
request. The starter currently builds as a static site and has no server
adapter.

Astro also renders components to HTML without client JavaScript by default. The
port needs interactivity for controls, shells, charts, and recovery recipes,
but loading one client application for every page would discard the main Astro
performance boundary.

## Decision

Configure Astro with `output: 'server'` and the official `@astrojs/node` adapter
in standalone mode. Server rendering is the default so request and cookie
boundaries are available when a route needs them; individual static routes may
still opt into prerendering later when that is measured to be safe.

Build UI as Astro components by default. Add browser behavior through explicit,
owned Astro islands using standard TypeScript scripts and platform APIs. A
framework integration may be added for a specific interaction only when native
Astro code cannot express the required state or accessibility contract; that
choice requires its own decision and wrapper boundary.

## Alternatives

- **Static output only** — rejected because it cannot support the target's
  request-local cookies and server endpoints without moving those contracts
  outside the application.
- **Server output without an adapter** — rejected because Astro needs a runtime
  adapter to produce an on-demand server build.
- **Hydrate the whole application with React or Svelte** — rejected because it
  imports a sibling framework's client model into the Astro port and makes
  every page pay for interactivity it may not use.
- **Use a framework island for every interactive primitive** — rejected for
  now. Astro-native islands keep the default dependency surface small and make
  the browser/server seam explicit. A concrete complex control can reopen this
  decision with evidence.

## Consequences

- `@astrojs/node` is now a production dependency and standalone Node output is
  the local deployment baseline.
- Request data, cookies, and server endpoint results remain server-owned. They
  must be converted to plain serializable data before crossing into an island.
- Each island owns its browser lifecycle and must be tested as hydrated output;
  server HTML alone is not evidence of interaction.
- The port must implement more interaction behavior than a wrapper around an
  existing sibling would require. This is intentional: the component and
  binding seams remain Astro-specific.
- Deployment to another host may require a later adapter decision. That change
  must preserve the server-output contract or record the scope reduction.

## Verification

- `@astrojs/node@^11.1.5` is installed and recorded in `package.json` and
  `yarn.lock`.
- `astro.config.mjs` declares `output: 'server'` and the Node adapter.
- `yarn build` must pass after this change and report a server build rather than
  the previous static-only build.
- Cookie behavior, endpoint responses, and hydrated islands are not verified
  yet; those checks are owed with their implementation slices.
