# Astro cookbook pages use native browser scripts

The first cookbook pages are server-rendered `.astro` routes with small,
route-local browser scripts. They use the framework-free composition roots from
`src/lib/root/` after hydration instead of wrapping each example in a React or
Svelte-style island.

This preserves the useful Astro boundary:

- the page shell and initial instructions render as HTML;
- the browser owns storage, abort controllers, and event handlers; and
- the service and runtime contracts remain independent of Astro.

The items page wires durable drafts and item receipts, the session page wires
identity verification and post-expiry reconciliation, and the resilience page
wires response decoding, out-of-order reads, and lost note acknowledgements.
The session page currently uses the explicit `astro-demo-account` fixture until
the authentication UI and protected application shell are ported.

Astro 7.3.2 build verification passed on 2026-09-15. A real-browser interaction
run is still owed for these pages; build output verifies route compilation and
client bundling, not click-level behavior.
