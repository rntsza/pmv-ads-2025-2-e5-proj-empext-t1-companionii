import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm';
import TaskForm from '../components/tasks/TaskForm';
import { dashboardsService } from '../services/dashboardService';
import { projectsService } from '../services/projectsService';
import { tasksService } from '../services/tasksService';
import { useToast } from '../hooks/useToast';

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const handleCreateProject = async formData => {
    try {
      await projectsService.create({
        name: formData.name,
        client: formData.client, // mapeado para clientName no backend
        description: formData.description,
        color: formData.color,
      });
      toast.success('Projeto criado com sucesso!');
      setIsModalOpen(false);
      await load(); // recarrega cards e listas
    } catch (err) {
      console.log('Project creation error:', err);
      toast.error(err.message || 'Não foi possível criar o projeto.');
    }
  };

  const handleCreateTask = async taskData => {
    try {
      await tasksService.create({
        title: taskData.title,
        description: taskData.description,
        projectId: taskData.projectId, // <- vem do form
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours,
        isRecurring: taskData.isRecurring,
        tags: taskData.tags,
      });
      toast.success('Tarefa criada com sucesso!');
      setIsTaskModalOpen(false);
      await load(); // recarrega os cards/listas do dashboard
    } catch (err) {
      console.log('Task creation error:', err);
      toast.error('Não foi possível criar a tarefa.');
    }
  };

  const params = useMemo(
    () => ({
      /* projectId, date: '2025-10-19' */
    }),
    [],
  );

  const load = async () => {
    setLoading(true);
    try {
      const resp = await dashboardsService.home(params);
      setData(resp || null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Falha ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = data?.cards;
  const listas = data?.listas;

  return (
    <AppLayout pageType="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">
              Projetos Ativos
            </h3>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? '—' : (cards.projetosAtivos ?? 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total de projetos</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Tarefas Hoje</h3>
            <div className="text-3xl font-bold text-gray-900">
              {loading
                ? '—/—'
                : `${cards.tarefasHoje.done ?? 0}/${cards.tarefasHoje.total ?? 0}`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tarefas concluídas</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Horas Hoje</h3>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? '—h' : `${cards.horasHoje.hours ?? 0}h`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tempo trabalhado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Tarefas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tarefas de Hoje
                </h2>
                <p className="text-sm text-gray-500">
                  Suas tarefas programadas para hoje
                </p>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => navigate('/kanban')}
              >
                Ver Todos
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando…</div>
            ) : !listas.tarefasDeHoje.length ? (
              <div className="text-center py-12">
                <h3 className="text-gray-900 font-medium mb-1">
                  Nenhuma tarefa programada para hoje
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Adicione tarefas para começar a organizar seu dia
                </p>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  Adicionar Tarefa
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 mt-4">
                {listas.tarefasDeHoje.map(t => (
                  <li
                    key={t.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{t.title}</p>
                      <p className="text-xs text-gray-500">
                        {t.project.name
                          ? `Projeto: ${t.project.name}`
                          : 'Sem projeto'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Est.: {t.estimatedMin ?? 0}m · Real: {t.actualMin ?? 0}m
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card de Projetos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Projetos Ativos
                </h2>
                <p className="text-sm text-gray-500">
                  Seus projetos em andamento
                </p>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => navigate('/projects')}
              >
                Ver Todos
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando…</div>
            ) : !listas.projetosAtivos.length ? (
              <div className="text-center py-12">
                <h3 className="text-gray-900 font-medium mb-1">
                  Nenhum projeto criado
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Crie seu primeiro projeto para começar
                </p>
                {/* Este botão agora abre o modal */}
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setIsModalOpen(true)}
                >
                  Criar Projeto
                </Button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {listas.projetosAtivos.map(p => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-gray-200 p-3 hover:shadow-sm cursor-pointer"
                    onClick={() => navigate('/projects')}
                    title={p.name}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: p.colorHex || '#9ca3af' }}
                      />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {p.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
      >
        <ProjectForm
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      </Modal>
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Nova Tarefa"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </AppLayout>
  );
};

export default HomePage;
