# Bonvoyラリー — プロジェクト引き継ぎ書（2026.08.10作成）

マリオット ボンヴォイのホテルを泊まり歩く個人用スタンプ帳。オーナー：Shun（岐阜在住）。ユーザーは本人と妻・紗也乃の2名。
姉妹アプリ **Sauna470s / サ道場 東海**（リポジトリ Kirin1009/SAUNA30）から判子エンジンを移植した独立プロジェクト。サウナ側とデータ・コードの共有はない。

公開URL: https://kirin1009.github.io/bonvoy/ （GitHub Pages, mainブランチ直デプロイ。初回はSettings→Pages→main/rootの有効化が必要）

## コンセプト

- 泊まったBonvoy系列ホテルに判子を押して集めるコレクション帳。ラリー（お題）と判子帳の二層
- **実データ主義**：ホテルの名称・都市・座標は実在のもののみ。捏造データは絶対に入れない（座標が違うとGPSチェックインが壊れる）
- 判子はホテルごとに自動生成（画像アセット不要）。**泊まるまで伏せる**

## 技術構成

- **index.html単体完結**（依存ライブラリゼロ、ビルドなし）。独立PWA（manifest.json / sw.js / アイコンはSauna470sと共通の暫定品）
- データ：localStorage `bonvoy:v1` = `{stays:{hid:date}, wants:{hid:date}, radius}`
- バージョンは `APP_VERSION` の1箇所（現在 `0.1.0`）。SWは `./sw.js?v=<APP_VERSION>` で登録、キャッシュ名 `bonvoy-<ver>` は自動追従。MAJOR=データ互換の変更 / MINOR=機能追加 / PATCH=修正
- `EDITION` はホテルデータを収録した日付（現在「準備中」）
- **HOTELS は空**。1行 = `{id, name, city, pref, lat, lng, brand, cat}`。brandは `BRANDS` のキー、catはBonvoy公式区分（luxury/premium/select/longstay）
- `BRANDS` に19ブランド定義済み（リッツ・カールトン〜モクシー）
- ラリーは `QUESTS`（はじめての一泊/ラグジュアリー巡り/ブランド集め/全店制覇の雛形4本）。HOTELSから動的に対象を組む
- **ホテル判子の自動生成**（`hotelSeal()`）：形=区分（六角=luxury/丸=premium/角=select/五角=longstay）、中央=施設名の頭文字、肩=都市。かすれは共有フィルタ `#sealtex`、傾きはidハッシュ。未泊は形と「？」で伏せる
- ホテルカード（`openHotel()`）に手動判子・☆泊まりたい・Googleマップを集約。GPSチェックインは半径200〜2000m（既定800m。ホテルは敷地が広い）
- UIの世界観はSauna470s系（クリーム地・こげ茶・判子朱）。アクセントは紺 `--navy #3A4A6B`

## 次にやること（未着手）

1. **収録範囲を決める**（日本全店？よく行く都市圏？）→ 実データを投入して `EDITION` を付ける
   - 座標はGoogleマップ等で1軒ずつ確認する。ジオコーディングでの代替は不可（サウナ側で精度75m〜2.1kmのばらつきを実測済み）
2. アイコンをBonvoy用に描き替え（今はサウナハットのキャラの流用）
3. ラリーの拡充（都道府県制覇・カテゴリ制覇・エリート泊数など）と満願之証
4. 泊数・ポイント・採点など記録項目の検討（サ道場の採点画面の型が流用できる）

## 変更時の絶対ルール

1. データ形式・localStorageキー・バックアップ互換を壊さない
2. 外部ライブラリ・外部フォント・ビルド工程を導入しない（1ファイル主義）
3. リリース時は `APP_VERSION` を上げる（sw.jsは自動追従、手で触らない）
4. スマホ幅390pxで確認する（Playwright chromium は PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers）
5. ホテルデータの捏造禁止（実データ主義）
6. GitHub操作：gh CLI不可。git pushは可、PR作成/マージはGitHub MCPツールで
