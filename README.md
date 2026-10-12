# 会員情報管理サンプル

React + TypeScript のフロントエンドと Laravel API で構成された、会員一覧・新規登録・編集サンプルアプリケーションです。
Docker Compose で Nginx、PHP、MySQL を起動します。

## 公開情報
デモサイト：http://140.245.87.9:8000/
ソースコード：https://github.com/nobbydev/typescript_sample.git

## 主な技術

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
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
│   └── .env                # Laravel用環境設定ファイル（要設定）
└── docker-compose.yml      # コンテナ構成
  └── .env                  # mysql用環境設定ファイル（要設定）
```

## 必要なもの

- Docker と Docker Compose
- Node.js と npm（フロントエンドの開発・ビルドに使用）

## 初回セットアップ

以下のコマンドはプロジェクトのルートディレクトリで実行します。

1. Docker Compose 用と Laravel 用の環境ファイルを、それぞれのサンプルから作成します。

   ```bash
   cp .env.example .env
   cp web/.env.example web/.env
   ```

   プロジェクト直下の `.env` は Docker Compose の MySQL 初期設定（データベース名、ユーザー、パスワード）に使います。`web/.env` は Laravel のアプリケーション設定と DB 接続に使う別ファイルです。DB 設定は両方で同じ値にしてください。ローカル開発用の初期値は次のとおりです。

   ```dotenv
   # .env
   MYSQL_DATABASE=laravel
   MYSQL_USER=phper
   MYSQL_PASSWORD=pass
   MYSQL_ROOT_PASSWORD=pass

   # web/.env
   DB_CONNECTION=mysql
   DB_HOST=db
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=phper
   DB_PASSWORD=pass
   ```

   これらの値はローカル開発専用です。本番環境では安全な値を環境に応じて設定してください。`.env`、`web/.env`、`.env.production` などの環境設定ファイルにはパスワードや秘密情報が含まれるため、Git に登録しないでください。

3. PHP、Nginx、MySQL コンテナを起動します。

   ```bash
   docker compose up -d --build
   ```

4. PHP コンテナ内で Laravel の依存関係をインストールし、アプリケーションキーを生成します。

   ```bash
   docker compose exec php composer install
   docker compose exec php php artisan key:generate
   docker compose exec php chmod -R 777 storage bootstrap/cache
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
