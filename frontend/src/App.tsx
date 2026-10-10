import { BrowserRouter, Routes, Route } from 'react-router-dom';  // React Routerのインポート
import UserList from './pages/UserList';      // 会員一覧ページのコンポーネント
import UserCreate from './pages/UserCreate';  // 会員新規追加ページのコンポーネント

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ルート（/）のときは会員一覧を表示 */}
        <Route path="/" element={<UserList />} />

        {/* /users/create のときは新規追加ページを表示 */}
        <Route path="/users/create" element={<UserCreate />} />
      </Routes>
    </BrowserRouter>
  );
}