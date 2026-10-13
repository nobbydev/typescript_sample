import { useEffect, useState, type SubmitEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type ValidationErrors = {
  name?: string[];
  email?: string[];
};

type User = {
  name: string;
  email: string;
};

type ApiErrorResponse = {
  errors?: ValidationErrors;
  message?: string;
};

function isUser(data: User | ApiErrorResponse): data is User {
  return 'name' in data && 'email' in data;
}

function isApiErrorResponse(data: User | ApiErrorResponse): data is ApiErrorResponse {
  return 'message' in data || 'errors' in data;
}

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined;
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      // 新規作成モードの場合はユーザー情報の取得は不要
      return;
    }

    const loadUser = async () => {
      /**
       * ローディング時間を一定以上にするためのプロミス
       */
      const minimumLoadingTime = new Promise<void>((resolve) => {
        // ｎ秒待つ
        window.setTimeout(resolve, 1000);
      });

      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: { Accept: 'application/json' },
        });
        const data: User | ApiErrorResponse = await response.json();

        await minimumLoadingTime; // n秒待つ → ローディング中を表示する為のダミー待ち

        if (!response.ok) {
          setError(
            (isApiErrorResponse(data) && data.message)
              || 'ユーザー情報を取得できませんでした。',
          );
          setLoadError(true);
          return;
        }

        if (!isUser(data)) {
          setError('ユーザー情報を取得できませんでした。');
          setLoadError(true);
          return;
        }

        setName(data.name);
        setEmail(data.email);
        setError(null);
        setLoadError(false);
      } catch (err) {
        console.error('ユーザー情報取得エラー:', err);
        setError('ユーザー情報の取得に失敗しました。時間をおいて再度お試しください。');
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [id]);

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

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateFrontend()) {
      return;
    }

    try {
      const response = await fetch(isEditing ? `/api/users/${id}` : '/api/users', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data: ApiErrorResponse = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setFieldErrors(data.errors || {});
          setError('入力内容にエラーがあります。各項目を確認してください。');
        } else {
          setError(data.message || 'サーバーエラーが発生しました。');
        }
        return;
      }

      localStorage.setItem(
        'flashMessage',
        isEditing ? '会員情報を更新しました！' : '会員の登録が完了しました！',
      );
      navigate('/');
    } catch (err) {
      console.error('通信エラー:', err);
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('この会員情報を削除します。よろしいですか？')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      const data: ApiErrorResponse = await response.json();

      if (!response.ok) {
        setError(data.message || '会員情報を削除できませんでした。');
        return;
      }

      localStorage.setItem('flashMessage', '会員情報を削除しました！');
      navigate('/');
    } catch (err) {
      console.error('会員情報削除エラー:', err);
      setError('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    // ローディング中の表示、setLoading()にて制御
    return (
      <div className="min-h-screen bg-white p-8 text-emerald-800 font-sans">
        読み込み中...
      </div>
    );
  }

  if (isEditing && loadError) {
    return (
      <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
        <div className="max-w-xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 shadow-sm text-sm">
            {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline inline-flex items-center text-sm transition-colors"
          >
            &larr; 一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <h2 className="page-heading">
          {isEditing ? '会員情報編集' : '会員新規追加'}
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

          <div className="pt-2 flex items-center justify-center gap-3">
            {/* 更新・登録ボタン */}
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
            >
              {isEditing ? '更新する' : '登録する'}
            </button>

            {/* 削除ボタン */}
            {isEditing && (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            )}
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