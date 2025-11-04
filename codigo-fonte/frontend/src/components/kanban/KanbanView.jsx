import PropTypes from 'prop-types';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

const DraggableTaskCard = ({ task, isDragging, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

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
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-sm text-gray-900 flex-1">
          {task.title}
        </h4>
        {task.date && (
          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
            {task.date}
          </span>
        )}
      </div>
      {task.project && (
        <span
          className="inline-block px-3 py-1 text-white text-xs font-semibold rounded-md"
          style={{
            backgroundColor:
              task.projectColor || '#10b981' /* fallback verde */,
          }}
          title={task.project}
        >
          {task.project}
        </span>
      )}
    </div>
  );
};

DraggableTaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    project: PropTypes.string,
    projectColor: PropTypes.string,
  }).isRequired,
  isDragging: PropTypes.bool,
  onClick: PropTypes.func,
};

const EmptyColumn = () => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <p className="text-sm">Nenhuma tarefa</p>
  </div>
);

const DroppableColumn = ({ status, title, taskCount, children, bgColor }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${
        isOver ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      <div className={`flex justify-between items-center p-4 ${bgColor}`}>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className="bg-white px-2.5 py-0.5 rounded-full text-sm font-medium text-gray-700">
          {taskCount}
        </span>
      </div>
      <div className="p-4 min-h-[400px] space-y-3">{children}</div>
    </div>
  );
};

DroppableColumn.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  taskCount: PropTypes.number.isRequired,
  children: PropTypes.node,
  bgColor: PropTypes.string.isRequired,
};

const KanbanView = ({ tasks, onTaskMove, onTaskClick }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const reviewTasks = tasks.filter(task => task.status === 'review');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const handleDragStart = event => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = event => {
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Coluna A Fazer */}
        <DroppableColumn
          status="todo"
          title="A Fazer"
          taskCount={todoTasks.length}
          bgColor="bg-gray-100"
        >
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                isDragging={activeId === task.id}
                onClick={onTaskClick}
              />
            ))
          ) : (
            <EmptyColumn />
          )}
        </DroppableColumn>

        {/* Coluna Revisão */}
        <DroppableColumn
          status="review"
          title="Revisão"
          taskCount={reviewTasks.length}
          bgColor="bg-yellow-100"
        >
          {reviewTasks.length > 0 ? (
            reviewTasks.map(task => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                isDragging={activeId === task.id}
                onClick={onTaskClick}
              />
            ))
          ) : (
            <EmptyColumn />
          )}
        </DroppableColumn>

        {/* Coluna Em Progresso */}
        <DroppableColumn
          status="in-progress"
          title="Em Progresso"
          taskCount={inProgressTasks.length}
          bgColor="bg-blue-100"
        >
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(task => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                isDragging={activeId === task.id}
                onClick={onTaskClick}
              />
            ))
          ) : (
            <EmptyColumn />
          )}
        </DroppableColumn>

        {/* Coluna Concluído */}
        <DroppableColumn
          status="done"
          title="Concluído"
          taskCount={doneTasks.length}
          bgColor="bg-green-100"
        >
          {doneTasks.length > 0 ? (
            doneTasks.map(task => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                isDragging={activeId === task.id}
                onClick={onTaskClick}
              />
            ))
          ) : (
            <EmptyColumn />
          )}
        </DroppableColumn>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-2xl rotate-3">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-sm text-gray-900 flex-1">
                {activeTask.title}
              </h4>
              {activeTask.date && (
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                  {activeTask.date}
                </span>
              )}
            </div>
            {activeTask.project && (
              <span
                className="inline-block px-3 py-1 text-white text-xs font-semibold rounded-md"
                style={{
                  backgroundColor: activeTask.projectColor || '#10b981',
                }}
                title={activeTask.project}
              >
                {activeTask.project}
              </span>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

KanbanView.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string,
      project: PropTypes.string,
    }),
  ).isRequired,
  onTaskMove: PropTypes.func.isRequired,
  onTaskClick: PropTypes.func,
};

export default KanbanView;
