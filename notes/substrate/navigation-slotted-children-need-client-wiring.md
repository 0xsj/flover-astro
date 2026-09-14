# Navigation slotted children need client wiring

Breadcrumbs and route links are complete server-rendered HTML. Tabs are different: Astro's slots cannot receive the parent's active value, so the server emits the tab and panel roles while a small browser script assigns relationships, selects the initial value, hides inactive panels, and owns arrow-key movement.

Pagination uses links instead of callback buttons. That keeps a server-rendered Astro route addressable and lets the routing tier decide whether a page is represented by a query parameter or a path segment.
