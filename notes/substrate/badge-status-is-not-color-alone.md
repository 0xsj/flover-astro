# Badge status is not color alone

The display port starts with the sibling badge contract: status text is always present, the tone is semantic, and an optional glyph reinforces the meaning without becoming a second announcement.

The glyph is `aria-hidden="true"`; a screen reader receives the visible status word once. This keeps the same badge useful in greyscale, on a projector, and for people who cannot distinguish the hues.

Astro keeps the component server-rendered as a `span`. It has no dismissal, size, or interaction state; those are separate contracts for chips or controls.
