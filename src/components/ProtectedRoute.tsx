import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandRobotIcon } from './BrandRobotIcon';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, user, isOfflineGuest } = useAuth();

  if (!ready) {
    return (
      <div className="splash">
        <div className="splash__inner">
          <span className="splash__logo" aria-hidden>
            <BrandRobotIcon className="brand-robot-icon" />
          </span>
          <p className="splash__text">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!user && !isOfflineGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
