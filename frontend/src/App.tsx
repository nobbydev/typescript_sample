import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import UserList from './pages/UserList';
import UserCreate from './pages/UserCreate';

function AppLayout() {
  const location = useLocation();

  {/* ヘッダー非表示ページの対象URL定義 */}
  const headerlessPaths = ['/login', '/signup', '/password/reset'];
  const hideHeader = headerlessPaths.includes(location.pathname);


  return (
    <>
      {!hideHeader && <Header />}{/* ヘッダーを非表示の判定 */}
      <main>
        <Outlet />  {/* 子ルート画面 */}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<UserList />} />
          <Route path="/users/create" element={<UserCreate />} />

          {/* ログインページ等を追加する場合
          <Route path="/login" element={<LoginPage />} />
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}