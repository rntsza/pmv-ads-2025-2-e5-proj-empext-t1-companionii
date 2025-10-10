import { useState } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import TaskForm from '../components/tasks/TaskForm';

const KanbanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (formData) => {
    // Mock: Simulando envio para API
    console.log('📋 Dados da Tarefa a serem enviados para API:', {
      title: formData.title,
      description: formData.description,
      project: formData.project,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
      actualHours: formData.actualHours ? parseFloat(formData.actualHours) : null,
      isRecurring: formData.isRecurring,
      tags: formData.tags,
      createdAt: new Date().toISOString(),
    });

    // Fecha o modal após submissão
    setIsModalOpen(false);

    // Aqui seria feito o POST para a API:
    // await api.post('/tasks', formData);
  };

  return (
    <AppLayout pageType="kanban">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conteúdo do Kanban */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Kanban Board</h2>
          <p className="mt-2 text-gray-600 mb-6">Conteúdo em desenvolvimento...</p>

          {/* Botão de Teste */}
          <Button variant="primary" size="medium" onClick={() => setIsModalOpen(true)}>
            + Nova Tarefa (Teste)
          </Button>
        </div>
      </div>

      {/* Modal de Nova Tarefa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Tarefa"
        size="large"
      >
        <p className="text-gray-600 mb-6">Crie uma nova tarefa para seu projeto</p>
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </AppLayout>
  );
};

export default KanbanPage;
