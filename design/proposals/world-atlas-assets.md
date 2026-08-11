# A案: World Atlas素材分解

Issue #4で選定されたA案を、滞在データから重ねて育てるための素材セット。ベース世界へホテル・判子・車を個別に重ねる。画像内に文字やロゴは入れない。

## 納品物

| 区分 | ファイル | 役割 |
| --- | --- | --- |
| S1 | `assets/world/base-atlas-unbuilt.webp` | 更地、空マス、銀ゲートだけの未開発世界 |
| S2 | `assets/world/hotel-*.webp` | 5宿の透過ミニチュア。各更地へ個別に建つ |
| S3 | `assets/world/pawn-*.webp` | 2人の現在地を示す透過の車ポーン |
| S4 | `design/proposals/world-atlas-anchors.json` | マスと更地の自然画像座標 |

### S2の使い分け

- `hotel-jw-phuket.webp`: リゾート高層
- `hotel-w-osaka.webp`: 都市デザイン塔
- `hotel-courtyard-nagoya.webp`: 中庭型の都市中層
- `hotel-izu-marriott.webp`: 温泉ロッジ
- `hotel-moxy-osaka.webp`: 小型ブティック

当面はこの5種をダミーの5宿へ割り当てる。将来116軒へ広げる場合も、ホテル名別に量産せず、ブランド区分と立地の組み合わせによる6〜8種の汎用ミニチュアへ拡張する。

## ココの実装契約

座標の原点はS1の画像左上、単位は自然画像px。表示幅が `renderedWidth` のとき、座標は `renderedWidth / 852` を掛けて使う。

- 判子: `squares[n]` の中心へ重ねる。既存SVGを使う
- ホテル: `lots[id]` の `x/y` を更地中心とし、画像の下端中央をそこへ合わせる
- 車: `pawns[].defaultSquare` のマス中心を基準に、2台は横へ少しずらす
- `scale`: 素材の自然サイズに対する推奨倍率。マスとの相対比を壊さないため、CSSの固定pxではなく画像幅に対して計算する

5軒が建った状態を表示してから、宿泊済みデータだけ該当ホテルを表示する。未泊の更地はS1のまま残す。銀ゲートより先の更地は次ティアの予告として使える。

## 検証

- S1は縦長852×1842pxで、圧縮後1MB未満
- S2/S3は透過WebP。単色キー背景は書き出し時に除去済み
- 画像はすべてローカル素材で、外部依存なし
