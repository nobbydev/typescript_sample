<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AdminUser extends Authenticatable
{
    // 管理者APIでSanctumのアクセストークンを発行・照合できるようにする。
    // 要：composer require laravel/sanctum
    use HasApiTokens;

    // 管理者アカウントは一般ユーザーとは別テーブルで管理する。
    protected $table = 'admin_users';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'admin_level',
    ];

    protected $hidden = [
        'password_hash',
    ];

    // Laravelの認証処理がパスワード照合に使うカラムを管理者テーブルに合わせる。
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }
}
