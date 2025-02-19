import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function TransactionList() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('/api/investments'); // Adjust endpoint if needed
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Investment Name</TableHead>
            <TableHead>Profit or Loss</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment._id}>
              <TableCell>{new Date(investment.date).toLocaleDateString()}</TableCell>
              <TableCell>{investment.name}</TableCell>
              <TableCell>{investment.profitOrLoss}</TableCell>
              <TableCell>{investment.description}</TableCell>
              <TableCell className="text-right">${investment.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
