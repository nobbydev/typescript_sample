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
    <header className="bg-emerald-100 p-4 shadow-md flex flex-col items-center gap-2">
      <div className="relative flex min-h-8 w-full items-center justify-center">
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
          <div className="absolute right-0 flex items-center gap-3 text-sm text-emerald-900">
            <span className="hidden sm:inline">名前：{admin.name}</span>
            <button onClick={() => void handleLogout()} className="font-medium hover:underline">
              ログアウト
            </button>
          </div>
        )}
      </div>
      {admin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-lg text-sm text-center">
          このサイトはサンプルとして公開されており、誰でも閲覧できます。実在するメールアドレスやパスワードなど、個人情報・機密情報の入力はご遠慮ください。
        </div>
      )}
    </header>
  );
}