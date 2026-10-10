<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        // users テーブルからすべてのデータを取得
        $users = DB::table('users')->select('id', 'name', 'email', 'created_at')->get();

        // JSON形式でフロントエンドへ返す
        return response()->json($users);
    }

    public function store(Request $request)
    {
        // バリデーション（emailの重複などを防ぐ）
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        // データベースに挿入
        DB::table('users')->insert([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'created_at' => now(),
        ]);

        return response()->json(['message' => '登録に成功しました'], 201);
    }
}
