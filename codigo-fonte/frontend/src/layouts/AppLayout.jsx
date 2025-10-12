import { Header } from '../components/ui';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const AppLayout = ({ children, pageType = 'dashboard' }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleNavigation = (pageId) => {
    const routes = {
      dashboard: '/dashboard',
      reports: '/reports',
      kanban: '/kanban',
      projects: '/projects'
    };

    if (routes[pageId]) {
      navigate(routes[pageId]);
    }
  };

  return (
    // A CORREÇÃO ESTÁ AQUI: trocamos bg-gray-50 por bg-white
    <div className="min-h-screen bg-white"> 
      <Header type={pageType} user={user} onNavigate={handleNavigation} />

      <main className="flex-1">
        <div className="py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
