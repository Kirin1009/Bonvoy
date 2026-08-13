# Road Window Gate Contract v3

## Purpose

Every tier gate spans the road at a tile boundary. It is a threshold to pass
through, not a badge placed on a tile. The central opening stays transparent so
the active stamp, cars, and the road remain visible.

## Assets

| Tier | Asset | Direction |
| --- | --- | --- |
| Silver 10 | `assets/world/gate-silver-10.webp` | Round medallion over one calm silver arch. |
| Gold 25 | `assets/world/gate-gold-25.webp` | Sunburst crown, brass arch, and two outer pennants. |
| Platinum 50 | `assets/world/gate-platinum-50.webp` | Tall nested arches, four lantern crowns, and an ice-blue diamond. |
| Titanium 75 | `assets/world/gate-titanium-75.webp` | Separated faceted obelisks with a thin angular beam and crystal keystone. |
| Ambassador 100 | `assets/world/gate-ambassador-100.webp` | Singular two-tier black-lacquer roof, vermilion standards, and ceremonial crest. |

All five are `512 x 341` transparent WebP files with real alpha. Their
combined size is about 75 KB. Do not bake them into the fixed road-window
base.

## Placement

Use `design/proposals/road-window-grand-highway-slots.json` schema v2. The
existing filenames and aspect ratio are retained, so this art replacement
needs no placement-code change.

- `baselineY` is the tile-boundary y coordinate where the gate feet meet the
  road shoulders.
- `width` is the only authored size. Render `height: auto`, using the source
  aspect ratio of `512 / 341`.
- Place at `x = centerX - width / 2`, `y = baselineY - renderedHeight`.
- Keep the gate centered at `centerX`; its legs should sit outside the driving
  lane, on the shoulders.
- Interpolate `baselineY`, `width`, and opacity between `horizon` and `near`.
  Do not interpolate a fixed height or scale a rectangular gate slot.
- Draw the gate above the road background but do not use an opaque backdrop.
  Stamps and cars must remain visible through the opening.

The supplied horizon boundary is between `far` and `mid`; the near boundary is
between `next` and `current`. This keeps the gate in the progression path and
leaves both the current stamp and the two pawns inside valid tiles.

## Recognition Notes

- Do not add a generic color filter over these files. The silhouette is the
  tier signal: circle, sunburst, double halo, crystal tower, then double roof.
- Preserve enough horizon clearance to read the upper crest at the small
  horizon size. The Ambassador roof may be wider than the lane but its legs
  must still sit on the shoulders.
- See `design/proposals/tier-gate-identity-v3.md` for the arrival sequence;
  it reuses these files and adds no mandatory image asset.
