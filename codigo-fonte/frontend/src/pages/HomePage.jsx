import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importando os componentes que já existem no projeto
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm'; // O formulário que você encontrou!

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (projectData) => {
    console.log('Dados do novo projeto:', projectData);
    // Futuramente, aqui irá a lógica para enviar os dados para a API
    setIsModalOpen(false); // Fecha o modal após o envio
  };

  return (
    // 1. Usando o AppLayout para ter o menu lateral e o cabeçalho
    <AppLayout pageType="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Projetos Ativos</h3>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Total de projetos</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Tarefas Hoje</h3>
            <div className="text-3xl font-bold text-gray-900">0/0</div>
            <p className="text-xs text-gray-500 mt-1">Tarefas concluídas</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600">Horas Hoje</h3>
            <div className="text-3xl font-bold text-gray-900">0h</div>
            <p className="text-xs text-gray-500 mt-1">Tempo trabalhado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Tarefas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tarefas de Hoje</h2>
                <p className="text-sm text-gray-500">Suas tarefas programadas para hoje</p>
              </div>
              <Button variant="primary" size="small">
                + Nova Tarefa
              </Button>
            </div>
            <div className="text-center py-12">
              <h3 className="text-gray-900 font-medium mb-1">Nenhuma tarefa programada para hoje</h3>
              <p className="text-gray-500 text-sm mb-4">Adicione tarefas para começar a organizar seu dia</p>
              <Button variant="outline" size="small">
                Adicionar Tarefa
              </Button>
            </div>
          </div>

          {/* Card de Projetos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Projetos Ativos</h2>
                <p className="text-sm text-gray-500">Seus projetos em andamento</p>
              </div>
              <Button variant="outline" size="small" onClick={() => navigate('/projects')}>
                Ver Todos
              </Button>
            </div>
            <div className="text-center py-12">
              <h3 className="text-gray-900 font-medium mb-1">Nenhum projeto criado</h3>
              <p className="text-gray-500 text-sm mb-4">Crie seu primeiro projeto para começar</p>
              {/* Este botão agora abre o modal */}
              <Button variant="primary" size="small" onClick={() => setIsModalOpen(true)}>
                Criar Projeto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. O Modal só aparece se isModalOpen for true */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Novo Projeto"
      >
        {/* 3. Colocamos o formulário que você encontrou dentro do Modal */}
        <ProjectForm 
          onCancel={() => setIsModalOpen(false)} 
          onSubmit={handleCreateProject} 
        />
      </Modal>
    </AppLayout>
  );
};

export default HomePage;
