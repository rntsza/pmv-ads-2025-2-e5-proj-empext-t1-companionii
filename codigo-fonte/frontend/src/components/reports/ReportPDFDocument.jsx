import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Estilos do PDF
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

const ReportPDFDocument = ({ reportData, reportType }) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentDateTime = new Date().toLocaleString('pt-BR');
  const currentYear = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{reportData.title}</Text>
          <Text style={styles.subtitle}>{currentDate}</Text>
        </View>

        {/* Métricas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de Desempenho</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Tarefas</Text>
              <Text style={styles.metricValue}>
                {reportData.metrics.completed}/{reportData.metrics.total}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Horas</Text>
              <Text style={styles.metricValue}>{reportData.metrics.hours}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Produtividade</Text>
              <Text style={styles.metricValue}>{reportData.metrics.productivity}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Eficiência</Text>
              <Text style={styles.metricValue}>85%</Text>
            </View>
          </View>
        </View>

        {/* Tarefas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarefas Realizadas</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.taskColumn]}>Tarefa</Text>
              <Text style={[styles.tableHeaderCell, styles.projectColumn]}>Projeto</Text>
              <Text style={[styles.tableHeaderCell, styles.timeColumn]}>Tempo</Text>
              <Text style={[styles.tableHeaderCell, styles.statusColumn]}>Status</Text>
            </View>

            {/* Table Rows */}
            {reportData.tasks.map((task, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.taskColumn]}>{task.title}</Text>
                <Text style={[styles.tableCell, styles.projectColumn]}>{task.project}</Text>
                <Text style={[styles.tableCell, styles.timeColumn]}>{task.time}</Text>
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

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise e Insights</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>{reportData.summary}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Relatório gerado em {currentDateTime} | © {currentYear} Companion
          </Text>
        </View>
      </Page>
    </Document>
  );
};

ReportPDFDocument.propTypes = {
  reportData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        project: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      }),
    ).isRequired,
    summary: PropTypes.string.isRequired,
    metrics: PropTypes.shape({
      completed: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      hours: PropTypes.string.isRequired,
      productivity: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  reportType: PropTypes.oneOf(['daily', 'weekly']).isRequired,
};

export default ReportPDFDocument;
