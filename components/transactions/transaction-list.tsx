import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { InvestmentEditDialog } from './InvestmentEditDialog'; 

interface Investment {
  _id: string;
  name: string;
  profitOrLoss: string;
  description: string;
  date: string;
  amount: number;
  profitOrLossAmount: number;
}

export function TransactionList() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null); 
  const [editModalOpen, setEditModalOpen] = useState(false); 
  
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get<Investment[]>('http://localhost:5000/api/investments');
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/investments/${id}`);
      setInvestments(investments.filter((investment) => investment._id !== id));
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const handleEdit = (investment: Investment) => {
    console.log('Editing investment with ID:', investment._id);
    setSelectedInvestment(investment); 
    setEditModalOpen(true);
  };
  
  const handleModalClose = () => {
    setEditModalOpen(false); 
    setSelectedInvestment(null); 
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Investment Name</TableHead>
            <TableHead>Profit or Loss</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Profit/Loss Amount</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment._id}>
              <TableCell>{new Date(investment.date).toLocaleDateString()}</TableCell>
              <TableCell>{investment.name}</TableCell>
              <TableCell>{investment.profitOrLoss}</TableCell>
              <TableCell>{investment.description}</TableCell>
              <TableCell>${investment.profitOrLossAmount}.00</TableCell>
              <TableCell className="text-right">${investment.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(investment)} variant="outline" className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(investment._id)} variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedInvestment && (
        <InvestmentEditDialog
          open={editModalOpen}
          onClose={handleModalClose}
          investment={selectedInvestment}
          onUpdate={(updatedInvestment: Investment) => {

            setInvestments(investments.map((investment) =>
              investment._id === updatedInvestment._id ? updatedInvestment : investment
            ));
            handleModalClose(); 
          }}
        />
      )}
    </div>
  );
}
