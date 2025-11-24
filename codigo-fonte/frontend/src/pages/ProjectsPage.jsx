import React, { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import ProjectForm from '../components/projects/ProjectForm';
import { projectsService } from '../services/projectsService';
import { tasksService } from '../services/tasksService';
import { companiesService } from '../services/companiesService';
import { useToast } from '../hooks/useToast';

const ProjectsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5"
        >
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-3"></div>
          <div className="h-6 w-1/2 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
  const { toast } = useToast();

  const [metrics, setMetrics] = useState({
    activeProjects: '0/0',
    uniqueClients: '0',
    totalTasks: '0',
    finishedTasks: '0',
    totalHours: '0',
    progress: '0',
  });

  const [projects, setProjects] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('ALL');
  const [sortOption, setSortOption] = useState('recent');

  const loadMetrics = useCallback(async () => {
    if (!projects || projects.length === 0) {
      setMetrics({
        activeProjects: '0/0',
        uniqueClients: '0',
        totalTasks: '0',
        finishedTasks: '0',
        totalHours: '0',
        progress: '0',
      });
      return;
    }

    const uniqueClientsCount = [];
    for (const p of projects) {
      if (p.clientId && !uniqueClientsCount.includes(p.clientId)) {
        uniqueClientsCount.push(p.clientId);
      }
    }

    let totalTasks = 0;
    let finishedTasks = 0;
    let totalHours = 0;
    let progressSum = 0;

    for (const p of projects) {
      const tasks = (await tasksService.list({ projectId: p.id })) || [];
      totalTasks += tasks.length;
      finishedTasks += tasks.filter(t => t.status === 'DONE').length;
      totalHours += tasks.reduce((acc, t) => acc + (t.hours || 0), 0);
      progressSum +=
        tasks.length > 0 ? Math.round((finishedTasks / tasks.length) * 100) : 0;
    }

    setMetrics({
      activeProjects: projects.filter(p =>
        projects.some(t => t.status !== 'DONE'),
      ).length,
      uniqueClients: uniqueClientsCount.length,
      totalTasks,
      finishedTasks,
      totalHours,
      progress: Math.round(progressSum / projects.length),
    });
  }, [projects]);

  const loadProjects = useCallback(async () => {
    try {
      const proj = await projectsService.listAllSelect();
      const safe = proj.map(p => ({
        ...p,
        tasks: Array.isArray(p.tasks) ? p.tasks : [],
      }));
      setProjects(safe);
      setLoaded(true);
    } catch (err) {
      toast.error(err?.message || 'Falha ao carregar projetos');
      setLoaded(true);
    }
  }, [toast]);

  const loadCompanies = useCallback(async () => {
    try {
      const data = await companiesService.listAll();
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  }, []);

  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  useEffect(() => {
    if (!companiesLoaded) {
      loadCompanies().finally(() => setCompaniesLoaded(true));
    }
  }, [companiesLoaded, loadCompanies]);

  useEffect(() => {
    if (projects === null) loadProjects();
  }, [projects, loadProjects]);

  useEffect(() => {
    if (projects !== null) loadMetrics();
  }, [projects, loadMetrics]);

  const openCreateModal = () => {
    setProjectToEdit(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = project => {
    const company = companies.find(c => c.id === project.companyId) || null;
    setProjectToEdit({ ...project, company });
    setIsFormModalOpen(true);
  };


  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setProjectToEdit(null);
  };

  const handleCreateProject = async projectData => {
    try {
      await projectsService.create({
        ...projectData,
        name: projectData.name,
        clientName: projectData.client,
        description: projectData.description,
        colorHex: projectData.color,
        companyId: projectData.companyId,
        status: 'TODO',
      });
    } catch (err) {
      toast.error(err?.message || 'Não foi possível criar o projeto.');
    }
  };

  const handleFormSubmit = async projectData => {
    try {
      if (projectToEdit) {
        await projectsService.edit(projectToEdit.id, projectData);
      } else {
        await handleCreateProject(projectData);
      }
      await loadProjects();
      toast.success(
        projectToEdit
          ? 'Projeto atualizado com sucesso!'
          : 'Projeto criado com sucesso!',
      );
      closeFormModal();
    } catch (err) {
      toast.error(err?.message || 'Não foi possível processar o projeto.');
    }
  };

  const openDeleteModal = p => {
    setProjectToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await projectsService.delete(projectToDelete.id);
      await loadProjects();
      toast.success('Projeto deletado com sucesso!');
      closeDeleteModal();
    } catch (err) {
      toast.error(err?.message || 'Não foi possível deletar o projeto.');
    }
  };

  const folderIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );

  const usersIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const clipboardIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );

  const clockIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const chartIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );

  let filteredProjects = projects || [];

  if (searchTerm.trim() !== '') {
    const t = searchTerm.toLowerCase();
    filteredProjects = filteredProjects.filter(
      p =>
        p.name.toLowerCase().includes(t) ||
        (p.description && p.description.toLowerCase().includes(t)) ||
        (p.client && p.client.toLowerCase().includes(t)),
    );
  }

  if (selectedClient !== 'ALL') {
    filteredProjects = filteredProjects.filter(
      p => p.client === selectedClient,
    );
  }

  filteredProjects = [...filteredProjects];

  if (sortOption === 'az') {
    filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortOption === 'za') {
    filteredProjects.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sortOption === 'recent') {
    filteredProjects.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }
  if (sortOption === 'oldest') {
    filteredProjects.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  }

  return (
    <AppLayout pageType="projects">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {!loaded ? (
          <ProjectsSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <ProjectStatCard
                icon={folderIcon}
                title="Total de Projetos"
                value={projects?.length ?? '-'}
                subtitle={
                  projects?.length ? `${metrics.activeProjects} ativos` : '-'
                }
              />
              <ProjectStatCard
                icon={usersIcon}
                title="Clientes"
                value={projects?.length ? metrics.uniqueClients : '-'}
                subtitle={projects?.length ? 'Clientes únicos' : '-'}
              />
              <ProjectStatCard
                icon={clipboardIcon}
                title="Tarefas"
                value={
                  projects?.length
                    ? `${metrics.finishedTasks}/${metrics.totalTasks}`
                    : '-'
                }
                subtitle=""
              />
              <ProjectStatCard
                icon={clockIcon}
                title="Horas Trabalhadas"
                value={projects?.length ? `${metrics.totalHours}h` : '-'}
                subtitle={projects?.length ? 'Total registrado' : '-'}
              />
              <ProjectStatCard
                icon={chartIcon}
                title="Progresso Médio"
                value={projects?.length ? `${metrics.progress}%` : '-'}
                subtitle={projects?.length ? 'Conclusão geral' : '-'}
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <svg
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar projetos..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                >
                  <option value="ALL">Todos os clientes</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white text-sm font-medium text-gray-700 pr-10"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="recent">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>

              <Button
                variant="primary"
                onClick={openCreateModal}
                className="whitespace-nowrap"
              >
                + Novo Projeto
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 mb-6 text-gray-400">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum projeto criado
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Comece criando seu primeiro projeto para organizar suas
                    tarefas
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome do Projeto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjects.map(project => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {project.client}
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
          </>
        )}

        <Modal
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
          title={projectToEdit ? 'Editar Projeto' : 'Novo Projeto'}
        >
          <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
              {projectToEdit ? 'Editar Projeto' : 'Criar Projeto'}
            </h1>
            <ProjectForm
              initialData={projectToEdit}
              onSubmit={handleFormSubmit}
              onCancel={closeFormModal}
              companies={companies}
            />
          </div>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Deletar Projeto"
        >
          <div className="space-y-4">
            <p>
              Tem certeza que deseja deletar o projeto{' '}
              <strong>{projectToDelete?.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeDeleteModal}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Deletar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
