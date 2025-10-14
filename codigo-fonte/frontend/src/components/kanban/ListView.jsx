import PropTypes from 'prop-types';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

const getStatusConfig = (status) => {
  const configs = {
    'todo': {
      label: 'A Fazer',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-gray-500'
    },
    'in-progress': {
      label: 'Em Progresso',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      dotColor: 'bg-blue-500'
    },
    'review': {
      label: 'Revisão',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      dotColor: 'bg-yellow-500'
    },
    'done': {
      label: 'Concluído',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500'
    }
  };
  return configs[status] || configs['todo'];
};

const DraggableListTask = ({ task, statusConfig, isDragging, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const handleClick = () => {

    if (!transform && onClick) {
      onClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Lado Esquerdo - Título e Projeto */}
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-900 mb-2">
            {task.title}
          </h3>
          {task.project && (
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md">
              {task.project}
            </span>
          )}
        </div>

        {/* Lado Direito - Status e Data */}
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bgColor}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Data */}
          {task.date && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{task.date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DraggableListTask.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    project: PropTypes.string,
  }).isRequired,
  statusConfig: PropTypes.object.isRequired,
  isDragging: PropTypes.bool,
  onClick: PropTypes.func,
};

const DroppableSection = ({ status, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 transition-all ${isOver ? 'bg-blue-50 p-3 rounded-xl' : ''}`}
    >
      {children}
    </div>
  );
};

DroppableSection.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const ListView = ({ tasks, onTaskMove, onTaskClick }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.data.current?.task) {
      const taskId = active.id;
      const newStatus = over.id;
      onTaskMove(taskId, newStatus);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = tasks.find(task => task.id === activeId);
  // Agrupar tarefas por status
  const tasksByStatus = {
    'todo': tasks.filter(task => task.status === 'todo'),
    'review': tasks.filter(task => task.status === 'review'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'done': tasks.filter(task => task.status === 'done'),
  };

  const statusOrder = [
    { key: 'todo', label: 'A Fazer', color: 'text-gray-700' },
    { key: 'review', label: 'Revisão', color: 'text-yellow-700' },
    { key: 'in-progress', label: 'Em Progresso', color: 'text-blue-700' },
    { key: 'done', label: 'Concluído', color: 'text-green-700' },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-8">
        {tasks.length > 0 ? (
          statusOrder.map(({ key, label, color }) => {
            const statusTasks = tasksByStatus[key];
            if (statusTasks.length === 0) return null;

            return (
              <div key={key}>
                {/* Divisória de Status */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className={`text-lg font-bold ${color}`}>{label}</h2>
                  <span className="text-sm text-gray-500 font-medium">
                    ({statusTasks.length} {statusTasks.length === 1 ? 'tarefa' : 'tarefas'})
                  </span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Cards das Tarefas */}
                <DroppableSection status={key}>
                  {statusTasks.map(task => {
                    const statusConfig = getStatusConfig(task.status);
                    return (
                      <DraggableListTask
                        key={task.id}
                        task={task}
                        statusConfig={statusConfig}
                        isDragging={activeId === task.id}
                        onClick={onTaskClick}
                      />
                    );
                  })}
                </DroppableSection>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-16">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500">Adicione uma nova tarefa para começar</p>
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white border-2 border-blue-500 rounded-xl p-5 shadow-2xl rotate-2 max-w-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-2">
                  {activeTask.title}
                </h3>
                {activeTask.project && (
                  <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md">
                    {activeTask.project}
                  </span>
                )}
              </div>
              {activeTask.date && (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{activeTask.date}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

ListView.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string,
      project: PropTypes.string,
    })
  ).isRequired,
  onTaskMove: PropTypes.func.isRequired,
  onTaskClick: PropTypes.func,
};

export default ListView;