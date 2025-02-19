// src/MyDocument.tsx
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
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const MyDocument = ({ investment }: { investment: Investment }) => (
  <Document>
    <Page style={styles.page}>
      <Text>Investment Details</Text>
      <View>
        <Text>Name: {investment.name}</Text>
        <Text>Date: {new Date(investment.date).toLocaleDateString()}</Text>
        <Text>Description: {investment.description}</Text>
        <Text>Profit/Loss Amount: ${investment.profitOrLossAmount}</Text>
        <Text>Total Amount Invested: ${investment.amount}</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
