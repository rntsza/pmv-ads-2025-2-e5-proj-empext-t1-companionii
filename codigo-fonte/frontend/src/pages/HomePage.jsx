import { useEffect, useState } from 'react';
import { AppLayout } from '../layouts';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui';

// Mock data
const mockDashboardData = {
  activeProjects: 0,
  todayTasks: { completed: 0, total: 0 },
  hoursToday: '0h',
  tasksScheduledToday: [],
  activeProjectsList: []
};

const HomePage = () => {
  const { user, initialize } = useAuthStore();
  const [dashboardData] = useState(mockDashboardData);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AppLayout pageType="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Projetos Ativos */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Projetos Ativos</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.activeProjects}</div>
            <p className="text-xs text-gray-500 mt-1">Total de projetos</p>
          </div>

          {/* Tarefas Hoje */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Tarefas Hoje</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {dashboardData.todayTasks.completed}/{dashboardData.todayTasks.total}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tarefas concluídas</p>
          </div>

          {/* Horas Hoje */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Horas Hoje</h3>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.hoursToday}</div>
            <p className="text-xs text-gray-500 mt-1">Tempo trabalhado</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarefas de Hoje */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tarefas de Hoje</h2>
                  <p className="text-sm text-gray-500">Suas tarefas programadas para hoje</p>
                </div>
                <Button variant="primary" size="small">
                  + Nova Tarefa
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-gray-900 font-medium mb-1">Nenhuma tarefa programada para hoje</h3>
                <p className="text-gray-500 text-sm mb-4">Adicione tarefas para começar a organizar seu dia</p>
                <Button variant="outline" size="small">
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
          </div>

          {/* Projetos Ativos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Projetos Ativos</h2>
                  <p className="text-sm text-gray-500">Seus projetos em andamento</p>
                </div>
                <Button variant="outline" size="small">
                  Ver Todos
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-gray-900 font-medium mb-1">Nenhum projeto criado</h3>
                <p className="text-gray-500 text-sm mb-4">Crie seu primeiro projeto para começar</p>
                <Button variant="primary" size="small">
                  Criar Projeto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
