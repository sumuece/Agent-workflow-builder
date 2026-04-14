import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { WorkflowEditorPage } from './pages/WorkflowEditorPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpHomePage } from './pages/HelpHomePage';
import { HelpArticlePage } from './pages/HelpArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkflowEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help/:topicId"
            element={
              <ProtectedRoute>
                <HelpArticlePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
