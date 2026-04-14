import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  apiLogin,
  apiMe,
  apiRegister,
  type ApiUser,
} from '../lib/api';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const TOKEN_KEY = 'awb_token';
const USER_KEY = 'awb_user';
const GUEST_KEY = 'awb_offline_guest';

type AuthState = {
  ready: boolean;
  user: ApiUser | null;
  token: string | null;
  isOfflineGuest: boolean;
  online: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  continueOffline: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const offlineGuestUser: ApiUser = {
  id: 0,
  email: 'offline@local',
  name: 'Offline workspace',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const online = useOnlineStatus();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isOfflineGuest, setIsOfflineGuest] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const guest = localStorage.getItem(GUEST_KEY) === '1';

    if (guest && !storedToken) {
      setUser(offlineGuestUser);
      setIsOfflineGuest(true);
      setReady(true);
      return;
    }

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as ApiUser;
        setToken(storedToken);
        setUser(parsed);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!online || !token || isOfflineGuest) return;
    let cancelled = false;
    apiMe(token)
      .then((fresh) => {
        if (!cancelled) {
          setUser(fresh);
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [online, token, isOfflineGuest]);

  const setSession = useCallback((t: string, u: ApiUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.removeItem(GUEST_KEY);
    setToken(t);
    setUser(u);
    setIsOfflineGuest(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token: t, user: u } = await apiLogin(email, password);
      setSession(t, u);
    },
    [setSession]
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { token: t, user: u } = await apiRegister(email, password, name);
      setSession(t, u);
    },
    [setSession]
  );

  const continueOffline = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(GUEST_KEY, '1');
    setToken(null);
    setUser(offlineGuestUser);
    setIsOfflineGuest(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_KEY);
    setToken(null);
    setUser(null);
    setIsOfflineGuest(false);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      user,
      token,
      isOfflineGuest,
      online,
      login,
      register,
      continueOffline,
      logout,
    }),
    [
      ready,
      user,
      token,
      isOfflineGuest,
      online,
      login,
      register,
      continueOffline,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
