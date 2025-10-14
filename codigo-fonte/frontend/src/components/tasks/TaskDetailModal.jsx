import PropTypes from 'prop-types';

const TaskDetailModal = ({ task, onClose, onEdit, onDelete }) => {
  if (!task) return null;

  const getStatusConfig = (status) => {
    const configs = {
      'todo': {
        label: 'A Fazer',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
      },
      'in-progress': {
        label: 'Em Progresso',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      'review': {
        label: 'Revisão',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      'done': {
        label: 'Concluído',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      }
    };
    return configs[status] || configs['todo'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'low': { label: 'Baixa', color: 'text-gray-600', icon: '↓' },
      'medium': { label: 'Média', color: 'text-yellow-600', icon: '=' },
      'high': { label: 'Alta', color: 'text-red-600', icon: '↑' },
    };
    return configs[priority] || configs['medium'];
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
     
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Tarefa #{task.id}</div>
              <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Editar"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fechar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

   
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-3 gap-6">
       
            <div className="col-span-2 space-y-6">
        
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
                {task.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                ) : (
                  <p className="text-gray-400 italic">Nenhuma descrição adicionada</p>
                )}
              </div>

        
              {task.tags && task.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Atividade</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                  Nenhuma atividade ainda
                </div>
              </div>
            </div>

          
            <div className="space-y-4">
          
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.textColor} font-medium text-sm`}>
                  {statusConfig.label}
                </div>
              </div>

         
              {task.project && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Projeto</label>
                  <div className="inline-block px-3 py-2 bg-green-500 text-white text-sm font-semibold rounded-md">
                    {task.project}
                  </div>
                </div>
              )}

       
              {task.priority && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Prioridade</label>
                  <div className={`flex items-center gap-2 ${priorityConfig.color} font-medium`}>
                    <span className="text-xl">{priorityConfig.icon}</span>
                    <span>{priorityConfig.label}</span>
                  </div>
                </div>
              )}

         
              {task.dueDate && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Vencimento</label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              )}

   
              {task.estimatedHours && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Horas Estimadas</label>
                  <div className="text-gray-700 font-medium">{task.estimatedHours}h</div>
                </div>
              )}

       
              {task.actualHours && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Horas Reais</label>
                  <div className="text-gray-700 font-medium">{task.actualHours}h</div>
                </div>
              )}

       
              {task.isRecurring && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Recorrência</label>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm">Tarefa recorrente</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">Data de Criação</label>
                <div className="text-sm text-gray-500">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskDetailModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    project: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    estimatedHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    actualHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isRecurring: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default TaskDetailModal;
