import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { InvestmentEditDialog } from './InvestmentEditDialog'; // Import the modal component

export function TransactionList() {
  const [investments, setInvestments] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null); // Track selected investment for editing
  const [editModalOpen, setEditModalOpen] = useState(false); // Control modal visibility
  
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/investments');
        setInvestments(response.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/investments/${id}`);
      setInvestments(investments.filter((investment) => investment._id !== id));
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const handleEdit = (investment) => {
    console.log('Editing investment with ID:', investment._id); // Check the ID
    setSelectedInvestment(investment); // Set the investment to edit
    setEditModalOpen(true); // Open the modal
  };
  

  const handleModalClose = () => {
    setEditModalOpen(false); // Close the modal
    setSelectedInvestment(null); // Reset selected investment
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

      {/* Edit Modal */}
      {selectedInvestment && (
        <InvestmentEditDialog
          open={editModalOpen}
          onClose={handleModalClose}
          investment={selectedInvestment}
          onUpdate={(updatedInvestment) => {
            // Update the investment list in frontend
            setInvestments(investments.map((investment) =>
              investment._id === updatedInvestment._id ? updatedInvestment : investment
            ));
            handleModalClose(); // Close the modal
          }}
        />
      )}
    </div>
  );
}
