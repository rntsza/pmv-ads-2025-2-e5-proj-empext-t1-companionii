import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import KanbanView from '../components/kanban/KanbanView';
import ListView from '../components/kanban/ListView';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import { useToast } from '../hooks/useToast';
import { tasksService } from '../services/tasksService';
import { projectsService } from '../services/projectsService';

const StatCardSmall = ({ title, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
    <div className="text-xs text-gray-500 font-medium mb-2">{title}</div>
    <div className="text-3xl font-bold" style={{ color }}>
      {value}
    </div>
  </div>
);

const BoardSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      Carregando tarefas...
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(c => (
        <div
          key={c}
          className="rounded-2xl bg-gray-50 p-3 border border-gray-200"
        >
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KanbanPage = () => {
  const [view, setView] = useState('kanban');
  const [tasks, setTasks] = useState([]);
  const { toast } = useToast();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    project: 'all',
    status: 'all',
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapApiStatusToUi = apiStatus => {
    switch (apiStatus) {
      case 'TODO':
        return 'todo';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'REVIEW':
        return 'review';
      case 'DONE':
        return 'done';
      default:
        return 'todo';
    }
  };

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const apiTasks = await tasksService.list({
        projectId: filters.project,
        status: filters.status,
        q: filters.searchTerm || undefined,
      });
      const mapped = (apiTasks || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: mapApiStatusToUi(t.status),
        date: t.createdAt
          ? new Date(t.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })
          : t.dueDate
            ? new Date(t.dueDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })
            : null,
        projectId: t.projectId,
        project: t.project?.name || t.project?.company?.name || '',
        projectColor: t.project?.company?.colorHex || null,
        priority: t.priority,
        tags: (t.tags || []).map(x => x.tag?.name || x.name).filter(Boolean),
      }));
      setTasks(mapped);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Falha ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, [filters.project, filters.status, filters.searchTerm]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async taskData => {
    try {
      await tasksService.create({
        title: taskData.title,
        description: taskData.description,
        projectId: taskData.projectId,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
      });
      await loadTasks();
      toast.success('Tarefa criada com sucesso!');
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error('Task creation error:', err);
      toast.error(err?.message || 'Não foi possível criar a tarefa.');
    }
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleTaskClick = async task => {
    try {
      const full = await tasksService.get(task.id);
      const enriched = {
        ...task,
        description: full?.description ?? task.description,
        project:
          full?.project?.name || full?.project?.company?.name || task.project,
        projectColor: full?.project?.company?.colorHex || task.projectColor,
        priority: full?.priority || task.priority,
        dueDateRaw: full?.dueDate,
        tags: (full?.tags || [])
          .map(x => x.tag?.name || x.name)
          .filter(Boolean),
        createdAtRaw: full?.createdAt,
        completedAtRaw: full?.completedAt,
        estimatedMin: full?.estimatedMin,
        actualMin: full?.actualMin,
      };
      setSelectedTask(enriched);
    } catch (err) {
      console.error(err);
      setSelectedTask(task);
    }
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  const handleDeleteTask = async id => {
    try {
      await tasksService.remove(id);
      await loadTasks();
      toast.success('Tarefa excluída!');
      setTaskToEdit(null);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível excluir a tarefa.');
    }
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setTaskToEdit(selectedTask);
      setIsEditModalOpen(true);
      setSelectedTask(null);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await tasksService.update(id, {
        title: updates.title,
        description: updates.description,
        projectId: updates.projectId,
        status: updates.status,
        priority: updates.priority,
        dueDate: updates.dueDate,
        estimatedHours: updates.estimatedHours,
        tags: updates.tags,
      });
      await loadTasks();
      toast.success('Tarefa atualizada!');
      setTaskToEdit(null);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível atualizar a tarefa.');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleTaskMove = useCallback(
    async (taskId, to) => {
      if (!taskId || !to) return;
      setTasks(prev => {
        const clone = [...prev];
        const idx = clone.findIndex(t => t.id === taskId);
        if (idx >= 0) clone[idx] = { ...clone[idx], status: to };
        return clone;
      });
      try {
        await tasksService.updateStatus(taskId, to);
        await loadTasks();
      } catch (err) {
        console.log(err);
        toast.error('Falha ao mover tarefa. Voltando ao estado anterior.');
        await loadTasks();
      }
    },
    [loadTasks],
  );

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(
    task => task.status === 'in-progress',
  );
  const reviewTasks = filteredTasks.filter(task => task.status === 'review');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  useEffect(() => {
    let filteredList = tasks;
    if (filters.project !== 'all') {
      filteredList = filteredList.filter(
        task => String(task.projectId) === String(filters.project),
      );
    }
    if (filters.searchTerm) {
      filteredList = filteredList.filter(task =>
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }
    setFilteredTasks(filteredList);
  }, [filters, tasks]);

  useEffect(() => {
    (async () => {
      try {
        const data = await projectsService.listAllSelect();
        setProjects(data || []);
      } catch (err) {
        console.error('Error gettings projects', err);
      }
    })();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <AppLayout pageType="kanban">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                name="searchTerm"
                placeholder="Buscar tarefas..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <select
                name="project"
                value={filters.project}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    project: e.target.value || 'all',
                  }))
                }
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">Todos os projetos</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="cursor-pointer">
                    {p.name}
                    {p.companyName ? ` — ${p.companyName}` : ''}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle de visualização */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded transition-colors ${
                  view === 'kanban' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Visualização em colunas"
              >
                <svg
                  className={`w-5 h-5 ${view === 'kanban' ? 'text-black' : 'text-gray-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded transition-colors ${
                  view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Visualização em lista"
              >
                <svg
                  className={`w-5 h-5 ${view === 'list' ? 'text-black' : 'text-gray-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <Button variant="primary" onClick={() => setIsTaskModalOpen(true)}>
              + Nova Tarefa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCardSmall
            title="Total"
            value={filteredTasks.length}
            color="#000000"
          />
          <StatCardSmall
            title="A Fazer"
            value={todoTasks.length}
            color="#3b82f6"
          />
          <StatCardSmall
            title="Em Progresso"
            value={inProgressTasks.length}
            color="#3b82f6"
          />
          <StatCardSmall
            title="Revisão"
            value={reviewTasks.length}
            color="#f59e0b"
          />
          <StatCardSmall
            title="Concluído"
            value={doneTasks.length}
            color="#10b981"
          />
        </div>

        {loading ? (
          <BoardSkeleton />
        ) : view === 'kanban' ? (
          <KanbanView
            tasks={filteredTasks}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onTaskMove={handleTaskMove}
            onTaskClick={handleTaskClick}
          />
        )}

        {/* Modal de Nova Tarefa */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          title="Nova Tarefa"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={handleCloseTaskModal}
          />
        </Modal>

        {/* Modal de Editar Tarefa */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Editar Tarefa"
        >
          <TaskForm
            initialData={taskToEdit}
            onSubmit={handleUpdateTask}
            onCancel={handleCloseEditModal}
          />
        </Modal>

        {/* Modal de Detalhes da Tarefa */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={handleCloseTaskDetail}
            onDelete={taskId => handleDeleteTask(taskId)}
            onEdit={handleEditTask}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default KanbanPage;
