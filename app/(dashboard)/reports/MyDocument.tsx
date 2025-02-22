import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface Investment {
  name: string;
  profitOrLoss: "profit" | "loss";
  description: string;
  profitOrLossAmount: number;
  amount: number;
  date: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    backgroundColor: '#f8f9fa', // Light gray background similar to Tailwind's 'bg-gray-100'
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    color: '#1d4ed8', // Tailwind blue-600 color
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase', // Makes the header all uppercase
  },
  section: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff', // White background for content area
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827', // Tailwind gray-900 color
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 12,
    color: '#374151', // Tailwind gray-700 color
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#1d4ed8', // Blue color for labels
  },
  value: {
    width: '60%',
    color: '#333', // Standard gray for values
  },
  profit: {
    color: '#22c55e', // Tailwind green-500 for profit
  },
  loss: {
    color: '#ef4444', // Tailwind red-500 for loss
  },
  divider: {
    marginTop: 20,
    borderBottom: '1px solid #1d4ed8', // Blue color divider line
    marginBottom: 20,
  },
  footer: {
    fontSize: 10,
    color: '#6b7280', // Tailwind gray-600 for footer text
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

const MyDocument = ({ investment }: { investment: Investment }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Investment Transaction Report</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Investment Details:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Investment Name:</Text>
          <Text style={styles.value}>{investment.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(investment.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{investment.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Profit/Loss:</Text>
          <Text style={investment.profitOrLoss === 'profit' ? styles.profit : styles.loss}>
            {investment.profitOrLoss.charAt(0).toUpperCase() + investment.profitOrLoss.slice(1)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Profit/Loss Amount:</Text>
          <Text style={investment.profitOrLoss === 'profit' ? styles.profit : styles.loss}>
            ${investment.profitOrLossAmount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount Invested:</Text>
          <Text style={styles.value}>${investment.amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.footer}>Investment Tracker - Generated on {new Date().toLocaleString()}</Text>
    </Page>
  </Document>
);

export default MyDocument;
