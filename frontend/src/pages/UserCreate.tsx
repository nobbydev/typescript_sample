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

      const data = await response.json();

      if (!response.ok) {
        // Laravelからのバリデーションエラー（422）の場合
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>会員新規追加</h2>

      {error && <p style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>名前:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {fieldErrors.name && (
            <span style={{ color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '3px' }}>
              {fieldErrors.name[0]}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>メールアドレス:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {fieldErrors.email && (
            <span style={{ color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '3px' }}>
              {fieldErrors.email[0]}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          登録する
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          &larr; 一覧に戻る
        </button>
      </div>
    </div>
  );
}