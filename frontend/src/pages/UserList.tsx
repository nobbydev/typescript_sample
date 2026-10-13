import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// データの型の定義
type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // フラッシュメッセージ用のState
  const [message, setMessage] = useState<string | null>(null);

  // 会員一覧をLaravelのAPIから取得する処理
  useEffect(() => {
    // フラッシュメッセージを取得する
    const flashMessage = localStorage.getItem('flashMessage');
    if (flashMessage) {
      setMessage(flashMessage);
      localStorage.removeItem('flashMessage'); // 一度表示したら削除
    }

    fetch('/api/user/list')
      .then((res) => {
        if (!res.ok) {
          throw new Error('会員一覧を取得できませんでした。時間をおいて再度お試しください。');
        }
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('データ取得エラー:', err);
        setLoadError(
          err instanceof Error
            ? err.message
            : '会員一覧の取得に失敗しました。時間をおいて再度お試しください。',
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 text-emerald-800 font-sans">
        読み込み中...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 shadow-sm text-sm">
            {loadError}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline inline-flex items-center text-sm transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // 会員追加ボタンが押されたときの処理
  const handleAddUser = () => {
    navigate('/users/create');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="page-heading">
          会員一覧ページ
        </h2>

        {/* フラッシュメッセージ（パステルグリーン風の警告・成功通知） */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg mb-6 shadow-sm">
            {message}
          </div>
        )}

        {/* 上部の会員追加ボタン */}
        <div className="mb-6">
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
            onClick={handleAddUser}
          >
            ＋ 会員を追加する
          </button>
        </div>

        {/* テーブル（パステルグリーンのヘッダーと柔らかい枠線） */}
        <div className="overflow-x-auto rounded-lg border border-emerald-100 shadow-sm mb-6">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-100">
                <th className="p-3.5 border-r border-emerald-100 font-semibold w-20 text-center">ID</th>
                <th className="p-3.5 border-r border-emerald-100 font-semibold">名前</th>
                <th className="p-3.5 font-semibold">メールアドレス</th>
                <th className="p-3.5 font-semibold w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="p-3.5 border-r border-emerald-100 text-center text-gray-600">{user.id}</td>
                  <td className="p-3.5 border-r border-emerald-100 font-medium text-gray-800">{user.name}</td>
                  <td className="p-3.5 text-gray-600">{user.email}</td>
                  <td className="p-3.5">
                    <button
                      className="text-emerald-700 hover:text-emerald-900 font-medium hover:underline"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 下部の会員追加ボタン */}
        <div>
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
            onClick={handleAddUser}
          >
            ＋ 会員を追加する
          </button>
        </div>
      </div>
    </div>
  );
}