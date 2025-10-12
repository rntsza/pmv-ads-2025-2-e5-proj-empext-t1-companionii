import React, { useState } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm'; // Importando o formulário que já existe

const initialProjects = [
  { id: 1, name: 'Desenvolvimento do App Mobile', client: 'Empresa X', status: 'Em Progresso', description: 'App para iOS e Android.' },
  { id: 2, name: 'Novo Website Institucional', client: 'Empresa Y', status: 'Concluído', description: 'Site com foco em SEO.' },
  { id: 3, name: 'Campanha de Marketing Digital', client: 'Empresa Z', status: 'A Fazer', description: 'Campanha para o 4º trimestre.' },
];

const ProjectStatCard = ({ title, value, subtitle, icon }) => (
    <div className="card bg-white shadow-sm border border-gray-200 rounded-xl"><div className="card-body p-4"><div className="flex items-center gap-4"><div className="text-gray-400">{icon}</div><div><div className="text-xs text-gray-500">{title}</div><div className="text-xl font-bold text-gray-800">{value}</div><p className="text-xs text-gray-400">{subtitle}</p></div></div></div></div>
);

const ProjectsPage = () => {
    // Estado para o modal de Criar/Editar
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);

    // Estado para o modal de Deletar
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Funções para o modal de Criar/Editar
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

    const folderIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>;
    const usersIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
    const clipboardIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
    const clockIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    const chartIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;

    return (
        <AppLayout pageType="projects">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Gestão de Projetos</h1>
                    <p className="text-sm text-gray-500">sábado, 11 de outubro</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    <ProjectStatCard icon={folderIcon} title="Total de Projetos" value="3" subtitle="3 ativos" />
                    <ProjectStatCard icon={usersIcon} title="Clientes" value="3" subtitle="Clientes únicos" />
                    <ProjectStatCard icon={clipboardIcon} title="Tarefas" value="0/0" subtitle={<progress className="progress w-full" value="0" max="100"></progress>} />
                    <ProjectStatCard icon={clockIcon} title="Horas Trabalhadas" value="0.0h" subtitle="Total registrado" />
                    <ProjectStatCard icon={chartIcon} title="Progresso Médio" value="0%" subtitle="Conclusão geral" />
                </div>

                <div className="bg-white p-3 rounded-xl flex justify-between items-center mb-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <input type="text" placeholder="Buscar projetos..." className="input input-bordered bg-gray-100 w-64" />
                        <select className="select select-bordered bg-gray-100 w-full max-w-xs"><option>Todos os clientes</option></select>
                        <select className="select select-bordered bg-gray-100 w-full max-w-xs"><option>Mais recentes</option></select>
                    </div>
                    <Button variant="primary" onClick={openCreateModal}>
                        + Novo Projeto
                    </Button>
                </div>

                <div className="card bg-white shadow-sm border border-gray-200 rounded-xl">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead><tr><th>Nome do Projeto</th><th>Cliente</th><th>Status</th><th className="text-right">Ações</th></tr></thead>
                                <tbody>
                                    {initialProjects.map((project) => (
                                        <tr key={project.id} className="hover">
                                            <td><div className="font-bold">{project.name}</div></td>
                                            <td>{project.client}</td>
                                            <td><span className="badge badge-ghost badge-sm">{project.status}</span></td>
                                            <td className="text-right">
                                                <Button variant="ghost" size="small" onClick={() => openEditModal(project)}>Editar</Button>
                                                <Button variant="ghost" size="small" className="text-red-500" onClick={() => openDeleteModal(project)}>Deletar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

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
