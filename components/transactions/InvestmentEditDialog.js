import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';

export function InvestmentEditDialog({ open, onClose, investment, onUpdate }) {
  const [name, setName] = useState('');
  const [profitOrLoss, setProfitOrLoss] = useState('profit');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [profitOrLossAmount, setProfitOrLossAmount] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (investment) {
      setName(investment.name);
      setProfitOrLoss(investment.profitOrLoss);
      setDescription(investment.description);
      setAmount(investment.amount);
      setProfitOrLossAmount(investment.profitOrLossAmount);
      setDate(investment.date.split('T')[0]);
    }
  }, [investment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInvestment = { name, profitOrLoss, description, date, amount, profitOrLossAmount };
      
      // Make sure the URL includes the investment ID
      const response = await axios.put(`http://go04g4woko84gssww4so4oss.92.112.181.229.sslip.io/api/investments/${investment._id}`, updatedInvestment);
      
      onUpdate(response.data); // Update the investment on the parent component
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Investment Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter investment name"
            />
          </div>

          <div className="space-y-2">
            <Label>Profit or Loss</Label>
            <Select value={profitOrLoss} onValueChange={setProfitOrLoss}>
              <SelectTrigger>
                <SelectValue placeholder="Select profit or loss" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Investment description"
            />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Investment Amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Profit or Loss Amount</Label>
            <Input
              type="number"
              value={profitOrLossAmount}
              onChange={(e) => setProfitOrLossAmount(Number(e.target.value))}
              placeholder="Profit or loss amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
