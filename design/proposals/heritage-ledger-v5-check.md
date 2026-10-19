# Heritage Travel Ledger v5 - Structure Check

## Scope

`design/mock-ledger-v5.html` is the 390px structure mock for the approved A direction, **Heritage Travel Ledger**. It deliberately reuses only the existing cream marble tile, silver gate, and two vehicle assets from `assets/vertical-slice/`; no new scenery or generated imagery is introduced.

## Reading Order

1. The navy ledger header identifies the year and screen purpose.
2. The `8`-night total and `あと2泊でシルバー` are paired in the first summary block.
3. The folio presents stamped stays as the primary route; the two vehicles mark the current position without replacing the stamps.
4. A restrained silver gate and dashed ninth tile indicate the next threshold.
5. `宿泊を記録` sits below the folio, so it cannot mask the path.

## Completion Check

| Requirement | Result | Evidence in mock |
| --- | --- | --- |
| 3 seconds to read 8 nights, 2 nights remaining, and current location | Pass | Header summary; `現在地` label on night 8; selected-stay row |
| Red stamps read as records before vehicles | Pass | Eight stamps occupy the route; two small vehicle assets sit only at the current position |
| CTA does not cover the board | Pass | `宿泊を記録` is below `.folio` |
| Past, current, and next use three contrast levels | Pass | Desaturated `.past`, navy-framed `.current`, brass dashed `.next` |
| Works without a background image | Pass | The folio uses paper, route stroke, and tile surfaces only; no scenery asset is referenced |
| External dependencies and asset budget | Pass | Static HTML/CSS/JS only; reuses three in-repo WebP assets |

## Integration Note for Coco

Keep the visual contract rather than copying the mock wholesale: the status summary, selection row, and action belong outside the route. The production screen should derive route state from stay records; the mock action opens a dialog only to demonstrate placement.

## Verification Limitation

The local Playwright Chromium binary was unavailable in this workspace, so an automated 390px screenshot could not be regenerated here. The mock uses a fixed 390px application width and contains no viewport-scaled typography.
