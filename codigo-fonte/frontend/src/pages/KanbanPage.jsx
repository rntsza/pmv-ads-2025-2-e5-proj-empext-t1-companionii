import { useState, useEffect } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import KanbanView from '../components/kanban/KanbanView';
import ListView from '../components/kanban/ListView';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetailModal from '../components/tasks/TaskDetailModal';

const mockTasks = [
  { id: 1, title: 'Configurar CI/CD', status: 'todo', date: '18 Jan', project: 'PUC' },
];

const StatCardSmall = ({ title, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
    <div className="text-xs text-gray-500 font-medium mb-2">{title}</div>
    <div className="text-3xl font-bold" style={{ color }}>{value}</div>
  </div>
);

const KanbanPage = () => {
  const [view, setView] = useState('kanban');
  const [tasks, setTasks] = useState(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [filters, setFilters] = useState({ searchTerm: '', project: 'all', status: 'all' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    let filteredList = tasks;
    if (filters.status !== 'all') {
      filteredList = filteredList.filter(task => task.status === filters.status);
    }
    if (filters.searchTerm) {
      filteredList = filteredList.filter(task => task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    }
    setFilteredTasks(filteredList);
  }, [filters, tasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskMove = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      date: taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setIsTaskModalOpen(false);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
    }
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setTaskToEdit(selectedTask);
      setIsEditModalOpen(true);
      setSelectedTask(null);
    }
  };

  const handleUpdateTask = (taskData) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskToEdit.id
          ? {
              ...task,
              ...taskData,
              date: taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : task.date,
            }
          : task
      )
    );
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const reviewTasks = filteredTasks.filter(task => task.status === 'review');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <AppLayout pageType="kanban">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Todos os projetos</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
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
                <svg className={`w-5 h-5 ${view === 'kanban' ? 'text-black' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded transition-colors ${
                  view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Visualização em lista"
              >
                <svg className={`w-5 h-5 ${view === 'list' ? 'text-black' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <Button variant="primary" onClick={() => setIsTaskModalOpen(true)}>+ Nova Tarefa</Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCardSmall title="Total" value={filteredTasks.length} color="#000000" />
            <StatCardSmall title="A Fazer" value={todoTasks.length} color="#3b82f6" />
            <StatCardSmall title="Em Progresso" value={inProgressTasks.length} color="#3b82f6" />
            <StatCardSmall title="Revisão" value={reviewTasks.length} color="#f59e0b" />
            <StatCardSmall title="Concluído" value={doneTasks.length} color="#10b981" />
        </div>

        {view === 'kanban' ? (
          <KanbanView tasks={filteredTasks} onTaskMove={handleTaskMove} onTaskClick={handleTaskClick} />
        ) : (
          <ListView tasks={filteredTasks} onTaskMove={handleTaskMove} onTaskClick={handleTaskClick} />
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
            onSubmit={handleUpdateTask}
            onCancel={handleCloseEditModal}
            initialData={taskToEdit}
          />
        </Modal>

        {/* Modal de Detalhes da Tarefa */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={handleCloseTaskDetail}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}

      </div>
    </AppLayout>
  );
};

export default KanbanPage;