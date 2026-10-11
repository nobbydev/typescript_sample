<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 名前とメールアドレスが空のとき、登録APIが両方の入力エラーを返すことを確認する。
     */
    public function test_create_requires_a_name_and_email(): void
    {
        // 名前とメールアドレスを空にして、登録APIへJSONを送信する。
        $this->postJson('/api/users', [
            'name' => '',
            'email' => '',
        ])
            // バリデーションエラー（HTTP 422）になり、両項目にエラーが返ることを確認する。
            ->assertUnprocessable()                             // 422か？
            ->assertJsonValidationErrors(['name', 'email']);    // name と email の両方にエラーが返るか？
    }

    /**
     * ユーザー取得APIが登録情報を返し、更新APIが名前とメールアドレスを保存することを確認する。
     */
    public function test_user_can_be_updated (): void
    {
        // APIのテスト対象として、更新前のユーザーをテストDBに用意する。
        $id = DB::table('users')->insertGetId([
            'name' => '変更前',
            'email' => 'before@example.com',
        ]);

        // IDを指定して取得APIを呼び、ユーザー情報が正しく返ることを確認する。
        $this->getJson("/api/users/{$id}")
        ->assertOk()            // 200か？
            ->assertExactJson([ // 取得したJSONが下記と同一か？
                'id' => $id,
                'name' => '変更前',
                'email' => 'before@example.com',
            ]);

        // 同じIDのユーザーを更新し、APIが成功メッセージを返すことを確認する。
        $this->putJson("/api/users/{$id}", [
            'name' => '変更後',
            'email' => 'after@example.com',
        ])
            ->assertOk()    // 200か？
            ->assertJson(['message' => '更新に成功しました']);

        // APIの応答だけでなく、更新後の値が実際にテストDBへ保存されたことを確認する。
        $this->assertDatabaseHas('users', [     // users テーブルに以下のデータが存在するか？
            'id' => $id,
            'name' => '変更後',
            'email' => 'after@example.com',
        ]);
    }

    /**
     * ユーザー削除APIが対象ユーザーを削除し、存在しないIDには404を返すことを確認する。
     */
    public function test_user_can_be_deleted(): void
    {
        $id = DB::table('users')->insertGetId([
            'name' => '削除対象',
            'email' => 'delete@example.com',
        ]);

        $this->deleteJson("/api/users/{$id}")
            ->assertOk()
            ->assertJson(['message' => '削除に成功しました']);

        $this->assertDatabaseMissing('users', ['id' => $id]);

        $this->deleteJson("/api/users/{$id}")
            ->assertNotFound()
            ->assertJson(['message' => 'ユーザーが見つかりません。']);
    }
}
