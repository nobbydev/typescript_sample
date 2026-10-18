/**
 * アプリケーションのルーティングと共通レイアウトを定義する。
 * 管理者ログイン状態と権限レベルに応じて各画面へのアクセスを制御する。
 */
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { AdminAuthProvider, useAdminAuth } from './auth/AdminAuthContext';
import AdminLogin from './pages/AdminLogin';
import UserList from './pages/UserList';
import UserEdit from './pages/UserEdit';

// 共通ヘッダーと子ルート画面を表示するレイアウト。
function AppLayout() {
  const location = useLocation();

  {/* ヘッダー非表示ページの対象URL定義 */}
  const headerlessPaths = ['/admin/login'];
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

// ログイン状態と最低管理レベルを確認し、許可された子ルートを表示する。
function RequireAdminLevel({ minimumLevel }: { minimumLevel: number }) {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-white p-8 text-emerald-800 font-sans">確認中...</div>;
  }
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  if (admin.admin_level < minimumLevel) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// 認証プロバイダーとアプリケーションのルートを組み立てる。
export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<RequireAdminLevel minimumLevel={1} />}>
              <Route path="/" element={<UserList />} />
            </Route>
            <Route element={<RequireAdminLevel minimumLevel={99} />}>
              <Route path="/users/create" element={<UserEdit key="create" />} />
              <Route path="/users/:id/edit" element={<UserEdit key="edit" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}