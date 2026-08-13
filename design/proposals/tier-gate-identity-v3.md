# Tier Gate Identity and Arrival Direction v3

## Goal

Make each threshold recognizable before its plaque is legible, and make the
moment of crossing feel like entering a new membership chapter rather than
collecting a generic reward.

## Five Gate Identities

| Tier | Distance cue | Material cue | Arrival character |
| --- | --- | --- | --- |
| Silver 10 | Round medallion above one low arch | Silver, pale marble, warm lamp | A first invitation: restrained and clear. |
| Gold 25 | Radiating crown and two vertical pennants | Brushed brass, ochre silk | The road becomes ceremonial. |
| Platinum 50 | Tall double halo, four lights, blue diamond | White stone, platinum, cool glass | A composed landmark rather than a larger Gold gate. |
| Titanium 75 | Tall separated crystal obelisks | Graphite, teal titanium, icy facets | The road passes through a precise, engineered monument. |
| Ambassador 100 | Two-tier roof, red standards, gold crest | Black lacquer, vermilion, brass | A distinct final ceremony, never a recolor of Titanium. |

The outer standards and lanterns are deliberately outside the central opening.
The road, active stamp, and current car stay readable through every gate.

## Arrival Sequence

The existing 2.6-second celebration can keep its timing. Direct it as three
quiet material beats rather than a confetti burst.

1. **Approach light, 0-450 ms.** The tier crest wakes first; a narrow warm or
   cool glow traces the gate crown and three long roadward light streaks rise.
   Keep the road visible and do not cover the whole viewport.
2. **Threshold opening, 450-1500 ms.** A translucent light curtain in the
   gate opening parts from the center while the static frame grows by at most
   6 percent, then settles. Reuse the rendered gate image and CSS gradients;
   no split-door image is necessary.
3. **Commemorative mark, 1500-2600 ms.** A compact tier plaque resolves below
   the crest with the tier name and completed-night count from the app. It
   then scales down toward the shoulder as a persistent yearly road marker.

Use a tier-specific light temperature: warm silver for Silver, brass for Gold,
cool white/blue for Platinum, blue-cyan for Titanium, and warm gold with a
vermilion accent for Ambassador. The plaque text remains DOM text so the app
can localize it and the assets remain text-free.

## Ambassador 100

Ambassador is a four-second exception, not simply a louder particle effect.

- Hold the double roof and gold crest for 700 ms before the light curtain
  parts; this creates a recognizably formal pause.
- Open a deep vermilion inner glow, then send four measured lantern-light
  trails upward from the outer pillars.
- Resolve a black-lacquer plaque with a thin brass border and a single
  vermilion stamp accent. Avoid fireworks, glitter rain, or rapidly spinning
  elements.
- Leave the smallest enduring marker on the shoulder: a dark plaque with a
  gold edge. It should read as a chapter record, not a collectible badge.

## Integration Notes For Coco

- The five filenames and the `512 / 341` aspect ratio are unchanged. Current
  `wgate` placement can consume the new images with no data or code change.
- Build the arrival layers above the road world and below navigation. Use a
  single `pointer-events: none` wrapper; do not block the user after the
  animation ends.
- For the static gate frame, prefer `transform: scale()` and `filter` only on
  the gate image. Implement the opening as two clipped gradient panels in the
  central opening, not by slicing this gate art.
- Reuse the current tier color tokens for the plaque; the new silhouette must
  remain the primary identifier.

## Verification

- At 390 px, the next gate remains identifiable by its upper silhouette before
  its plaque can be read.
- The transparent center reveals the driving lane and vehicle throughout.
- The five optimized WebP files add about 75 KB total and keep the world asset
  budget far below the current 8 MB allowance.
