# PassPal Extension (chukyo-manabo-extensions)

中京大学の学習支援ツール（Manabo, Cubicsなど）の利便性を向上させるためのブラウザ拡張機能です。

## 概要

この拡張機能は、中京大学の学生が使用する各種Webサービス（Manabo, Cubics,
Shibboleth認証など）に対して、自動ログイン、出席登録の効率化、動画プレイヤーの機能拡張などの機能を提供します。

## 主な機能

- **自動ログイン・再認証**:
    - Shibboleth認証画面での自動ログイン
    - Manabo/Cubicsのセッション切れ時の自動再認証
- **出席登録支援 (Powerful Syusseki Caller)**:
    - Manaboの授業ページにおける出席ボタンの視認性向上と機能拡張
- **動画プレイヤー拡張**:
    - 動画視聴時のコントロール機能の強化
- **設定管理**:
    - ポップアップUIから各機能の有効/無効や設定を管理可能

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React v19
- **ステート管理**: Zustand
- **ルーティング**: TanStack Router
- **スタイリング**: Tailwind CSS, Sass
- **ビルドツール**: Bun, extension CLI

## 開発環境のセットアップ

このプロジェクトはパッケージマネージャーとして **Bun** を使用しています。

### インストール

```bash
bun install
```

### 開発サーバーの起動

ホットリロード対応の開発サーバーを起動します。

```bash
bun run dev
```

### ビルド

本番用のビルドを行います。ビルド前にルートの生成（`gen-routes`）が自動的に実行されます。

```bash
bun run build
```

### その他コマンド

- **Lint**: コードの静的解析と修正を行います。

    ```bash
    bun run lint
    ```

- **ルート生成**: TanStack Routerのルート定義を更新します（`action/routes`配下を変更した際に実行）。

    ```bash
    bun run gen-routes
    ```

## ディレクトリ構成

- `action/`: ポップアップUI（Reactアプリケーション）のソースコード
- `contents/`: 各Webページに注入されるコンテンツスクリプト
- `services/`: バックグラウンドスクリプト（Service Worker）
- `store/`: Zustandによるグローバルステート管理
- `utils/`: ユーティリティ関数
- `manifest.json`: 拡張機能のマニフェストファイル
