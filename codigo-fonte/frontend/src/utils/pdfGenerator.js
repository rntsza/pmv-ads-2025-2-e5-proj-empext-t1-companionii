/**
 * Mock data para relatórios
 */
const getMockReportData = (reportType) => {
  const reportData = {
    daily: {
      title: 'Relatório Diário',
      tasks: [
        {
          title: 'Implementar tela de login',
          project: 'Projeto Alpha',
          time: '2h 15min',
          status: 'Concluída',
        },
        {
          title: 'Revisar código do módulo de autenticação',
          project: 'Projeto Alpha',
          time: '1h 30min',
          status: 'Concluída',
        },
        {
          title: 'Configurar ambiente de produção',
          project: 'Projeto Beta',
          time: '1h 45min',
          status: 'Concluída',
        },
        {
          title: 'Criar documentação da API',
          project: 'Projeto Alpha',
          time: '1h 00min',
          status: 'Em Progresso',
        },
      ],
      summary:
        'Seu desempenho hoje esteve acima da média. Você concluiu 5 de 8 tarefas planejadas, mantendo um ritmo consistente ao longo do dia.',
      metrics: { completed: 5, total: 8, hours: '6h 30min', productivity: '62.5%' },
    },
    weekly: {
      title: 'Relatório Semanal',
      tasks: [
        {
          title: 'Sprint Planning - Q1',
          project: 'Projeto Alpha',
          time: '8h 30min',
          status: 'Concluída',
        },
        {
          title: 'Desenvolvimento de features',
          project: 'Projeto Beta',
          time: '12h 45min',
          status: 'Concluída',
        },
        {
          title: 'Code review e refatoração',
          project: 'Projeto Alpha',
          time: '6h 20min',
          status: 'Concluída',
        },
        {
          title: 'Testes e documentação',
          project: 'Projeto Gamma',
          time: '4h 40min',
          status: 'Em Progresso',
        },
      ],
      summary:
        'Semana produtiva com 80% de conclusão das tarefas planejadas. Você manteve uma média de 6.5 horas/dia de trabalho focado.',
      metrics: { completed: 28, total: 35, hours: '32h 15min', productivity: '80%' },
    },
    test: {
      title: 'Relatório de Teste - Hello World',
      tasks: [
        {
          title: 'Tarefa de Teste 1',
          project: 'Projeto Teste',
          time: '1h 00min',
          status: 'Concluída',
        },
        {
          title: 'Tarefa de Teste 2',
          project: 'Projeto Teste',
          time: '2h 00min',
          status: 'Em Progresso',
        },
      ],
      summary: 'Este é um relatório de teste para validar a geração de PDFs.',
      metrics: { completed: 1, total: 2, hours: '3h 00min', productivity: '50%' },
    },
  };

  return reportData[reportType] || reportData.daily;
};

/**
 * Hook React para geração de PDFs
 * Retorna os dados mockados para serem usados no modal
 */
export const usePDFGenerator = () => {
  const generateDaily = () => {
    return {
      success: true,
      data: getMockReportData('daily'),
      type: 'daily',
    };
  };

  const generateWeekly = () => {
    return {
      success: true,
      data: getMockReportData('weekly'),
      type: 'weekly',
    };
  };

  const generateTest = () => {
    return {
      success: true,
      data: getMockReportData('test'),
      type: 'test',
    };
  };

  return {
    generateDaily,
    generateWeekly,
    generateTest,
  };
};
