import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { AuthAmbient } from '../components/AuthAmbient';
import { BrandRobotIcon } from '../components/BrandRobotIcon';

export function LoginPage() {
  const navigate = useNavigate();
  const { ready, user, isOfflineGuest, login, register, continueOffline } =
    useAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (ready && user && !isOfflineGuest) {
      navigate('/', { replace: true });
    }
  }, [ready, user, isOfflineGuest, navigate]);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/health')
      .then((r) => {
        if (!cancelled) setApiOk(r.ok);
      })
      .catch(() => {
        if (!cancelled) setApiOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(email, password, name || email.split('@')[0] || 'User');
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="splash">
        <div className="splash__inner">
          <span className="splash__logo" aria-hidden>
            <BrandRobotIcon className="brand-robot-icon" />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <AuthAmbient />
      <div className="auth-page__hero">
        <div className="auth-page__hero-inner">
          <span className="auth-page__hero-mark" aria-hidden>
            <BrandRobotIcon className="brand-robot-icon" />
          </span>
          <h1 className="auth-page__hero-title">Agent Workflow Builder</h1>
          <p className="auth-page__hero-lead">
            Design agent pipelines with triggers, LLM steps, tools, and outputs.
            Sync securely to your workspace, or continue offline on this
            device.
          </p>
          <ul className="auth-page__bullets">
            <li>Graph editor with live validation</li>
            <li>JWT-authenticated REST API &amp; SQLite storage</li>
            <li>Offline-capable UI with local draft persistence</li>
          </ul>
        </div>
      </div>
      <div className="auth-page__panel">
        <div className="auth-card">
          {apiOk === false ? (
            <p className="auth-card__warn" role="alert">
              API unreachable — start the server or use offline mode below.
            </p>
          ) : null}
          {apiOk === true ? (
            <p className="auth-card__ok" role="status">
              API connected
            </p>
          ) : null}

          <div className="auth-card__tabs">
            <button
              type="button"
              className={
                mode === 'signin' ? 'auth-tab auth-tab--active' : 'auth-tab'
              }
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={
                mode === 'register' ? 'auth-tab auth-tab--active' : 'auth-tab'
              }
              onClick={() => {
                setMode('register');
                setError(null);
              }}
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {mode === 'register' ? (
              <label className="field">
                <span className="field__label">Name</span>
                <input
                  className="field__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                />
              </label>
            ) : null}
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="field__input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
              />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="field__input"
                type="password"
                required
                minLength={mode === 'register' ? 8 : 1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                placeholder="••••••••"
              />
            </label>
            {error ? (
              <p className="auth-form__error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="btn btn--primary auth-form__submit"
              disabled={busy}
            >
              {busy
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <div className="auth-card__divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="btn btn--ghost auth-card__offline"
            onClick={() => {
              continueOffline();
              navigate('/', { replace: true });
            }}
          >
            Continue offline
          </button>
          <p className="auth-card__hint">
            Demo account: <code>demo@example.com</code> / <code>demo123</code>
          </p>
        </div>
        <p className="auth-page__legal">
          By continuing you agree to use this app in accordance with your
          organization policies.
        </p>
      </div>
    </div>
  );
}
