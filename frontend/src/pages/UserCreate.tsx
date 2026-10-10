import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ValidationErrors = {
  name?: string[];
  email?: string[];
};

export default function UserCreate() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();

  const validateFrontend = (): boolean => {
    if (!name.trim()) {
      setError('名前を入力してください。');
      return false;
    }
    if (!email.trim()) {
      setError('メールアドレスを入力してください。');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('正しいメールアドレスの形式で入力してください。');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateFrontend()) {
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      // 一覧画面に渡すフラッシュメッセージを保存する
      localStorage.setItem('flashMessage', '会員の登録が完了しました！');        

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setFieldErrors(data.errors || {});
          setError('入力内容にエラーがあります。各項目を確認してください。');
        } else {
          setError(data.message || 'サーバーエラーが発生しました。');
        }
        return;
      }

      // 登録成功したら一覧画面へリダイレクト
      navigate('/');
    } catch (err) {
      console.error('通信エラー:', err);
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-emerald-900 border-b-2 border-emerald-200 pb-3 mb-6">
          会員新規追加
        </h2>

        {/* 全体エラーメッセージ */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 shadow-sm text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-1.5">
              名前:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
              placeholder="例: 山田 太郎"
            />
            {fieldErrors.name && (
              <span className="text-rose-600 text-xs mt-1.5 block">
                {fieldErrors.name[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-1.5">
              メールアドレス:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
              placeholder="例: example@mail.com"
            />
            {fieldErrors.email && (
              <span className="text-rose-600 text-xs mt-1.5 block">
                {fieldErrors.email[0]}
              </span>
            )}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
            >
              登録する
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button 
            onClick={() => navigate('/')} 
            className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline inline-flex items-center text-sm transition-colors"
          >
            &larr; 一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}