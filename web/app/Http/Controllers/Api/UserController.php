<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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

    public function show(int $id)
    {
        $user = DB::table('users')
            ->select('id', 'name', 'email')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, int $id)
    {
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id),
            ],
        ]);

        DB::table('users')->where('id', $id)->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        return response()->json(['message' => '更新に成功しました']);
    }
}
