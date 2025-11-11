import { useState, useEffect, useMemo } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import ReportPDFDocument from '../components/reports/ReportPDFDocument';
import { AppLayout } from '../layouts';
import { Button, Modal } from '../components/ui';
import { projectsService } from '../services/projectsService';
import { dashboardsService } from '../services/dashboardService';
import { aiReportsService } from '../services/aiReportsService';
import { useToast } from '../hooks/useToast';
import { useAuthStore } from '../stores/authStore';

const PERIOD_OPT = [
  { label: 'Hoje', value: 'daily' },
  { label: 'Esta semana', value: 'weekly' },
  { label: 'Este mês', value: 'monthly' },
];

const priorityMeta = {
  URGENT: { label: 'Urgente', color: 'bg-rose-600' },
  HIGH: { label: 'Alta', color: 'bg-red-500' },
  MEDIUM: { label: 'Média', color: 'bg-yellow-500' },
  LOW: { label: 'Baixa', color: 'bg-green-500' },
};

const ReportsPage = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPT[0].label);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // dados do resumo da API
  const [summary, setSummary] = useState({
    distribuicaoPrioridade: { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 },
    produtividade: { minutos: 0, totalTasks: 0 },
    eficiencia: { value: 100 },
    emProgresso: 0,
    atrasadas: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const priorityDistUI = useMemo(() => {
    const dist = summary.distribuicaoPrioridade || {};
    const total =
      (dist.LOW ?? 0) +
        (dist.MEDIUM ?? 0) +
        (dist.HIGH ?? 0) +
        (dist.URGENT ?? 0) || 1;

    const order = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
    return order
      .map(key => ({
        key,
        label: priorityMeta[key].label,
        color: priorityMeta[key].color,
        count: dist[key] ?? 0,
        percentage: Math.round(((dist[key] ?? 0) / total) * 100),
      }))
      .filter(i => i); // sanity
  }, [summary]);

  const handleGenerateAI = async (
    period /* 'daily'|'weekly'|'monthly' */,
    projectId,
  ) => {
    setIsGenerating(true);
    try {
      const { data } = await aiReportsService.generate({
        projectId,
        period,
      });
      setReportData(data);
      toast.success('Relatório de IA gerado com sucesso!');
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Erro ao gerar relatório de IA. Tente novamente.');
      console.error('Error genarating IA report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    const blob = await pdf(
      <ReportPDFDocument reportData={reportData} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const label = reportData.period ?? 'daily';
    a.href = url;
    a.download = `${label}-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await projectsService.listAllSelect();
        setProjects(data || []);
      } catch (err) {
        console.error('Error gettings projects', err);
      }
    })();
  }, []);

  // Busca o resumo quando mudar projeto/período
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const periodEnum =
          PERIOD_OPT.find(p => p.label === selectedPeriod)?.value || 'daily';
        const data = await dashboardsService.summary({
          projectId: selectedProjectId || undefined,
          period: periodEnum,
        });
        if (data) setSummary(data);
      } catch (e) {
        console.error('Error loading dashboard report data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [selectedProjectId, selectedPeriod]);

  return (
    <AppLayout pageType="reports">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Todos os projetos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="cursor-pointer">
                  {p.name}
                  {p.companyName ? ` — ${p.companyName}` : ''}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Period Filter */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {PERIOD_OPT.map(p => (
                <option
                  key={p.value}
                  value={p.label}
                  className="cursor-pointer"
                >
                  {p.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-4 text-sm text-gray-500">
            Carregando dados do relatório…
          </div>
        )}

        {/* Metrics Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Distribuição por Prioridade */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Distribuição por Prioridade
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
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Analise das prioridades das tarefas
            </p>
            <div className="space-y-2">
              {priorityDistUI.map(item => (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-gray-700">{item.label}</span>
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
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Insights de IA
                </h3>
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
            <p className="text-sm text-gray-600 mb-3">
              Relatórios automáticos que transformam suas tarefas em insights
              acionáveis. Capture tempo investido, pontos de produtividade e
              métricas de desempenho.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-black-500 mr-2">•</span>
                <span>
                  Resumo diário - Apontar das últimas 24h, picos de foco e
                  tarefas concluídas
                </span>
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-black-500 mr-2">•</span>
                <span>
                  Histórico completo - Insights sobre produtividade e
                  oportunidades de otimização
                </span>
              </li>
            </ul>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="small"
                onClick={() =>
                  handleGenerateAI(
                    PERIOD_OPT.find(p => p.label === selectedPeriod)?.value ||
                      'daily',
                    selectedProjectId || undefined,
                  )
                }
                disabled={isGenerating || user.role !== 'ADMIN'}
              >
                {isGenerating
                  ? 'Gerando... Isso pode demorar'
                  : user.role !== 'ADMIN'
                    ? 'Apenas ADMIN'
                    : '+ Relatório'}
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
                Produtividade
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
              {Math.min(100, Math.round(summary.produtividade.minutos / 10))}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {`${summary.produtividade.minutos}min / ${summary.produtividade.totalTasks} tarefas`}
            </p>
          </div>

          {/* Eficiência */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Eficiência</h3>
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
              {summary.eficiencia.value}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Eficiência baseada em estimado x realizado
            </p>
          </div>

          {/* Em Progresso */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Em Progresso
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
              {summary.emProgresso}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tarefas ativas</p>
          </div>

          {/* Atrasados */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Atrasadas</h3>
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
              {summary.atrasadas}
            </div>
            <p className="text-xs text-gray-500 mt-1">Precisam atenção</p>
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
            <Button size="small" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button variant="primary" size="small" onClick={handleDownloadPDF}>
              📥 Download PDF
            </Button>
          </div>

          {reportData ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="600px">
                <ReportPDFDocument reportData={reportData} />
              </PDFViewer>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500">Sem dados</div>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
};

export default ReportsPage;
