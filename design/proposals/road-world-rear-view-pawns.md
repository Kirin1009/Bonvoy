# Road World Rear-View Pawns

## Delivered assets

- `assets/world/pawn-shun-m3.webp`: purple BMW M3 Touring, rear three-quarter elevated view.
- `assets/world/pawn-sayano-220.webp`: emerald BMW 220 Coupe, rear three-quarter elevated view.

Both files are 512 x 349 alpha WebP files and replace the previous front-facing pawns in place.

## Integration contract

- The top of each asset is the forward direction. Place it without CSS rotation on the road's center axis, pointing toward the top-center horizon.
- Both pawns share a camera height and warm sunset key light with `road-world-environment-v1.webp`.
- The 220 is a BMW coupe, with BMW rear proportions and badge; it deliberately no longer resembles a Mercedes coupe.
- Keep the current z-based scale and position logic. This update changes only the visual facing direction, so no geometry change is required.

## Verification

- Transparent canvas confirmed on both assets.
- Dimensions normalized to 512 x 349 for matching display scale.
- Each file is under 20 KB, well within the offline asset budget.
