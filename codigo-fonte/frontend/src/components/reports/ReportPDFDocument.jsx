import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '2px solid #000000',
    paddingBottom: 15,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
    border: '1px solid #dddddd',
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  table: {
    border: '1px solid #dddddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #dddddd',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #eeeeee',
    padding: 10,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  tableCell: {
    fontSize: 13,
    color: '#000000',
  },
  taskColumn: {
    width: '40%',
  },
  projectColumn: {
    width: '25%',
  },
  timeColumn: {
    width: '20%',
  },
  statusColumn: {
    width: '15%',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  insightBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #007bff',
    borderRadius: 4,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#333333',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1px solid #dddddd',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#999999',
  },
});

const ReportPDFDocument = ({ reportData }) => {
  const metrics = reportData.metrics ?? {
    tasksCompleted: 0,
    totalTasks: 0,
    productivity: 0,
    hoursWorked: '0h',
    efficiency: 100,
  };
  const periodTitle =
    reportData.period === 'weekly'
      ? 'Relatório Semanal'
      : reportData.period === 'monthly'
        ? 'Relatório Mensal'
        : 'Relatório Diário';
  const dt = new Date(reportData.generatedAt ?? Date.now());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{periodTitle}</Text>
          <Text style={styles.subtitle}>
            Gerado em {dt.toLocaleDateString('pt-BR')}{' '}
            {dt.toLocaleTimeString('pt-BR')}
          </Text>
        </View>

        {/* Métricas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de Desempenho</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Tarefas</Text>
              <Text style={styles.metricValue}>
                {metrics.tasksCompleted}/{metrics.totalTasks}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Horas</Text>
              <Text style={styles.metricValue}>{metrics.hoursWorked}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Produtividade</Text>
              <Text style={styles.metricValue}>
                {Math.round(metrics.productivity)}%
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Eficiência</Text>
              <Text style={styles.metricValue}>
                {Math.round(metrics.efficiency)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Tarefas */}
        {reportData.tasks?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarefas</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.taskColumn]}>
                  Tarefa
                </Text>
                <Text style={[styles.tableHeaderCell, styles.projectColumn]}>
                  Projeto
                </Text>
                <Text style={[styles.tableHeaderCell, styles.timeColumn]}>
                  Tempo
                </Text>
                <Text style={[styles.tableHeaderCell, styles.statusColumn]}>
                  Status
                </Text>
              </View>

              {/* Table Rows */}
              {reportData.tasks.map((task, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.taskColumn]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.tableCell, styles.projectColumn]}>
                    {task.project ?? '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.timeColumn]}>
                    {task.timeSpent}
                  </Text>
                  <View style={styles.statusColumn}>
                    <Text
                      style={[
                        styles.statusBadge,
                        task.status === 'Concluída'
                          ? styles.statusCompleted
                          : styles.statusInProgress,
                      ]}
                    >
                      {task.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Insights */}
        {reportData.aiInsights?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights da IA</Text>
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>
                {reportData.aiInsights.summary}
              </Text>
              {reportData.aiInsights.recommendations?.map((r, i) => (
                <Text key={i} style={styles.insightText}>
                  • {r}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Companion · {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

ReportPDFDocument.propTypes = {
  reportData: PropTypes.shape({
    period: PropTypes.oneOf(['daily', 'weekly', 'monthly']).isRequired,
    generatedAt: PropTypes.string,
    metrics: PropTypes.shape({
      tasksCompleted: PropTypes.number,
      totalTasks: PropTypes.number,
      productivity: PropTypes.number,
      hoursWorked: PropTypes.string,
      efficiency: PropTypes.number,
    }),
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        project: PropTypes.string,
        timeSpent: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['completed', 'in_progress']).isRequired,
      }),
    ),
    aiInsights: PropTypes.shape({
      summary: PropTypes.string,
      recommendations: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};

export default ReportPDFDocument;
