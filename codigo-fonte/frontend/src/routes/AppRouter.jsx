import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Suspense } from 'react';
// Não precisamos mais do ProtectedRoute por enquanto
// import ProtectedRoute from '../components/ProtectedRoute'; 
import { FullPageLoader, ToastContainer } from '../components/ui';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '../pages/auth';
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
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

            {/* Rotas agora são públicas para desenvolvimento */}
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/projects" element={<ProjectsPage />} />

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