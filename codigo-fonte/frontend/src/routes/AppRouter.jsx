import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Suspense } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { FullPageLoader, ToastContainer } from '../components/ui';
import { LoginPage, RegisterPage, ForgotPasswordPage, ChangePasswordPage } from '../pages/auth';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import HomePage from '../pages/HomePage';
import ReportsPage from '../pages/ReportsPage';
import KanbanPage from '../pages/KanbanPage';
import ProjectsPage from '../pages/ProjectsPage';
import { useToast } from '../hooks/useToast';

const AppRouter = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<FullPageLoader message="Loading..." />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

            {/* Rotas protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/kanban" element={<ProtectedRoute><KanbanPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />

            {/* Redirecionamento principal */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
};

export default AppRouter;