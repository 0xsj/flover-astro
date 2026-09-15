/**
 * Chrome — browser-owned appearance choices and the shared wordmark.
 *
 * `Segmented` is one named radio group, not a row of independent pressed
 * buttons. `ThemeToggle` and `DensityToggle` bind it to the already-portable
 * runtime stores; the blocking boot string still owns first paint, while these
 * controls own changes after the document is interactive.
 *
 * `Mark` owns the product spelling once, but the caller chooses whether it is
 * an inline lockup or a document heading. The Astro version keeps all four
 * components server-renderable and adds only small native browser bindings.
 */
export {};
