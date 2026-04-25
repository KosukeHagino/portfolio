# 萩野弘祐 ポートフォリオ

フロントエンドエンジニアを目指す萩野弘祐のポートフォリオサイトです。
12年間の設計実務で培った論理的思考をベースに、モダンなWeb標準に準拠した、保守性の高い設計・コーディングを追求しました。

## 🌐 Webサイト
[Webサイトを見る](https://KosukeHagino.github.io/portfolio/)

## 🛠 使用技術・ツール
### Coding
- **HTML5**: セマンティックなマークアップ、アクセシビリティ（ARIA属性）への配慮
- **CSS3**: BEM設計、CSSカスタムプロパティ（変数）、論理プロパティ、Clamp関数
- **JavaScript**: Vanilla JS（スクロール演出、DOM操作）、Lenis（Smooth Scroll）

### Design & Tools
- **Design**: Figma / Photoshop
- **Workflow**: Git / SourceTree / GitHub / VS Code

## ✨ こだわり・実装ポイント
- **BEMによるコンポーネント設計**: 拡張性とメンテナンス性の高いクラス命名。
- **パフォーマンス最適化**: 全ての画像をWebP形式で管理し、処理速度を意識。
- **アクセシビリティ**: スクリーンリーダー利用者を想定した適切なタグ選定と状態管理（aria属性）。
- **設計思考の転用**: 12年間の機械設計で培った機能に基づくレイアウトの考え方をUI/UXに適用。

## 📂 ディレクトリ構造
.
├── index.html                # トップページ（制作物一覧をスライド）
├── profile.html              # プロフィールページ（自己紹介・制作プロセス）
├── skills.html               # スキルページ（デザイン・コーディング・開発環境）
├── works.html                # ワークスページ（制作物一覧）
├── works-portfolio.html      # 制作物詳細ページ：ポートフォリオ「萩野弘祐のポートフォリオ」（自作）
├── works-ogcafe.html         # 制作物詳細ページ：架空カフェ「OG cafe」（自作）
├── css/                      # BEMに基づいたCSS管理
├── js/                       # JavaScriptファイル
└── img/                      # WebP形式に最適化された画像

## 🚀 セットアップ
ローカル環境で確認する場合は、以下の手順を実行してください。

```bash
git clone [https://github.com/KosukeHagino/portfolio.git](https://github.com/KosukeHagino/portfolio.git)
cd portfolio
# VS CodeのLive Server等でindex.htmlを開いてください