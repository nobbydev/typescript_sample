import { useState, type SubmitEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';

export default function AdminLogin() {
  const { admin, isLoading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信をページ遷移させず、認証結果に応じて画面を更新する。
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('管理者ログインエラー:', err);
      setError(err instanceof Error ? err.message : 'ログインに失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 保存済みログイン状態の確認が終わるまで、誤った画面遷移を防ぐ。
  if (isLoading) {
    return <div className="min-h-screen bg-white p-8 text-emerald-800 font-sans">確認中...</div>;
  }
  // ログイン済みの場合はログイン画面を表示せず、アプリのトップへ戻す。
  if (admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
      <div className="max-w-md mx-auto">
        <h2 className="page-heading">管理者ログイン</h2>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg mb-6 text-sm">
          <p className="font-semibold mb-2">サンプルログイン情報</p>
          <p>管理者（レベル99・編集可）：admin@example.test / passwd</p>
          <p>閲覧のみ（レベル1）：viewer@example.test / passwd</p>
        </div>
        {/* 認証APIのエラーをフォームの近くに表示する。 */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 shadow-sm text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100 shadow-sm space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-emerald-900 mb-1.5">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="login-input w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-emerald-900 mb-1.5">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="login-input w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
