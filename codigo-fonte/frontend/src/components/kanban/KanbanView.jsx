import React from 'react';

const TaskCard = ({ title }) => ( <div className="card bg-white shadow-sm p-3 border border-gray-200"><p className="font-medium text-sm text-gray-800 text-left">{title}</p></div>);

const KanbanColumn = ({ title, taskCount, children, headerBgClass }) => (
    <div className="card bg-white shadow-sm border border-gray-200 rounded-xl"><div className="card-body p-0"><div className={`flex justify-between items-center p-3 rounded-t-xl ${headerBgClass}`}><h3 className="font-semibold text-gray-700">{title}</h3><span className="badge bg-white text-gray-700 border-none">{taskCount}</span></div><div className="p-4 min-h-[300px] space-y-3">{children}</div></div></div>
);

const KanbanView = ({ tasks }) => {
    const todoTasks = tasks.filter(task => task.status === 'todo');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const reviewTasks = tasks.filter(task => task.status === 'review');
    const doneTasks = tasks.filter(task => task.status === 'done');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KanbanColumn title="A Fazer" taskCount={todoTasks.length} headerBgClass="bg-gray-200">{todoTasks.length > 0 ? todoTasks.map(task => <TaskCard key={task.id} title={task.title} />) : 'Nenhuma tarefa'}</KanbanColumn>
            <KanbanColumn title="Em Progresso" taskCount={inProgressTasks.length} headerBgClass="bg-blue-200">{inProgressTasks.length > 0 ? inProgressTasks.map(task => <TaskCard key={task.id} title={task.title} />) : 'Nenhuma tarefa'}</KanbanColumn>
            <KanbanColumn title="Revisão" taskCount={reviewTasks.length} headerBgClass="bg-yellow-200">{reviewTasks.length > 0 ? reviewTasks.map(task => <TaskCard key={task.id} title={task.title} />) : 'Nenhuma tarefa'}</KanbanColumn>
            <KanbanColumn title="Concluído" taskCount={doneTasks.length} headerBgClass="bg-green-200">{doneTasks.length > 0 ? doneTasks.map(task => <TaskCard key={task.id} title={task.title} />) : 'Nenhuma tarefa'}</KanbanColumn>
        </div>
    );
};

export default KanbanView;