# Astro components are HTML by default

An Astro component can render a complete page fragment without shipping a
client runtime; interactivity is an explicit island decision at the call site.

## Origin

Read from the official Astro islands and component documentation on 2026-09-14,
against the project's Astro `7.3.2` dependency. This is read, not independently
measured yet.

## What

Astro renders components to HTML and CSS by default. A UI framework component
or browser script becomes interactive only when the page explicitly adds the
corresponding client boundary. Client directives also determine when a
framework island loads.

## Why

Treating every component as a client component would make the port resemble a
single hydrated application and would erase Astro's selective-hydration
boundary. Native Astro markup keeps static structure server-owned; behavior can
then be added where a real interaction requires it.

## Gotchas

Server HTML does not prove that an island hydrates, preserves document state, or
announces a transition. Interactive claims need a hydrated browser check.

## Used in

- `decisions/0001-server-output-and-native-islands.md`
- `src/pages/index.astro` currently uses only the server-rendered path; no client
  island has been ported yet.

## Primary source

- https://docs.astro.build/en/concepts/islands/
- https://docs.astro.build/en/basics/astro-components/
