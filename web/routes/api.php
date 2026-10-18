<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Sanctumで認証されたユーザー情報を返す。
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ログイン試行を1分あたり5回に制限する。
Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

// ログイン後の管理者情報取得とログアウトにはSanctum認証を必須にする。
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
});

// 会員一覧は管理者認証に加え、レベル1以上の権限を必要とする。
Route::middleware(['auth:sanctum', 'admin.level:1'])->get('/user/list', [UserController::class, 'index']); // 会員一覧

// 編集系APIは管理者レベル99以上に限定する。
Route::middleware(['auth:sanctum', 'admin.level:99'])->group(function () {
    Route::get('/prefectures', [UserController::class, 'prefectures']);
    Route::post('/users', [UserController::class, 'store']);    // ユーザー登録
    Route::get('/users/{id}', [UserController::class, 'show'])->whereNumber('id'); // ユーザー情報取得
    Route::put('/users/{id}', [UserController::class, 'update'])->whereNumber('id'); // ユーザー情報更新
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->whereNumber('id'); // ユーザー削除
});
