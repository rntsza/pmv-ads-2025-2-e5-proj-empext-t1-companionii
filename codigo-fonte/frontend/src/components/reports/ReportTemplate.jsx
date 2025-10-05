import PropTypes from 'prop-types';

/**
 * Template HTML para geração de relatórios em PDF
 * Este componente renderiza o conteúdo que será convertido em PDF
 */
const ReportTemplate = ({ type = 'daily', data, className = '' }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportTitles = {
    daily: 'Relatório Diário',
    weekly: 'Relatório Semanal',
    monthly: 'Relatório Mensal'
  };

  return (
    <div className={className} style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#000' }}>
              {reportTitles[type]}
            </h1>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>{currentDate}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#000',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              C
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
          Métricas de Desempenho
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <MetricCard
            label="Tarefas Concluídas"
            value={data?.metrics?.tasksCompleted || 0}
            total={data?.metrics?.totalTasks || 0}
            icon="✓"
          />
          <MetricCard
            label="Produtividade"
            value={`${data?.metrics?.productivity || 0}%`}
            icon="📊"
          />
          <MetricCard
            label="Horas Trabalhadas"
            value={data?.metrics?.hoursWorked || '0h'}
            icon="⏱️"
          />
          <MetricCard
            label="Eficiência"
            value={`${data?.metrics?.efficiency || 100}%`}
            icon="⚡"
          />
        </div>
      </div>

      {/* Tarefas Detalhadas */}
      {data?.tasks && data.tasks.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
            Tarefas Realizadas
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Tarefa</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Projeto</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Tempo</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{task.title}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{task.project}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{task.timeSpent}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    <span style={{
                      backgroundColor: task.status === 'completed' ? '#d1fae5' : '#fef3c7',
                      color: task.status === 'completed' ? '#065f46' : '#92400e',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {task.status === 'completed' ? 'Concluída' : 'Em Progresso'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Insights de IA */}
      {data?.aiInsights && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
            Insights e Recomendações
          </h2>
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', margin: '0 0 12px 0' }}>
              {data.aiInsights.summary}
            </p>
            {data.aiInsights.recommendations && data.aiInsights.recommendations.length > 0 && (
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {data.aiInsights.recommendations.map((rec, index) => (
                  <li key={index} style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151', marginBottom: '8px' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Distribuição por Prioridade */}
      {data?.priorityDistribution && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
            Distribuição por Prioridade
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {data.priorityDistribution.map((item, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  {item.priority}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {item.count}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0' }}>
          Relatório gerado automaticamente pelo Companion em {new Date().toLocaleString('pt-BR')}
        </p>
        <p style={{ margin: '8px 0 0 0' }}>
          © {new Date().getFullYear()} Companion - Sistema de Gestão Diária para Desenvolvedores
        </p>
      </div>
    </div>
  );
};

// Componente auxiliar para cards de métricas
const MetricCard = ({ label, value, total, icon }) => (
  <div style={{
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '12px', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '20px' }}>{icon}</span>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
      {value}{total ? `/${total}` : ''}
    </div>
  </div>
);

ReportTemplate.propTypes = {
  type: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  data: PropTypes.shape({
    metrics: PropTypes.shape({
      tasksCompleted: PropTypes.number,
      totalTasks: PropTypes.number,
      productivity: PropTypes.number,
      hoursWorked: PropTypes.string,
      efficiency: PropTypes.number,
    }),
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        project: PropTypes.string,
        timeSpent: PropTypes.string,
        status: PropTypes.string,
      })
    ),
    aiInsights: PropTypes.shape({
      summary: PropTypes.string,
      recommendations: PropTypes.arrayOf(PropTypes.string),
    }),
    priorityDistribution: PropTypes.arrayOf(
      PropTypes.shape({
        priority: PropTypes.string,
        count: PropTypes.number,
        percentage: PropTypes.number,
      })
    ),
  }),
  className: PropTypes.string,
};

export default ReportTemplate;
