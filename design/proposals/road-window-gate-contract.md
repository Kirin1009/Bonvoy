# Road Window Gate Contract v2

## Purpose

Every tier gate spans the road at a tile boundary. It is a threshold to pass
through, not a badge placed on a tile. The central opening stays transparent so
the active stamp, cars, and the road remain visible.

## Assets

| Tier | Asset | Direction |
| --- | --- | --- |
| Silver 10 | `assets/world/gate-silver-10.webp` | Simple silver arch |
| Gold 25 | `assets/world/gate-gold-25.webp` | Brass canopy |
| Platinum 50 | `assets/world/gate-platinum-50.webp` | Double arch with lamps |
| Titanium 75 | `assets/world/gate-titanium-75.webp` | Faceted stone pillars |
| Ambassador 100 | `assets/world/gate-ambassador-100.webp` | Black lacquer and deep vermilion grand gate |

All five are `512 x 341` transparent WebP files. Their combined size is about
74 KB. Do not bake them into the fixed road-window base.

## Placement

Use `design/proposals/road-window-grand-highway-slots.json` schema v2.

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

## Integration Notes For Coco

Replace the previous `gate.center` and `gate.size` reading with the v2 width
and baseline contract. The current `design/mock-road-window-base.html` still
contains the v1 inline JSON and a temporary gate calculation, so update its
inline data when integrating. The gate image should never occupy the current
stamp tile as an opaque overlay.
