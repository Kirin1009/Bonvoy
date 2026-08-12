# Grand Highway Road World Kit v1

## Design Decision

Adopt a layered moving world, not a flat base with decorations. The environment
stays still while the road tiles, hotel pads, buildings, stamps, cars, and gate
share a continuous depth axis. This preserves the rich porcelain material and
lets every object pass the viewer together.

`road-world-kit-v1.json` is the implementation contract. It replaces the
fixed-window coordinate model for the animated world view.

## Why This Is The Right Trade

Do not replace the board with plain SVG rectangles. The porcelain tile is part
of the reward language. Instead, use the existing framed cream-marble tile as a
repeatable material and transform it to each moving trapezoid. A stay carries
its stamp, roadside pad, hotel miniature, car, and gate relationship through
the same `z` coordinate, so no component drifts during motion.

The new environment image contains only the road, railings, islands, sea, and
sunset. It intentionally has no baked tiles or pads.

## Readable History

Show four fully readable stays in the central world band. The current stay is
the nearest of those four and holds the cars; the next three tiles are empty.
This is the balanced third answer to the previous two-versus-four comparison:

- Four stamped stays retain the satisfaction of a personal travel record.
- The cars remain on the latest stay.
- The gate stands at the boundary ahead of that car, before empty road.
- Five older stays continue below as pale, unlabeled afterimages.

The foreground tiles are deliberately shallower than the old fixed-window
version. This opens the roadside for moving hotel miniatures and prevents the
lowest three tiles from consuming the screen.

## Rendering Notes For Coco

1. Keep `road-world-environment-v1.webp` fixed at the world viewport size.
2. Render each stay as a DOM/SVG layer derived from its `z`, clipping or
   perspective-transforming `road-world-tile-cream.webp` into the supplied
   trapezoid. The tile is a material, not a background image.
3. Derive a hotel pad from the same `z` and alternate its side by chronology.
   Place the existing transparent hotel miniature inside the pad with the
   specified inset.
4. Use `deltaPerStay` for every movable world object. During a new-stay
   transition, interpolate z for tiles, stamps, pads, hotels, cars, and the
   gate in one animation. The environment must not move.
5. At z values above 0.76, remove hotel miniatures and stamp labels; retain
   only quiet, compressed stamped afterimages.
6. The gate is transparent and road-spanning. Its frame renders above the
   road, while its open center leaves the approaching tile and car visible.

No WebGL or external library is required. A single `requestAnimationFrame`
loop or CSS custom-property update can recalculate the formulas at 390px.

## Assets And Capacity

- Environment: `assets/world/road-world-environment-v1.webp`, 852 x 1515,
  about 85 KB.
- Tile material: `assets/world/road-world-tile-cream.webp`, 512 x 512,
  about 7 KB.
- Existing gates, cars, and generic hotel miniatures remain reusable.

The added world-kit assets are well below 100 KB. The full current world asset
set remains comfortably inside the 8 MB budget.
