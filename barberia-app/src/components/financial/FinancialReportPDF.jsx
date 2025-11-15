import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #ffc000',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffc000',
    paddingVertical: 8,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tableColDate: {
    width: '12%',
    paddingHorizontal: 5,
  },
  tableColType: {
    width: '12%',
    paddingHorizontal: 5,
  },
  tableColCategory: {
    width: '15%',
    paddingHorizontal: 5,
  },
  tableColDescription: {
    width: '28%',
    paddingHorizontal: 5,
  },
  tableColPayment: {
    width: '18%',
    paddingHorizontal: 5,
  },
  tableColAmount: {
    width: '15%',
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  summaryBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
    border: '1 solid #e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #ffc000',
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  summaryTotalValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  income: {
    color: '#10b981',
  },
  expense: {
    color: '#ef4444',
  },
  profit: {
    color: '#3b82f6',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
});

/**
 * Componente de documento PDF para reportes financieros
 */
const FinancialReportPDF = ({ transactions, summary, categories, paymentMethods, branchName, dateRange }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              src="/logo.png"
              style={styles.logo}
            />
            <View style={styles.headerText}>
              <Text style={styles.title}>Reporte Financiero</Text>
              <Text style={styles.subtitle}>{branchName || 'Todas las Sucursales'}</Text>
              <Text style={styles.subtitle}>Generado: {currentDate}</Text>
              {dateRange && <Text style={styles.subtitle}>Período: {dateRange}</Text>}
            </View>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Ingresos:</Text>
            <Text style={[styles.summaryValue, styles.income]}>
              S/ {summary.totalIncome?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gastos:</Text>
            <Text style={[styles.summaryValue, styles.expense]}>
              S/ {summary.totalExpenses?.toFixed(2) || '0.00'}
            </Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Ganancia Neta:</Text>
            <Text style={[styles.summaryTotalValue, styles.profit]}>
              S/ {summary.netProfit?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>

        {/* Tabla de Transacciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Transacciones</Text>

          {/* Header de tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDate}>Fecha</Text>
            <Text style={styles.tableColType}>Tipo</Text>
            <Text style={styles.tableColCategory}>Categoría</Text>
            <Text style={styles.tableColDescription}>Descripción</Text>
            <Text style={styles.tableColPayment}>Método Pago</Text>
            <Text style={styles.tableColAmount}>Monto</Text>
          </View>

          {/* Filas de tabla */}
          <View style={styles.table}>
            {transactions.map((transaction, index) => {
              const categoryName = transaction.type === 'income'
                ? categories.income?.find(c => c.id === transaction.category)?.name || transaction.category
                : categories.expense?.find(c => c.id === transaction.category)?.name || transaction.category;

              const paymentMethodName = paymentMethods?.find(pm => pm.id === transaction.paymentMethod)?.name || transaction.paymentMethod;

              return (
                <View key={transaction.id || index} style={styles.tableRow}>
                  <Text style={styles.tableColDate}>
                    {new Date(transaction.date).toLocaleDateString('es-PE')}
                  </Text>
                  <Text style={styles.tableColType}>
                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Text>
                  <Text style={styles.tableColCategory}>{categoryName}</Text>
                  <Text style={styles.tableColDescription}>
                    {transaction.description?.substring(0, 40) || 'Sin descripción'}
                    {transaction.description?.length > 40 ? '...' : ''}
                  </Text>
                  <Text style={styles.tableColPayment}>{paymentMethodName}</Text>
                  <Text style={[
                    styles.tableColAmount,
                    transaction.type === 'income' ? styles.income : styles.expense
                  ]}>
                    S/ {transaction.amount?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Reporte generado automáticamente por Barbería App • {currentDate}
        </Text>
      </Page>
    </Document>
  );
};

export default FinancialReportPDF;
