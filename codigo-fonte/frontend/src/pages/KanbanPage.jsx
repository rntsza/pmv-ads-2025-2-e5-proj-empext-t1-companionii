import React, { useState, useEffect } from 'react';
import { AppLayout } from '../layouts';
import { Button } from '../components/ui';
import KanbanView from '../components/kanban/KanbanView'; 
import ListView from '../components/kanban/ListView';

const mockTasks = [
  { id: 1, title: 'Configurar ambiente de desenvolvimento', status: 'todo' },
  { id: 2, title: 'Criar tela de login e registro', status: 'todo' },
  { id: 3, title: 'Desenvolver componente de Modal', status: 'in-progress' },
  { id: 4, title: 'Testar endpoint de autenticação', status: 'review' },
  { id: 5, title: 'Implementar funcionalidade de filtros', status: 'in-progress' },
];

const StatCardSmall = ({ title, value, color }) => (
    <div className="card bg-white shadow-sm text-center p-2 border border-gray-200 rounded-xl"><div className="card-body py-4 px-1"><div className="text-xs text-gray-500 font-medium">{title}</div><div className="text-2xl font-bold" style={{ color }}>{value}</div></div></div>
);

const KanbanPage = () => {
  const [view, setView] = useState('kanban');
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [filters, setFilters] = useState({ searchTerm: '', project: 'all', status: 'all' });

  useEffect(() => {
    let tasks = mockTasks;
    if (filters.status !== 'all') { tasks = tasks.filter(task => task.status === filters.status); }
    if (filters.searchTerm) { tasks = tasks.filter(task => task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())); }
    setFilteredTasks(tasks);
  }, [filters]);

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const clearFilters = () => { setFilters({ searchTerm: '', project: 'all', status: 'all' }); };
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const reviewTasks = filteredTasks.filter(task => task.status === 'review');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <AppLayout pageType="kanban">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Quadro Kanban</h1>
              <p className="text-sm text-gray-500">Organize suas tarefas visualmente</p>
            </div>
            {/* CORREÇÃO AQUI: Trocamos 'join' por 'flex' e 'gap' */}
            <div className="flex items-center gap-2">
              <Button variant={view === 'kanban' ? 'primary' : 'ghost'} onClick={() => setView('kanban')}>Kanban</Button>
              <Button variant={view === 'list' ? 'primary' : 'ghost'} onClick={() => setView('list')}>Lista</Button>
              <Button variant="ghost" disabled>Calendário</Button>
            </div>
        </div>

        <div className="bg-white p-3 rounded-xl flex justify-between items-center mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <input type="text" name="searchTerm" placeholder="Buscar tarefas..." className="input input-bordered bg-gray-100 w-64" value={filters.searchTerm} onChange={handleFilterChange} />
            <select name="project" className="select select-bordered bg-gray-100 w-full max-w-xs" value={filters.project} onChange={handleFilterChange}><option value="all">Todos os projetos</option></select>
            <select name="status" className="select select-bordered bg-gray-100 w-full max-w-xs" value={filters.status} onChange={handleFilterChange}><option value="all">Todos os status</option><option value="todo">A Fazer</option><option value="in-progress">Em Progresso</option><option value="review">Revisão</option><option value="done">Concluído</option></select>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={clearFilters}>Limpar filtros</Button>
            <Button variant="primary">+ Nova Tarefa</Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCardSmall title="Total" value={filteredTasks.length} color="#000000" />
            <StatCardSmall title="A Fazer" value={todoTasks.length} color="#3b82f6" />
            <StatCardSmall title="Em Progresso" value={inProgressTasks.length} color="#3b82f6" />
            <StatCardSmall title="Revisão" value={reviewTasks.length} color="#f59e0b" />
            <StatCardSmall title="Concluído" value={doneTasks.length} color="#10b981" />
        </div>

        {view === 'kanban' ? <KanbanView tasks={filteredTasks} /> : <ListView tasks={filteredTasks} />}

      </div>
    </AppLayout>
  );
};

export default KanbanPage;