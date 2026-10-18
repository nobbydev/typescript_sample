<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireAdminLevel
{
    public function handle(Request $request, Closure $next, int $minimumLevel = 0): Response
    {
        // 管理者モデルであり、ルートで指定された最低レベル以上の場合だけ処理を続ける。
        $admin = $request->user();
        if (!$admin instanceof AdminUser || $admin->admin_level < $minimumLevel) {
            return response()->json(['message' => 'この操作を行う権限がありません。'], 403);
        }

        return $next($request);
    }
}
