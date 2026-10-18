import { useAdminAuth } from '../auth/AdminAuthContext';

export default function Header() {
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('管理者ログアウトエラー:', error);
      window.alert('ログアウト処理に失敗しました。ログイン画面へ移動します。');
    }
  };

  return (
    <header className="bg-emerald-100 p-4 shadow-md h-16 flex items-center justify-center relative">
      <h1
        className="m-0 font-bold"
        style={{
          color: '#064e3b',
          fontSize: '28px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        会員管理システム
      </h1>
      {admin && (
        <div className="absolute right-4 flex items-center gap-3 text-sm text-emerald-900">
          <span className="hidden sm:inline">名前：{admin.name}</span>
          <button onClick={() => void handleLogout()} className="font-medium hover:underline">
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}