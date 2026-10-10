import { useEffect, useState } from 'react';
import './App.css';

// 1. Laravelから返ってくるユーザーデータの「型」を定義
interface User {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
}

function App() {
  // 2. 取得したユーザー一覧を管理する State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 3. 画面が表示されたタイミングで Laravel の API (/api/user/list) を叩く
  // useEffect:コンポーネントが画面に表示されたタイミング（初回レンダリング時）や、
  // 特定のデータが変わったタイミングで、特定の処理（副作用）を実行させる
  useEffect(() => {
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
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>会員一覧</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#87DACC' }}>
              <th>ID</th>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>登録日時</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. .map() で配列をループしてテーブルの行を生成 */}
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                {/* NULL の場合は「未設定」と表示 */}
                <td>{user.email ?? '未設定'}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;