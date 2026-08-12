# A案: World Atlas素材分解

Issue #4で選定されたA案を、滞在データから重ねて育てるための素材セット。ベース世界へホテル・判子・車を個別に重ねる。画像内に文字やロゴは入れない。

## 納品物

| 区分 | ファイル | 役割 |
| --- | --- | --- |
| S1 | `assets/world/base-atlas-unbuilt.webp` | 更地、空マス、銀ゲートだけの未開発世界 |
| S1b | `assets/world/base-atlas-gateless.webp` | ティアゲートを動的に差し替える場合の、ゲートなし世界 |
| S2 | `assets/world/hotel-*.webp` | 5宿の個別ミニチュアと、116軒へ展開する7種の汎用ミニチュア |
| S3 | `assets/world/pawn-*.webp` | 2人の現在地を示す透過の車ポーン |
| S4 | `design/proposals/world-atlas-anchors.json` | マスと更地の自然画像座標 |
| S5 | `assets/world/gate-*.webp` | 金、プラチナ、チタン、アンバサダーの透過ティアゲート |

### S2の使い分け

- `hotel-jw-phuket.webp`: リゾート高層
- `hotel-w-osaka.webp`: 都市デザイン塔
- `hotel-courtyard-nagoya.webp`: 中庭型の都市中層
- `hotel-izu-marriott.webp`: 温泉ロッジ
- `hotel-moxy-osaka.webp`: 小型ブティック

当面はこの5種をダミーの5宿へ割り当てる。全116軒へはホテル名別に量産せず、`hotelTemplates` の7型を使う。

| テンプレート | 対象 |
| --- | --- |
| `luxury-city` | 都市型ラグジュアリー |
| `luxury-resort` | リゾート型ラグジュアリー |
| `premium-city` | 都市型プレミアム |
| `premium-resort` | リゾート・温泉型プレミアム |
| `select-city` | 都市型セレクト |
| `select-resort` | リゾート型セレクト |
| `ryokan` | 日本の旅館・リトリート型 |

## ティアゲート

銀（10泊）は既存の `assets/vertical-slice/gate-silver.webp` を使う。量産素材は、上位ティアほど素材の密度と重心が増すが、ゲーム的な宝石・王冠・発光は使わない。

| 泊数 | 素材 | 意図 |
| --- | --- | --- |
| 25 | `gate-gold-25.webp` | 真鍮の庇と暖灯 |
| 50 | `gate-platinum-50.webp` | 二重のプラチナアーチ |
| 75 | `gate-titanium-75.webp` | ファセット感のある濃色柱 |
| 100 | `gate-ambassador-100.webp` | 黒漆と臙脂の大門 |

## ココの実装契約

座標の原点はS1の画像左上、単位は自然画像px。表示幅が `renderedWidth` のとき、座標は `renderedWidth / 852` を掛けて使う。

- 判子: `squares[n]` の中心へ重ねる。既存SVGを使う
- ホテル: `lots[id]` の `x/y` は建物の**下端中央を置く位置**。`translate(-50%, -100%)` で置く
- 車: `pawns[].defaultSquare` のマス中心を基準に、2台は横へ少しずらす
- ゲート: `gates[]` は同じ道路アンカーを共有する。動的にゲートを出す画面では `gateWorld` を背景にし、現在の次ティアだけを表示する。達成後は上位ゲートへ差し替える
- `scale`: 素材の自然サイズに対する推奨倍率。マスとの相対比を壊さないため、CSSの固定pxではなく画像幅に対して計算する

5軒が建った状態を表示してから、宿泊済みデータだけ該当ホテルを表示する。未泊の更地はS1のまま残す。銀ゲートより先の更地は次ティアの予告として使える。

## 検証

- S1は縦長852×1842pxで、圧縮後1MB未満
- S2/S3は透過WebP。単色キー背景は書き出し時に除去済み
- S5は透過WebP。銀からアンバサダーまで同じ55度俯瞰・夕景光で揃える
- 画像はすべてローカル素材で、外部依存なし
