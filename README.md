# 自治体向け市民ポータルシステム

住民の暮らしが便利になる自治体とつながるWebアプリです。

## 機能一覧

| 機能 | 説明 |
|------|------|
| 🏠 ホーム | 行政サービス一覧・新着情報 |
| 📰 近隣情報・お知らせ | カテゴリフィルター・記事詳細・住民からの災害報告表示 |
| 🤖 AI-FAQ | Gemini AIによるチャットサポート（ストリーミング対応） |
| 📝 住民アンケート | 設問回答・送信後に集計結果グラフ表示 |
| 🚨 災害情報報告 | 災害種別選択・OpenStreetMapで位置指定・一覧マップ表示 |
| 📋 行政サービス詳細 | 手続き・医療・子育て・防災・施設予約など12カテゴリ |
| ⚙️ 管理画面 | 報告受付一覧・ステータス管理 |

---

## 必要環境

- **Node.js** v18以上（推奨：v20 / v22）
- **npm** v9以上

---

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd government-app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成します。

```bash
cp .env.example .env
```

`.env` を編集してAPIキーを設定します。

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **APIキーの取得：** [Google AI Studio](https://aistudio.google.com/apikey) で無料取得できます。

---

## 起動方法

AIチャット機能を使うには **Viteサーバー** と **APIサーバー** の2プロセスを同時に起動します。

### ターミナル① — APIサーバー（ポート 3001）

```bash
npm run server
```

正常起動時のログ：

```
APIサーバー起動: http://localhost:3001
Gemini APIキー: ✅ 設定済み
```

### ターミナル② — Vite開発サーバー（ポート 5173）

```bash
npm run dev
```

ブラウザで開く：

```
http://localhost:5173
```

---

## 通信構成

```
ブラウザ (5173)
  └─ /api/* をプロキシ ──→ Express APIサーバー (3001)
                                └─ Gemini API (gemini-3.1-flash-lite-preview)
```

APIキーはサーバー側のみで保持され、ブラウザには送出されません。

---

## その他のコマンド

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# Lint
npm run lint
```

---

## 主な技術スタック

| 種別 | 技術 |
|------|------|
| フロントエンド | React 19 / Vite (rolldown-vite) |
| 地図 | Leaflet / React-Leaflet / OpenStreetMap |
| AIチャット | Google Gemini API (`@google/generative-ai`) |
| APIサーバー | Express 5 / Node.js |
| スタイル | CSS（フレームワークなし） |

---

## ディレクトリ構成

```
government-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx            # ナビゲーションヘッダー
│   │   ├── MapPicker.jsx         # 地図クリックで位置指定
│   │   └── ReportMap.jsx         # 報告一覧マップ
│   ├── pages/
│   │   ├── HomePage.jsx          # トップページ
│   │   ├── NewsPage.jsx          # 近隣情報・お知らせ
│   │   ├── FAQPage.jsx           # AI-FAQチャット
│   │   ├── SurveyPage.jsx        # 住民アンケート
│   │   ├── DisasterReportPage.jsx  # 災害情報報告
│   │   ├── ServicePage.jsx       # 行政サービス詳細（12種）
│   │   └── AdminPage.jsx         # 管理画面
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── server.js          # Express APIプロキシサーバー
├── .env               # APIキー（git管理外）
├── .env.example       # 環境変数テンプレート
├── .gitignore
├── package.json
└── vite.config.js
```
