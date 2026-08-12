# Bonvoy World Stamp Specification

## Goal

ホテルタイルに記録される判子を、安価な単線アイコンではなく「朱肉で押した旅の記録」として扱う。ホテル名やマップを隠さず、390px幅では直径42px前後でもスタンプと分かる密度にする。

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--stamp-ink-base` | `#B63B2E` | 主線・文字 |
| `--stamp-ink-deep` | `#8E241D` | かすれの奥行き・押し跡 |
| `--stamp-ink-fresh` | `#D85A43` | ごく薄い朱肉の縁、最大25%不透明度 |
| `--stamp-press` | `#5F3028` | タイルへ沈んだ押し跡 |
| `--stamp-gold-base` | `#AF7A25` | ティア達成判子の主線 |
| `--stamp-gold-light` | `#D8B560` | ティア達成判子の縁 |
| `--stamp-gold-deep` | `#765017` | ティア達成判子の影 |

通常のホテル判子は赤だけを使う。金色はティア解放・到達の記念判子だけに限定し、宿泊記録のカテゴリ色としては使わない。

## Geometry

判子の内部座標は `viewBox="-50 -50 100 100"`。マップ上では自然サイズ92px、390px表示では約42pxを基準にする。

| Element | Specification |
| --- | --- |
| 外枠 | `stroke-width: 5.5`、`linecap: round`、`linejoin: round` |
| 内枠 | 外枠から8px内側、`stroke-width: 1.25` |
| 中央モノグラム | 34px、600 weight、縦位置 `y=10` |
| 都市略称 | 5.5px、600 weight、字間0.55px、縦位置 `y=-18` |
| 日付または連番 | 4.5px、500 weight、縦位置 `y=25`。データがなければ出さない |
| 回転 | 個別IDから決定する `-4deg` から `4deg`。カードの都度ランダム化しない |

カテゴリ形状は、`luxury` を六角形、`premium` を角丸四角、`select` を円、`ryokan` を扇形の上端を持つ四角にする。中央の記号はホテル頭文字または一文字の和名略称とし、カテゴリを文字で説明しない。

## Layer Order

同じ `transform="rotate(...)"` グループ内に、下からこの順で積む。

1. **Press relief**: `assets/world/stamp-press-relief.webp` を判子外接矩形へ配置。`mix-blend-mode:multiply`、不透明度 `0.16`、`filter: blur(.35px)`、`translateY(1.2px)`。
2. **Ink bed**: カテゴリ形状を `#8E241D`、不透明度 `0.17`、塗りのみで置く。ベタ塗りにはしない。
3. **Primary frame**: 外枠・内枠・中央文字を `#B63B2E` で描画。全体に `opacity=.93`。
4. **Ink mottle**: `assets/world/stamp-ink-mottle.webp` を `clipPath` で判子形状に切り、`mix-blend-mode:multiply`、不透明度 `0.30`。中央文字を読めなくする場合は `0.22`まで下げる。
5. **Wear mask**: frameと文字のグループに `assets/world/stamp-wear-mask.webp` を `mask-mode:luminance` で適用する。欠損量は面積の6%から12%に留め、外枠を完全に切断しない。
6. **Fresh edge**: 任意。外枠だけに `#D85A43`、`stroke-width:.75`、`opacity:.22` を重ねる。明るいタイルでのみ有効化する。

乱れはIDハッシュから導く固定 `seed` を使う。`feTurbulence` を使う場合は `type="fractalNoise"`、`baseFrequency=".45"`、`numOctaves="2"`、`feDisplacementMap scale="1.2"` を上限にする。線を溶かすのではなく、朱肉の粒子として見える程度に抑える。

## Shared Materials

| Asset | Role | Composition |
| --- | --- | --- |
| `assets/world/stamp-ink-mottle.webp` | 朱肉の濃淡・粒子 | 形状内にクリップしてmultiply。赤の色調を変えず密度だけ揺らす。 |
| `assets/world/stamp-wear-mask.webp` | かすれ・小欠け | `mask-mode:luminance`。1回の記録に同じ位置で使い、アニメーションさせない。 |
| `assets/world/stamp-press-relief.webp` | タイルに残る凹み | 判子より3%大きく、1.2px下へずらす。赤ではなく深い茶で静かに使う。 |

3素材はいずれも256px正方形で、実装時は判子の外接矩形へstretchしてよい。濃淡と押し跡は透明WebP、かすれは白黒の輝度マスクである。

## Tile And Tier Rules

宿泊済みのタイルだけに、判子と同じシルエットの押し跡を置く。未訪問タイル、ゲート、ホテル写真には押し跡を流用しない。タイル本文より上、ホテル名より下に置き、クリック領域を遮らない。

ティア達成にはホテル判子を金へ着色し直さず、別の小さな到達判子を使う。円形二重枠、中央にティア略称、日付行なし、`--stamp-gold-base`を主線とする。通常のホテル判子より8%小さく、ゲート解放アニメーションの終端で一度だけ表示する。

## Implementation Notes For Coco

`index.html` の既存 `hotelSeal()` はこの仕様に近い `sealtex` を持つため、まず色を `#D9483B` から `#B63B2E` へ寄せ、`stroke`を4.5pxから5.5pxへ上げる。次に、スタンプの `defs` に形状ごとの `clipPath` を持たせ、上記3WebPをSVGの `<image>` とCSS maskで合成する。`filter`、回転、マスクのseedは必ずホテルIDから安定生成する。

比較は [stamp-comparison-390.webp](stamp-comparison-390.webp) と [mock-stamp-richness.html](../mock-stamp-richness.html) を参照する。
