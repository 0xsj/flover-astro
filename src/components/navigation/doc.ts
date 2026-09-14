/**
 * Navigation — moving between places, and saying which place you are in.
 *
 * NavLink takes `active` rather than reading the route. The router is the one
 * framework-specific part of this contract, so the caller answers it and the
 * component styles from the resulting `aria-current="page"` attribute.
 *
 * Breadcrumbs use a named nav and an ordered list. The last crumb is text with
 * `aria-current="page"`, never a link to the page already being read; separators
 * are real `aria-hidden` elements rather than generated content.
 *
 * Tabs are one tab stop with arrow-key movement. Automatic activation is the
 * default; pass `manual` when showing a panel is expensive. Astro adds the
 * tab/panel relationships and state in a small browser script because slotted
 * children cannot receive the parent's active value during server rendering.
 *
 * Pagination uses links because a server-rendered route should change the URL.
 * `hrefForPage` lets the routing tier decide the query or path shape, while the
 * pure page window keeps output bounded and exposes the current page.
 */
export {};
