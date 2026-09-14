# Astro-native preference binding keeps the server default stable

The Astro port can keep preference state framework-free by using one blocking boot string and one explicit native browser script.

True of Astro 7.3.2 · verified 2026-09-14

## Origin

Read against Astro's compiled server output and the accepted Astro-native island
decision, then verified with `yarn build`. A browser interaction run is still
owed with the render-verification slice.

## What

`RUNTIME_BOOT_SCRIPT` applies only non-default theme and density attributes before
paint. The native preference binding hydrates the persisted stores after the
document exists, updates the root attributes, persists later choices, and keeps
all preference buttons' `aria-pressed` state synchronized.

## Why

The alternative was to keep layout-local click logic and duplicate persistence
rules beside it. That makes the kitchen sink work while leaving future shells
with a second, drifting theme implementation. Importing a React or Svelte hook
would also cross the port boundary established by ADR 0001.

## Gotchas

- The blocking string is intentionally duplicated logic because it runs before
  the client bundle; the source constants generate its allowed values.
- The server render must use defaults. Reading `localStorage` during Astro
  rendering would make the HTML request-dependent on browser-only state.
- Preference binding is explicit browser code; it must not be called from a
  server endpoint or server-only module.

## Used in

`src/layouts/BaseLayout.astro` injects the boot string, while
`src/layouts/KitchenSinkLayout.astro` loads the native binding for its controls.

## Related

- `decisions/0001-server-output-and-native-islands.md`
- `src/lib/runtime/browser.ts`
- `src/lib/runtime/boot.ts`
