"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (investment: {
    name: string;
    profitOrLoss: "profit" | "loss";
    description: string;
    date: string;
    amount: number;
    profitOrLossAmount: number; // New field for profit/loss amount
  }) => void;
}

export function InvestmentDialog({
  open,
  onOpenChange,
  onSubmit,
}: InvestmentDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState<"profit" | "loss">("profit");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [profitOrLossAmount, setProfitOrLossAmount] = useState(0); // New state for profit/loss amount

  // State for modal messages
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const investmentData = { 
      name, 
      profitOrLoss, 
      description, 
      date, 
      amount, 
      profitOrLossAmount // Include new field in submission
    };
    
    try {
      await axios.post('http://localhost:5000/api/investments', investmentData); // Adjust endpoint if needed
      onSubmit(investmentData);
      resetForm(); // Reset form fields after submission
      setSuccessModalVisible(true); // Show success modal
    } catch (error) {
      console.error('Error saving investment:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while saving investment.');
      setErrorModalVisible(true); // Show error modal
    }
  };

  const resetForm = () => {
    setName('');
    setProfitOrLoss('profit');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setAmount(0);
    setProfitOrLossAmount(0); // Reset profit/loss amount
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Investment Name */}
          <div className="space-y-2">
            <Label>Investment Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter investment name"
            />
          </div>

          {/* Profit or Loss */}
          <div className="space-y-2">
            <Label>Profit or Loss</Label>
            <Select
              value={profitOrLoss}
              onValueChange={(value: "profit" | "loss") => setProfitOrLoss(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select profit or loss" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Investment description"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Investment Amount"
            />
          </div>

          {/* Profit or Loss Amount */}
          <div className="space-y-2">
            <Label>Profit or Loss Amount</Label>
            <Input
              type="number"
              value={profitOrLossAmount}
              onChange={(e) => setProfitOrLossAmount(Number(e.target.value))}
              placeholder="Enter profit or loss amount"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Investment</Button>
          </div>
        </form>

        {/* Success Modal */}
        {successModalVisible && (
          <Dialog open={successModalVisible} onOpenChange={() => setSuccessModalVisible(false)}>
            <DialogContent className="sm:max-w-[300px]">
              <DialogHeader>
                <DialogTitle>Success!</DialogTitle>
              </DialogHeader>
              <p>Your investment has been added successfully.</p>
              <Button variant="outline" onClick={() => setSuccessModalVisible(false)}>Close</Button>
            </DialogContent>
          </Dialog>
        )}

        {/* Error Modal */}
        {errorModalVisible && (
          <Dialog open={errorModalVisible} onOpenChange={() => setErrorModalVisible(false)}>
            <DialogContent className="sm:max-w-[300px]">
              <DialogHeader>
                <DialogTitle>Error!</DialogTitle>
              </DialogHeader>
              <p>{errorMessage}</p>
              <Button variant="outline" onClick={() => setErrorModalVisible(false)}>Close</Button>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
