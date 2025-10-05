import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * PageHeader - Componente de cabeçalho dinâmico para páginas da aplicação
 *
 * @param {Object} props
 * @param {string} props.type - Tipo de página: 'dashboard' | 'kanban' | 'projects' | 'reports'
 * @param {Object} props.user - Dados do usuário logado (opcional)
 * @param {Function} props.onNavigate - Callback para navegação (opcional)
 */
const PageHeader = forwardRef(({ type = 'dashboard', user, onNavigate, className = '' }, ref) => {
  // Configurações para cada tipo de página
  const headerConfigs = {
    dashboard: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Dashboard',
      subtitle: getCurrentDateFormatted(),
      navigation: [
        { id: 'projects', label: 'Projetos', icon: 'briefcase' },
        { id: 'kanban', label: 'Kanban', icon: 'grid' },
        { id: 'reports', label: 'Relatórios', icon: 'chart' },
      ],
    },
    kanban: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      title: 'Kanban Board',
      subtitle: getCurrentDateFormatted(),
      navigation: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'projects', label: 'Projetos', icon: 'briefcase' },
        { id: 'reports', label: 'Relatórios', icon: 'chart' },
      ],
    },
    projects: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Gestão de Projetos',
      subtitle: getCurrentDateFormatted(),
      navigation: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'kanban', label: 'Kanban', icon: 'grid' },
        { id: 'reports', label: 'Relatórios', icon: 'chart' },
      ],
    },
    reports: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Relatórios IA',
      subtitle: getCurrentDateFormatted(),
      navigation: [
        { id: 'projects', label: 'Projetos', icon: 'briefcase' },
        { id: 'kanban', label: 'Kanban', icon: 'grid' },
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      ],
    },
  };

  const config = headerConfigs[type] || headerConfigs.dashboard;

  const handleNavigation = (navId) => {
    if (onNavigate) {
      onNavigate(navId);
    }
  };

  return (
    <header
      ref={ref}
      className={`bg-white border-b border-gray-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Lado esquerdo - Icon + Title + Subtitle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl">
              {config.icon}
            </div>
            <div>
              <h1 className="text-heading-4 text-black">{config.title}</h1>
              <p className="text-body-small text-secondary">{config.subtitle}</p>
            </div>
          </div>

          {/* Lado direito - Navigation + User */}
          <div className="flex items-center gap-6">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {config.navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-body-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  aria-label={`Navegar para ${item.label}`}
                >
                  <NavigationIcon type={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User Avatar */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                <button
                  className="text-gray-700 hover:text-black transition-colors"
                  aria-label="Menu do usuário"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

PageHeader.displayName = 'PageHeader';

PageHeader.propTypes = {
  type: PropTypes.oneOf(['dashboard', 'kanban', 'projects', 'reports']),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
  onNavigate: PropTypes.func,
  className: PropTypes.string,
};

// Helper Components e Funções
const NavigationIcon = ({ type }) => {
  const icons = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    grid: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    briefcase: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  };

  return icons[type] || icons.dashboard;
};

function getCurrentDateFormatted() {
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  const now = new Date();
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];

  return `${dayName}, ${day} de ${month}`;
}

function getInitials(name) {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default PageHeader;
