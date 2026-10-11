# 会員情報管理サンプル

React + TypeScript のフロントエンドと Laravel API で構成された、会員一覧・新規登録・編集サンプルアプリケーションです。
Docker Compose で Nginx、PHP、MySQL を起動します。

## 主な技術

- Frontend: React, TypeScript, Vite, React Router
- Backend: PHP 8.2, Laravel 10
- Database: MySQL 8.0
- Web server: Nginx

## フォルダ構成

```text
typescript_sample/
├── docker/                 # Docker関連の設定
│   ├── mysql/              # MySQL初期化SQL
│   ├── nginx/              # Nginx設定
│   └── php/                # PHPコンテナのDockerfile
├── frontend/               # React + TypeScriptのフロントエンド
│   └── src/                # 画面・コンポーネントのソースコード
├── web/                    # Laravelのバックエンド、WEB
└── docker-compose.yml      # コンテナ構成
```

## 必要なもの

- Docker と Docker Compose
- Node.js と npm（フロントエンドの開発・ビルドに使用）

## 初回セットアップ

以下のコマンドはプロジェクトのルートディレクトリで実行します。

1. Laravel の環境ファイルを作成します。

   ```bash
   cp web/.env.example web/.env
   ```

2. `web/.env` のデータベース設定を Docker Compose の MySQL 設定に合わせます。

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=phper
   DB_PASSWORD=pass
   ```

3. PHP、Nginx、MySQL コンテナを起動します。

   ```bash
   docker compose up -d --build
   ```

4. PHP コンテナ内で Laravel の依存関係をインストールし、アプリケーションキーを生成します。

   ```bash
   docker compose exec php composer install
   docker compose exec php php artisan key:generate
   ```

5. フロントエンドの依存関係をインストールし、Laravel の公開ディレクトリへビルドします。

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

   ビルド後、ブラウザーで <http://localhost:8000> を開きます。

MySQL の初期化SQLは、データボリュームが新規作成されたときに実行され、サンプル会員データを登録します。既存のデータボリュームがある場合、このSQLは再実行されません。

## フロントエンド開発

Docker Compose でバックエンドを起動した状態で、別のターミナルから実行します。

```bash
cd frontend
npm ci
npm run dev
```

Vite の開発サーバーは <http://localhost:5173> で起動し、`/api` へのリクエストを `http://localhost:8000` に転送します。

## 使用コマンド

プロジェクトルートで実行します。

```bash
# コンテナの状態を確認
docker compose ps

# ログを表示
docker compose logs -f

# コンテナを停止（データボリュームは保持）
docker compose down
```

## API

| Method | Path | 用途 |
| --- | --- | --- |
| `GET` | `/api/user/list` | 会員一覧を取得 |
| `POST` | `/api/users` | 会員を新規登録 |
| `GET` | `/api/users/{id}` | 会員情報を取得 |
| `PUT` | `/api/users/{id}` | 会員情報を更新 |
| `DELETE` | `/api/users/{id}` | 会員情報を削除 |
