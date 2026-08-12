# Grand Highway: Formal Fixed-Window Base

## Deliverables

- `assets/world/road-window-grand-highway-unbuilt.webp`
- `design/proposals/road-window-grand-highway-slots.json`

The base is 852 x 1515 and 109 KB. It contains five empty marble road tiles and six empty landscape building pads. No hotel, gate, car, stamp, text, or UI is baked into the image.

## Composition Contract

The JSON is the sole coordinate contract for this base. `tiles` and `buildingZones` use four corners in natural base pixels, so the client can use an affine or perspective transform instead of visually remeasuring each trapezoid. The image must be scaled uniformly; all JSON coordinates scale by the same factor.

The gate is a dynamic transparent layer:

1. Begin at `gate.horizon`, in front of the unbroken horizon and above the road.
2. As the user progresses to the next tier, interpolate to `gate.near` on the road axis.
3. On achievement, play its opening transition, clear it, then spawn the following gate at `gate.horizon`.

Cars use the supplied `pawns` centers and sizes. Building assets should fit inside, not cover, the associated `buildingZones`; retain at least 8% inset on every edge to preserve the stone pad as a visible foundation.

## Verification

- WebP dimensions: 852 x 1515.
- Payload: 109 KB, within the 200 KB single-asset guide.
- All tiles and building zones are supplied as quadrilateral coordinates.
- Base visibly has no baked gate or completed hotel building.
