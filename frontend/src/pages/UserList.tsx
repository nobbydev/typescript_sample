import { useState, useEffect } from 'react';

// データの型の定義
type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          throw new Error('データの取得に失敗しました');
        }
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('データ取得エラー:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mt-4">読み込み中...</div>;
  }

  // 会員追加ボタンが押されたときの処理（例: リンクやモーダルを開くなど）
  const handleAddUser = () => {
    // 例: 新規追加ページへ飛ばす場合
    window.location.href = '/users/create';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      <h2 className="mb-3">会員一覧ページ</h2>

      {/* フラッシュメッセージがあれば緑色のボックスで表示する */}
      {message && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      {/* 上部の会員追加ボタン */}
      <div className="mt-3 mb-5">
        <button className="btn btn-primary" onClick={handleAddUser}>
          会員を追加する
        </button>
      </div>
      <br/>
      {/* テーブルに border="1" や borderCollapse、枠線のスタイルを明示的に指定する */}
      <table 
        border={1} 
        cellPadding={8} 
        style={{ 
          borderCollapse: 'collapse', 
          width: '100%', 
          backgroundColor: '#ffffff',
          borderColor: '#dddddd' // 枠線の色
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>名前</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px' }}>メールアドレス</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{user.id}</td>
              <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{user.name}</td>
              <td style={{ border: '1px solid #dddddd', padding: '8px' }}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      {/* 下部の会員追加ボタン */}
      <div className="mt-3 mb-5">
        <button className="btn btn-primary" onClick={handleAddUser}>
          会員を追加する
        </button>
      </div>

    </div>
  );
}