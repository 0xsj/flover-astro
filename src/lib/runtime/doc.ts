/**
 * runtime — state the shell and browser islands own, not the server.
 *
 * Stores, persistence, URL codecs, latest-read handling, capability refresh,
 * job observation, draft reconciliation, and session recovery are framework-
 * free. Astro's only binding in this slice is a small native browser module
 * for preference controls; no React or Svelte hook is imported.
 *
 * Preferences are read after hydration except for the blocking boot string,
 * which applies only non-default theme and density attributes before paint.
 * Documents expose missing and failed reads rather than turning saved layouts
 * into silent preferences. URL writes merge against the address at event time.
 *
 * A read or command that can be superseded carries a generation. An aborted or
 * late response cannot overwrite newer state. Lost writes and cancellation
 * responses remain unknown until an authoritative receipt or snapshot settles
 * them. Permission refresh withdraws grants until a new scoped revision arrives.
 */
export {};
