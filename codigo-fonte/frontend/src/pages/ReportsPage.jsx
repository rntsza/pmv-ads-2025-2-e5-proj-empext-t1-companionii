import { useState } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import { usePDFGenerator } from '../utils/pdfGenerator';
import ReportPDFDocument from '../components/reports/ReportPDFDocument';

// Mock data para relatórios
const mockReportsData = {
  filters: {
    projects: ['Todos os projetos', 'Projeto A', 'Projeto B', 'Projeto C'],
    periods: ['Este mês', 'Esta semana', 'Hoje', 'Últimos 7 dias', 'Últimos 30 dias'],
  },
  metrics: {
    productivity: {
      value: 0.0,
      trend: 0,
      label: 'Produtividade',
      subtitle: '0/0',
    },
    efficiency: {
      value: 100.0,
      trend: 0,
      label: 'Eficiência',
      subtitle: '0.0h de 0.0h estimadas',
    },
    inProgress: {
      value: 0,
      label: 'Em Progresso',
      subtitle: 'Tarefas ativas',
    },
    delayed: {
      value: 0,
      label: 'Atrasados',
      subtitle: 'Precisam atenção',
    },
  },
  priorityDistribution: [
    { priority: 'Alta', count: 0, percentage: 0, color: 'bg-red-500' },
    { priority: 'Média', count: 0, percentage: 0, color: 'bg-yellow-500' },
    { priority: 'Baixa', count: 0, percentage: 0, color: 'bg-green-500' },
  ],
  aiInsights: {
    available: false,
    summary:
      'Relatórios automáticos que transformam suas tarefas em insights acionáveis. Capture tempo investido, pontos de produtividade e métricas de desempenho.',
    features: [
      'Resumo diário - Apontar das últimas 24h, picos de foco e tarefas concluídas',
      'Histórico completo - Insights sobre produtividade e oportunidades de otimização',
    ],
    buttons: [
      { label: '+ Relatório diário', variant: 'primary' },
      { label: '+ Relatório semanal', variant: 'secondary' },
    ],
  },
};

const ReportsPage = () => {
  const [selectedProject, setSelectedProject] = useState(mockReportsData.filters.projects[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(mockReportsData.filters.periods[0]);
  const [reportsData] = useState(mockReportsData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReportData, setCurrentReportData] = useState(null);
  const { generateDaily, generateWeekly, generateTest } = usePDFGenerator();

  const handleGenerateReport = async (type) => {
    setIsGenerating(true);
    try {
      let result;
      if (type === 'daily') {
        result = generateDaily();
      } else if (type === 'weekly') {
        result = generateWeekly();
      } else if (type === 'test') {
        result = generateTest();
      }

      if (result?.success) {
        setCurrentReportData(result);
        setIsModalOpen(true);
      } else {
        console.error('Erro ao gerar PDF:', result?.error);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentReportData) return;

    try {
      const blob = await pdf(
        <ReportPDFDocument
          reportData={currentReportData.data}
          reportType={currentReportData.type}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${currentReportData.type}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
    }
  };

  return (
    <AppLayout pageType="reports">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportsData.filters.projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportsData.filters.periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Metrics Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Distribuição por Prioridade */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Distribuição por Prioridade</h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-3">Analise das prioridades das tarefas</p>
            <div className="space-y-2">
              {reportsData.priorityDistribution.map((item) => (
                <div key={item.priority}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-gray-700">{item.priority}</span>
                    </div>
                    <span className="font-medium">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights de IA */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 lg:col-span-3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Insights de IA</h3>
                <p className="text-xs text-gray-500">
                  Análises automáticas e recomendações personalizadas
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-3">{reportsData.aiInsights.summary}</p>
            <ul className="space-y-2 mb-4">
              {reportsData.aiInsights.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="text-black-500 mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="small"
                onClick={() => handleGenerateReport('daily')}
                disabled={isGenerating}
              >
                {isGenerating ? 'Gerando...' : '+ Relatório diário'}
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={() => handleGenerateReport('weekly')}
                disabled={isGenerating}
              >
                {isGenerating ? 'Gerando...' : '+ Relatório semanal'}
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Produtividade */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {reportsData.metrics.productivity.label}
              </h3>
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {reportsData.metrics.productivity.value}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {reportsData.metrics.productivity.subtitle}
            </p>
          </div>

          {/* Eficiência */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {reportsData.metrics.efficiency.label}
              </h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {reportsData.metrics.efficiency.value}%
            </div>
            <p className="text-xs text-gray-500 mt-1">{reportsData.metrics.efficiency.subtitle}</p>
          </div>

          {/* Em Progresso */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {reportsData.metrics.inProgress.label}
              </h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {reportsData.metrics.inProgress.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{reportsData.metrics.inProgress.subtitle}</p>
          </div>

          {/* Atrasados */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                {reportsData.metrics.delayed.label}
              </h3>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {reportsData.metrics.delayed.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{reportsData.metrics.delayed.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Modal de Preview do PDF */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Preview do Relatório"
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="small" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button variant="primary" size="small" onClick={handleDownloadPDF}>
              📥 Download PDF
            </Button>
          </div>

          {currentReportData && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="600px">
                <ReportPDFDocument
                  reportData={currentReportData.data}
                  reportType={currentReportData.type}
                />
              </PDFViewer>
            </div>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
};

export default ReportsPage;
