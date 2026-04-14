import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OfflineBanner } from './OfflineBanner';
import { useAuth } from '../context/AuthContext';

type SubpageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function SubpageLayout({ title, children }: SubpageLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="subpage-shell">
      <OfflineBanner />
      <header className="subpage-topbar">
        <div className="subpage-topbar__left">
          <Link to="/" className="subpage-back">
            ← Workflow
          </Link>
          <h1 className="subpage-title">{title}</h1>
        </div>
        <nav className="subpage-nav" aria-label="App sections">
          <Link to="/" className="subpage-nav__link">
            Editor
          </Link>
          <Link to="/settings" className="subpage-nav__link">
            Settings
          </Link>
          <Link to="/help" className="subpage-nav__link">
            Help
          </Link>
        </nav>
        <div className="subpage-topbar__right">
          {user ? (
            <span className="subpage-user">{user.name}</span>
          ) : null}
          <button
            type="button"
            className="btn btn--ghost subpage-signout"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="subpage-main">{children}</main>
    </div>
  );
}
