import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FullPageLoader } from '../components/ui';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, initialize, token } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Initialize auth state if we have a token but not authenticated yet
    if (token && !isAuthenticated) {
      initialize();
    }
  }, [token, isAuthenticated, initialize]);

  // Show loading while checking authentication
  if (isLoading || (token && !isAuthenticated)) {
    return <FullPageLoader message="Verificando sua sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
