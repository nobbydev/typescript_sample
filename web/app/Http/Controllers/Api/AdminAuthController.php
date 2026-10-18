<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        // 必須項目とメールアドレス形式を検証してから認証処理に進む。
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = AdminUser::where('email', $validated['email'])->first();
        // 平文のパスワードは保存せず、登録済みハッシュと照合する。
        if (!$admin || !Hash::check($validated['password'], $admin->password_hash)) {
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが正しくありません。',
            ], 401);
        }

        return response()->json([
            // Sanctumの個人アクセストークンを発行し、フロントエンドへ返す。
            'token' => $admin->createToken('admin-spa')->plainTextToken,
            'admin' => $this->adminDetails($admin),
        ]);
    }

    public function me(Request $request)
    {
        // auth:sanctumで認証されたユーザーが管理者モデルであることを確認する。
        $admin = $request->user();
        if (!$admin instanceof AdminUser) {
            return response()->json(['message' => '管理者として認証されていません。'], 403);
        }

        return response()->json($this->adminDetails($admin));
    }

    public function logout(Request $request)
    {
        // 認証済みユーザーが管理者であることを確認してからトークンを失効させる。
        $admin = $request->user();
        if (!$admin instanceof AdminUser) {
            return response()->json(['message' => '管理者として認証されていません。'], 403);
        }

        $token = $admin->currentAccessToken();
        if (!$token instanceof PersonalAccessToken) {
            return response()->json(['message' => 'ログイントークンが無効です。'], 401);
        }

        $token->delete();

        return response()->json(['message' => 'ログアウトしました。']);
    }

    /**
     * APIレスポンスに含める管理者情報を必要な項目に限定して整形する。
     * @return array{id: int, name: string, email: string, admin_level: int}
     */
    private function adminDetails(AdminUser $admin): array
    {
        return [
            'id' => (int) $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'admin_level' => (int) $admin->admin_level,
        ];
    }
}
