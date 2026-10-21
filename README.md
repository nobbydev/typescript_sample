# 会員情報管理サンプル

React + TypeScript のフロントエンドと Laravel API で構成された、会員一覧・新規登録・編集サンプルアプリケーションです。
Docker Compose で Nginx、PHP、MySQL を起動します。

## 公開情報
デモサイト：http://140.245.87.9:8000/
ソースコード：https://github.com/nobbydev/typescript_sample.git

## 主な技術

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS
- Backend: PHP 8.4, Laravel 12
- Database: MySQL 8.0
- Web server: Nginx

## フォルダ構成

```text
typescript_sample/
├── docker/                 # Docker関連の設定
│   ├── mysql/              # MySQL関連設定
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
   docker compose exec php php artisan migrate:fresh --seed ⇐※注意！
   docker compose exec php chmod -R 777 storage bootstrap/cache
   ```

   ※注意
   `migrate:fresh --seed` はデータベース内の全テーブルを削除してから作成し直し、サンプルデータを登録します。既存のデータを残したい環境では実行しないでください。

5. フロントエンドの依存関係をインストールし、Laravel の公開ディレクトリへビルドします。

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

   ビルド後、ブラウザーで <http://localhost:8000> を開きます。

テーブル定義は Laravel のマイグレーション、初期サンプルデータは Seeder で管理します。スキーマ変更は `docker compose exec php php artisan migrate` で適用できます。

## 管理者ログイン

会員一覧と編集画面は、管理者ログイン後に利用できます。管理レベル1以上は一覧を閲覧でき、レベル99以上は会員の新規作成・編集・削除も行えます。
（※管理者APIの認証にはLaravel Sanctumを使用しています）

Seederで作成されるサンプルアカウント:

| 権限 | メールアドレス | パスワード |
| --- | --- | --- |
| 最高（レベル99） | `admin@example.test` | `passwd` |
| 閲覧のみ（レベル1） | `viewer@example.test` | `passwd` |

ログインページは `/admin/login` です。

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

# Nginxアクセスログをファイルで表示（ホスト上）
tail -f docker/nginx/logs/access.log

# Nginxエラーログをファイルで表示（ホスト上）
tail -f docker/nginx/logs/error.log

# コンテナを停止（データボリュームは保持）
docker compose down
```

Nginxのログはプロジェクト内の `docker/nginx/logs/` に保存されます。OCIサーバー上でプロジェクトが `/home/ubuntu/<プロジェクト名>` にある場合、ログファイルは `/home/ubuntu/<プロジェクト名>/docker/nginx/logs/` 以下に作成されます。Compose設定を変更した後は `docker compose up -d` でNginxコンテナを再作成してください。

## トラブルシューティング

### 502 Bad Gateway が表示される

PHPコンテナを再作成した後にNginxが古いPHPコンテナのIPアドレスを参照している場合があります。プロジェクトルートでNginxを再起動してください。

```bash
docker compose restart nginx
```

## API

| Method | Path | 用途 |
| --- | --- | --- |
| `POST` | `/api/admin/login` | 管理者ログイン |
| `GET` | `/api/admin/me` | ログイン中の管理者情報を取得 |
| `POST` | `/api/admin/logout` | 管理者ログアウト |
| `GET` | `/api/user/list` | レベル1以上の会員一覧を取得 |
| `POST` | `/api/users` | レベル99以上で会員を新規登録 |
| `GET` | `/api/users/{id}` | レベル99以上で会員情報を取得 |
| `PUT` | `/api/users/{id}` | レベル99以上で会員情報を更新 |
| `DELETE` | `/api/users/{id}` | レベル99以上で会員情報を削除 |
