<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/user/list', [UserController::class, 'index']); // 会員一覧
Route::get('/prefectures', [UserController::class, 'prefectures']);
Route::post('/users', [UserController::class, 'store']);    // ユーザー登録
Route::get('/users/{id}', [UserController::class, 'show'])->whereNumber('id'); // ユーザー情報取得
Route::put('/users/{id}', [UserController::class, 'update'])->whereNumber('id'); // ユーザー情報更新
Route::delete('/users/{id}', [UserController::class, 'destroy'])->whereNumber('id'); // ユーザー削除
