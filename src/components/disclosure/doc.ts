/**
 * Disclosure — content a reader chooses to reveal.
 *
 * Accordion supports one open item or multiple. Triggers are named buttons
 * inside caller-chosen headings; Enter and Space toggle, and arrow keys move
 * between enabled triggers. Disabled items cannot open. The browser script
 * connects each trigger to its region and reflects state through
 * `aria-expanded`, `hidden`, and `data-state`.
 *
 * Astro's slots cannot receive a parent's active value during server rendering,
 * so the first port keeps the child composition declarative and applies the
 * initial selection after the document is available. A later native-details
 * fallback can improve no-script disclosure without changing the contract.
 */
export {};
