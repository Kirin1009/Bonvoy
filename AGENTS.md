# Bonvoyラリー — エージェント向けガイド

マリオット ボンヴォイのホテルを泊まり歩く個人用の記録帳＆スタンプ帳PWA。ユーザーはオーナーのShunと妻・紗也乃の2名のみ。
このファイルはコーディングエージェント（Codex等）向けの作業ルール。詳細な要件は `docs/要件定義.md` を必ず参照すること。

- 公開URL: https://kirin1009.github.io/Bonvoy/ （GitHub Pages, mainブランチ直デプロイ。**大文字B** — 小文字 /bonvoy/ は404）
- 姉妹アプリ Sauna470s（Kirin1009/SAUNA30）から判子エンジンを移植した独立プロジェクト。サウナ側とデータ・コードの共有はない

## 技術構成

- **index.html 単体完結**（依存ライブラリゼロ・ビルドなし）。PWA（manifest.json / sw.js）
- ユーザーデータ: localStorage `bonvoy:v1` = `{stays:{hid:date}, wants:{hid:date}, radius}`
- バージョンは `APP_VERSION` の1箇所のみ（sw.jsは自動追従、手で触らない）。MAJOR=データ互換の変更 / MINOR=機能追加 / PATCH=修正
- `EDITION` = ホテルデータの収録日ラベル
- `HOTELS`: 1行 = `{id, name, city, pref, lat, lng, brand, cat}`。現在 日本67軒＋タイ49軒=116軒収録
  - `id` は一度公開したら変更禁止（記録のキー）
  - `city` = エリア（判子帳のグルーピングと判子の肩の文字）、`pref` = 国名（海外）or 都道府県（日本）
- ラリーは `QUESTS`。国制覇・エリア制覇は `HOTELS` から動的生成
- 判子はSVGで自動生成（`hotelSeal()`）。形=区分（六角=luxury/丸=premium/角=select）、未泊は伏せる

## 絶対ルール

1. **データ形式・localStorageキー・バックアップ互換を壊さない**（変更するならMAJOR＋移行処理必須）
2. **外部ライブラリ・外部フォント・ビルド工程を導入しない**（1ファイル主義）
3. リリース時は `APP_VERSION` を上げる
4. UI変更はスマホ幅390pxで表示確認する（Playwright chromium: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`、バージョン不一致時は `executablePath:'/opt/pw-browsers/chromium'`）
5. **ホテルデータの捏造禁止（実データ主義）**: 名称・都市・座標は marriott.com 等の公式ページで1軒ずつ確認したもののみ。ジオコーディング一括変換は不可。閉業・未開業・ブランド離脱ホテルは入れない
6. mainへの直pushはしない。作業ブランチ→PR（mainマージ＝即本番デプロイ）

## 現在の方向性（docs/要件定義.md に詳細）

- コンセプトは「台帳ファースト」: 主役は宿泊記録・採点・思い出。ラリーはおまけ
- v1.0.0 で `bonvoy:v2`（宿泊ごとの日付・泊数・価格・ポイント/UG・メモ）へ移行し、
  双六ステータスロード（エリート泊数の盤面UI）・採点5項目・Googleスプレッドシート同期（Apps Script）を載せる予定
- 判子帳・ラリーは国別（日本/タイ）切替表示にする予定
