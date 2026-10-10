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
}
