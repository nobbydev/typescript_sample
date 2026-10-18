/**
 * 管理者の認証状態を管理するContextとProvider、認証用フックを定義する。
 * ログイン状態の確認や認証付きAPI呼び出しを提供する。
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  admin_level: number;
};

type LoginResponse = {
  token: string;
  admin: AdminUser;
  message?: string;
};

// Providerからアプリ内の画面に渡す認証情報と操作。
type AdminAuthContextValue = {
  admin: AdminUser | null;
  isLoading: boolean;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
// localStorageに保存する管理者APIトークンのキー。
const TOKEN_STORAGE_KEY = 'adminToken';

// ログイン状態を管理し、子コンポーネントに認証情報と操作を渡す。
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));

  // 保存済みトークンを確認し、ページ再読み込み後もログイン状態を復元する。
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) return;

    let cancelled = false;
    // 保存済みトークンをサーバーに照会し、管理者情報を取得できた場合だけログイン状態を復元する。
    const restoreSession = async () => {
      try {
        // ログイン中の管理者情報を取得
        const response = await fetch('/api/admin/me', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('保存された管理者ログインを確認できませんでした。');
        }

        const currentAdmin = (await response.json()) as AdminUser;
        // Provider破棄後に非同期処理の結果でstateを更新しない。
        if (cancelled) return;

        setToken(storedToken);
        setAdmin(currentAdmin);
      } catch (error: unknown) {
        if (cancelled) return;
        console.error('管理者ログイン状態の確認に失敗しました:', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // ブラウザー内のトークンとログイン状態を消す。
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  // トークン付きでAPIを呼び、認証切れならログアウト状態にする。
  const apiFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      headers.set('Accept', 'application/json');
      if (token) headers.set('Authorization', `Bearer ${token}`);

      const response = await fetch(input, { ...init, headers });
      // 401は認証切れとして扱い、ブラウザー側のログイン情報も破棄する。
      if (response.status === 401) clearSession();
      return response;
    },
    [clearSession, token],
  );

  // ログイン処理
  // ログインAPIで認証し、成功したら情報を保存する。
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as LoginResponse;
    if (!response.ok) {
      throw new Error(data.message || 'ログインできませんでした。');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setAdmin(data.admin);
  }, []);

  // ログアウト処理
  // サーバーでトークンを失効させ、ブラウザー内のログイン状態も消す。
  const logout = useCallback(async () => {
    try {
      if (token) {
        const response = await apiFetch('/api/admin/logout', { method: 'POST' });
        if (!response.ok) {
          throw new Error('ログアウト処理に失敗しました。');
        }
      }
    } finally {
      clearSession();
    }
  }, [apiFetch, clearSession, token]);

  // Providerの内側で認証情報と操作を使えるようにする。
  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, apiFetch, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Providerから認証情報と操作を取り出す。
export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
