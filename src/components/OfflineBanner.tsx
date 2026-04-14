import { useAuth } from '../context/AuthContext';

export function OfflineBanner() {
  const { online, isOfflineGuest, token } = useAuth();

  if (isOfflineGuest) {
    return (
      <div className="banner banner--guest" role="status">
        <span className="banner__dot" aria-hidden />
        Local-only mode — sign in to sync workflows to the server.
      </div>
    );
  }

  if (!online && token) {
    return (
      <div className="banner banner--offline" role="status">
        <span className="banner__dot banner__dot--warn" aria-hidden />
        You are offline. Changes are saved on this device and will sync when
        you reconnect.
      </div>
    );
  }

  if (!online) {
    return (
      <div className="banner banner--offline" role="status">
        <span className="banner__dot banner__dot--warn" aria-hidden />
        No network connection.
      </div>
    );
  }

  return null;
}
