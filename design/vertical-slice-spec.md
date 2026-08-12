# Day Rally Vertical Slice

Issue #4で確定した「昼はクリーム大理石、夜は任意切替」「ティア導線はハイブリッド」「駒は2台の車」を、実装判断に使える最小セットへ落とした。

## 納品物

| ファイル | 用途 | 形式・寸法 | 容量 |
|---|---|---:|---:|
| `assets/vertical-slice/tile-cream-marble.webp` | 通常マス | WebP 512 x 512 | 6.8KB |
| `assets/vertical-slice/gate-silver.webp` | 最初のティアゲート | 透過WebP 512 x 512 | 14.0KB |
| `assets/vertical-slice/pawn-shun-m3-touring.webp` | Shunの駒 | 透過WebP 512 x 512 | 16.5KB |
| `assets/vertical-slice/pawn-sayano-220-coupe.webp` | Sayanoの駒 | 透過WebP 512 x 512 | 15.2KB |
| `assets/vertical-slice/background-day-resort.webp` | 昼テーマ遠景 | WebP 780 x 948 | 34.2KB |
| `design/vertical-slice-preview.html` | 390px合成確認 | 外部依存なし | - |
| `design/vertical-slice-preview.webp` | 390px静的合成見本 | WebP 390 x 474 | 18.1KB |

素材合計は約86.7KB。全点200KB以下で、2MBのキャッシュ予算に十分な余白がある。

## 統合仕様

- 昼テーマを初期値にする。夜テーマは明示的な切替操作で選ぶ。
- 背景は盤面全体の最背面へ `cover` で配置する。UI文字の可読性が必要な領域には、CSSでネイビーの半透明レイヤーを重ねる。
- 通常マスは中央を空けてある。ホテル名、判子、達成状態は画像へ焼き込まずHTML/CSS/SVGで重ねる。
- ゲートと車はすでに同じ55度前後の視点、左手前から右奥へ向く光で合わせてある。反転や大きな回転はしない。
- 390px幅では通常マスを約88px、ゲートを約174px、車を約114pxの外接ボックスで開始する。実装時は盤面の当たり判定と別レイヤーにする。
- 2台は同じ512pxキャンバス、同じ約420pxの車体幅で揃えた。実車寸法差は誇張せず、色とボディ形状で識別する。
- ハイブリッド導線は、通常ルート上にゲートを置き、達成時だけティア色や銀の進行演出をCSSで加える。通常マス画像自体は共通利用する。
- 本素材には文字・ロゴを入れていない。Shun車は紫のスポーツワゴン、Sayano車は緑のコンパクトクーペとして識別する。

## 検証

- `design/vertical-slice-preview.html` と静的合成見本を390px幅で表示し、背景、5マス、ゲート、2台の前後関係を確認する。
- ゲートと車2点はRGBAを保持し、四隅が完全透過であることを確認する。
- 全素材をWebPへ変換し、1点200KB以下、合計2MB以下を確認する。
- オフライン前提のため外部フォント、外部画像、JavaScriptライブラリを使わない。

## 生成プロンプト

### 通常マス

> A single square board-game tile, exact top-down orthographic view, refined cream-white Carrara marble with very subtle warm gray veining, slim inset navy enamel line, tiny brushed brass corner protectors, understated luxury hotel stationery aesthetic, soft daylight, quiet empty center for an HTML label or stamp, no text, no logo, no symbols, centered, isolated composition, 1:1.

### シルバーゲート

> A single elegant silver-tier gateway for a luxury travel board game, viewed from an elevated 55-degree isometric angle, two warm cream limestone pillars, a restrained curved brushed-silver beam, one fine navy enamel accent line, small warm lantern details, refined adult styling, soft daylight from upper left, clean silhouette, no text, no logo, no emblem, centered on a solid saturated magenta chroma-key background, no ground plane, no cast shadow outside the object, 1:1.

### Shun車

> A single miniature luxury performance station-wagon game pawn inspired by a modern German M3 Touring silhouette, rich metallic royal purple, no manufacturer badge, no grille logo, no text, elevated 55-degree isometric view from the front-left, car pointing toward the upper right, refined realistic toy-like proportions for an adult board game, soft daylight from upper left, clean silhouette, centered on a solid saturated green chroma-key background, no road, no base, no cast shadow outside the car, 1:1.

### Sayano車

> A single miniature compact two-door luxury coupe game pawn inspired by a modern German 220 Coupe silhouette, deep metallic British racing green, no manufacturer badge, no grille logo, no text, same scale and camera as the purple wagon: elevated 55-degree isometric front-left view, car pointing toward the upper right, refined realistic toy-like proportions for an adult board game, soft daylight from upper left, clean silhouette, centered on a solid saturated magenta chroma-key background, no road, no base, no cast shadow outside the car, 1:1.

### 昼背景

> A quiet luxury island-resort terrace in daylight, elevated viewpoint over cream limestone paving toward a calm deep-blue sea and low tropical islands, restrained palm foliage framing only the far edges, open uncluttered central and lower area for a mobile board-game route, warm ivory, navy blue and small natural green accents, sophisticated editorial travel photography, soft clear morning light, no people, no vehicles, no furniture, no text, no logos, vertical composition.

## ココへの統合事項

- 本体への統合は `index.html` 側で行い、このPRでは本体、`sw.js`、`manifest.json`、HOTELSデータを変更しない。
- 初回統合では昼背景、通常マス、銀ゲート、2台の車だけを使い、ティア5色展開はこの縮尺と光向きを基準にする。
- 透過素材は余白込み512pxキャンバスなので、CSSでは `object-fit: contain` を使う。
- PWAキャッシュへ追加する際は既存のバージョン運用に従う。
