import React, { useState } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm'; // Importando o formulário que já existe

// Iniciar com array vazio para mostrar o estado vazio
const initialProjects = [];

const ProjectStatCard = ({ title, value, subtitle, icon }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            <div className="text-gray-400">{icon}</div>
        </div>
        <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
    </div>
);

const ProjectsPage = () => {
   
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

   
    const openCreateModal = () => {
        setProjectToEdit(null);
        setIsFormModalOpen(true);
    };
    const openEditModal = (project) => {
        setProjectToEdit(project);
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setProjectToEdit(null);
    };
    const handleFormSubmit = (projectData) => {
        if (projectToEdit) {
            console.log('Atualizando projeto:', { id: projectToEdit.id, ...projectData });
        } else {
            console.log('Criando novo projeto:', projectData);
        }
        closeFormModal();
    };

    // Funções para o modal de Deletar
    const openDeleteModal = (project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
    };
    const handleConfirmDelete = () => {
        console.log('Deletando projeto:', projectToDelete.name);
        closeDeleteModal();
    };

    const folderIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>;
    const usersIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
    const clipboardIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
    const clockIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    const chartIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;

    return (
        <AppLayout pageType="projects">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

        

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    <ProjectStatCard icon={folderIcon} title="Total de Projetos" value="0" subtitle="0 ativos" />
                    <ProjectStatCard icon={usersIcon} title="Clientes" value="0" subtitle="Clientes únicos" />
                    <ProjectStatCard icon={clipboardIcon} title="Tarefas" value="0/0" subtitle="" />
                    <ProjectStatCard icon={clockIcon} title="Horas Trabalhadas" value="0.0h" subtitle="Total registrado" />
                    <ProjectStatCard icon={chartIcon} title="Progresso Médio" value="0%" subtitle="Conclusão geral" />
                </div>

                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-xs">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar projetos..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Todos os clientes</span>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white text-sm font-medium text-gray-700 pr-10">
                            <option>Mais recentes</option>
                            <option>Mais antigos</option>
                            <option>A-Z</option>
                            <option>Z-A</option>
                        </select>
                    </div>
                    <Button variant="primary" onClick={openCreateModal} className="whitespace-nowrap">
                        + Novo Projeto
                    </Button>
                </div>

                {initialProjects.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-16">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 mb-6 text-gray-400">
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum projeto criado</h3>
                            <p className="text-gray-500 mb-6 max-w-md">
                                Comece criando seu primeiro projeto para organizar suas tarefas
                            </p>
                            <Button variant="primary" onClick={openCreateModal}>
                                + Criar Primeiro Projeto
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Projeto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {initialProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{project.name}</div>
                                                <div className="text-sm text-gray-500">{project.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{project.client}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    project.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'Em Progresso' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(project)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(project)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Deletar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODAL PARA CRIAR/EDITAR */}
                <Modal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    title={projectToEdit ? 'Editar Projeto' : 'Novo Projeto'}
                >
                    <ProjectForm
                        onCancel={closeFormModal}
                        onSubmit={handleFormSubmit}
                        initialData={projectToEdit}
                    />
                </Modal>

                {/* MODAL PARA DELETAR */}
                <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Exclusão">
                    <p>Você tem certeza que deseja excluir o projeto <strong className="font-bold">{projectToDelete?.name}</strong>? Esta ação não pode ser desfeita.</p>
                    <div className="modal-action">
                        <Button variant="ghost" onClick={closeDeleteModal}>Cancelar</Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>Sim, excluir projeto</Button>
                    </div>
                </Modal>

            </div>
        </AppLayout>
    );
};

export default ProjectsPage;
