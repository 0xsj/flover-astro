# Disclosure and utility cross the slot boundary

The Astro port keeps the sibling contracts visible while adapting the implementation to Astro's HTML-first component model.

Disclosure owns its client behavior at the root: accordion triggers and panels are related after hydration, then state is mirrored through `aria-expanded`, `hidden`, and `data-state`. The trigger remains a real button inside a heading so the server-rendered document is meaningful before JavaScript runs.

Utility primitives keep their responsibilities narrow. `Icon` has a finite named inventory, `AccessibleIcon` supplies an explicit accessible wrapper when no surrounding control can provide the name, and `VisuallyHidden` preserves reader-visible text without relying on `display: none`. `Portal` emits a server-side placeholder and progressively moves its children to a target in the browser; overlay focus and dismissal behavior still belongs to the overlay primitive.

Astro-specific boundary: slotted component children cannot be cloned or inspected like framework virtual nodes, so accessible naming and portal movement are expressed with explicit props and DOM markers.
