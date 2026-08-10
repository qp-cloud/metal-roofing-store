# Photos

Drop files here named exactly after the slot id, with any of these extensions:
`.jpg` `.jpeg` `.png` `.webp`. They are picked up automatically on the next
build — nothing else to edit.

Slot ids, what each shot should contain, and where it appears are all defined
in `src/data/media.ts`. Run `pnpm run photos` to list which slots are still
empty.

Shoot notes:
- Landscape, roughly 4:3 or wider. Minimum 1800px on the long edge so the 2x
  variant stays sharp; Astro downsizes, it cannot invent detail.
- Real premises, real crew, real trucks. DESIGN.md calls for documentary
  photography over stock.
- Faces of identifiable people need their agreement before publishing.
