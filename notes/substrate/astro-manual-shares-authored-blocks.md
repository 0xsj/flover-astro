# Astro manual pages share authored blocks

The public cookbook manual is authored as typed `ManualChapter` and
`ManualBlock` data. The overview, chapter reader, and Markdown download all
consume that same model, so the downloadable document cannot silently diverge
from the HTML reader.

Astro adapts the sibling manual in three places: file-based routes replace
framework route groups, native HTML tables and links replace component wrappers
where no existing Astro primitive was needed, and `Astro.response.status` marks
an unknown chapter as a 404 while retaining the normal reader shell. Source
references point at the Astro tree, and links only target routes currently
present in this port.

Astro 7.3.2 build and Markdown serialization checks passed on 2026-09-15.
Browser typography, chapter navigation, and download-click verification remain
part of the future browser evidence pass.
