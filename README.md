# PassPal Extension - 中京大学学習支援ツール拡張機能

中京大学の学習支援システム（PassPal/MaNaBo）をより便利で使いやすくするブラウザ拡張機能です。

## 🚀 主な機能

### 📚 MaNaBo（授業支援システム）機能強化
- **Powerful Syusseki Caller**: 出席ポップアップを強制的に表示
- **自動ログインリダイレクト**: パスワード入力ページから自動的にShibboleth認証へ遷移
- **出席調査自動投票**: 出席調査を自動的に提出・確認
- **ビデオコントローラー**: 動画の高度な操作機能
  - 再生速度の柔軟な変更（0.25x〜16x）
  - 豊富なキーボードショートカット
  - フルスクリーン表示の最適化
  - ピクチャーインピクチャー対応
- **アイコンジャンプ**: 素早いナビゲーション機能

### 🌙 UI/UX改善
- **ダークモード**: 目に優しいダークテーマの提供
  - MaNaBo、ALBO両方に対応
  - ワンクリックでライト/ダークモード切り替え
  - 設定の永続化

### 🔐 認証・ログイン支援
- **Shibboleth自動ログイン**: 中京大学認証システムへの自動ログイン
- **セッション管理**: ALBO（学内ポータル）でのセッション切れ時の自動処理

## 📦 対応サイト

- **MaNaBo**: `https://manabo.cnc.chukyo-u.ac.jp/*`
- **Shibboleth認証**: `https://shib.chukyo-u.ac.jp/*`
- **ALBO（学内ポータル）**: `https://cubics-pt-out.mng.chukyo-u.ac.jp/*`

## 🛠️ 技術スタック

- **開発言語**: TypeScript/JavaScript
- **UIライブラリ**: React 19 + TypeScript
- **スタイリング**: CSS3 + TailwindCSS
- **ビルドツール**: Extension Framework
- **パッケージマネージャー**: Bun

## 📋 セットアップ・開発環境

### 前提条件
- Node.js 18+ または Bun
- Chrome/Firefox ブラウザ

### インストール
```bash
# リポジトリのクローン
git clone https://github.com/dokimiki/passpal_ext.git
cd passpal_ext

# 依存関係のインストール
bun install

# 開発モードで起動
bun run dev

# プロダクションビルド
bun run build
```

### ブラウザへの拡張機能読み込み
1. Chromeの場合: `chrome://extensions/` にアクセス
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトのルートディレクトリを選択

## 🎮 キーボードショートカット（動画コントローラー）

| キー | 機能 |
|------|------|
| **再生制御** |
| `Space` / `K` | 再生/一時停止 |
| `←` | 5秒戻る |
| `→` | 5秒進む |
| `0-9` | 再生位置をジャンプ（10%刻み） |
| **速度制御** |
| `S` / `,` | 再生速度を下げる（-0.25x） |
| `D` / `.` | 再生速度を上げる（+0.25x） |
| **音声制御** |
| `↑` | 音量上げる（+10%） |
| `↓` | 音量下げる（-10%） |
| `M` | ミュート切り替え |
| **表示制御** |
| `F` | フルスクリーン切り替え |
| `P` | ピクチャーインピクチャー |

## 📁 プロジェクト構造

```
passpal_ext/
├── manifest.json           # 拡張機能のメタデータ
├── background.ts           # バックグラウンドスクリプト
├── package.json           # プロジェクト依存関係
├── css/                   # スタイルシート
│   ├── dark_mode.css     # ダークモード用CSS
│   └── global.css        # 共通スタイル
├── src/                  # メインソースコード
│   ├── modules/          # 機能モジュール
│   │   └── auth/         # 認証関連
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ関数
│   └── *.ts              # 各種コンテンツスクリプト
└── images/               # 拡張機能アイコン
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ⚠️ 注意事項

- 本拡張機能は中京大学の学習支援システム専用です
- 認証情報は適切に管理し、共有しないでください
- 学内システムの利用規約を遵守してご利用ください

## 📞 サポート・問い合わせ

バグ報告や機能リクエストがある場合は、[Issues](https://github.com/dokimiki/passpal_ext/issues)からお知らせください。
