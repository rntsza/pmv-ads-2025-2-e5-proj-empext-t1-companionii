import { useState } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm';

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (formData) => {
    // Mock: Simulando envio para API
    console.log('📦 Dados do Projeto a serem enviados para API:', {
      name: formData.name,
      client: formData.client,
      description: formData.description,
      color: formData.color,
      createdAt: new Date().toISOString(),
    });

    // Fecha o modal após submissão
    setIsModalOpen(false);

    // Aqui seria feito o POST para a API:
    // await api.post('/projects', formData);
  };

  return (
    <AppLayout pageType="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conteúdo de Projetos */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Gestão de Projetos</h2>
          <p className="mt-2 text-gray-600 mb-6">Conteúdo em desenvolvimento...</p>

          {/* Botão de Teste */}
          <Button variant="primary" size="medium" onClick={() => setIsModalOpen(true)}>
            + Novo Projeto (Teste)
          </Button>
        </div>
      </div>

      {/* Modal de Novo Projeto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
        size="medium"
      >
        <p className="text-gray-600 mb-6">Crie um novo projeto para organizar suas tarefas</p>
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </AppLayout>
  );
};

export default ProjectsPage;
