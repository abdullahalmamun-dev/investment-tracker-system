"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

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
    profitOrLoss: "Profit" | "Loss";
    description: string;
    date: string;
    amount: number;
    profitOrLossAmount: number;
  }) => void;
}

export function InvestmentDialog({
  open,
  onOpenChange,
  onSubmit,
}: InvestmentDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState<"Profit" | "Loss">("Profit");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [profitOrLossAmount, setProfitOrLossAmount] = useState(0);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const investmentData = {
      name,
      profitOrLoss,
      description,
      date,
      amount,
      profitOrLossAmount,
    };

    try {
      await axios.post(
        `${process.env.API_URL || "https://go04g4woko84gssww4so4oss.92.112.181.229.sslip.io"}/api/investments`,
        investmentData
      );
      onSubmit(investmentData);
      resetForm();
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.error("Error saving investment:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while saving investment."
      );
      setErrorModalVisible(true);
    }
  };

  const resetForm = () => {
    setName("");
    setProfitOrLoss("Profit");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setAmount(0);
    setProfitOrLossAmount(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
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
            <Select
              value={profitOrLoss}
              onValueChange={(value: "Profit" | "Loss") =>
                setProfitOrLoss(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select profit or loss" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Profit">Profit</SelectItem>
                <SelectItem value="Loss">Loss</SelectItem>
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
              min={profitOrLoss === "Loss" ? "-9999999" : "0"} // Allow negative values for loss
            />
          </div>

          <div className="space-y-2">
            <Label>Profit or Loss Amount</Label>
            <Input
              type="number"
              value={profitOrLossAmount}
              onChange={(e) => setProfitOrLossAmount(Number(e.target.value))}
              placeholder="Enter profit or loss amount"
              min={profitOrLoss === "Loss" ? "-9999999" : "0"} // Allow negative values for loss
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Investment</Button>
          </div>
        </form>

        {successModalVisible && (
          <Dialog
            open={successModalVisible}
            onOpenChange={() => setSuccessModalVisible(false)}
          >
            <DialogContent className="sm:max-w-[300px]">
              <DialogHeader>
                <DialogTitle>Success!</DialogTitle>
              </DialogHeader>
              <p>Your investment has been added successfully.</p>
              <Button
                variant="outline"
                onClick={() => setSuccessModalVisible(false)}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}

        {errorModalVisible && (
          <Dialog
            open={errorModalVisible}
            onOpenChange={() => setErrorModalVisible(false)}
          >
            <DialogContent className="sm:max-w-[300px]">
              <DialogHeader>
                <DialogTitle>Error!</DialogTitle>
              </DialogHeader>
              <p>{errorMessage}</p>
              <Button
                variant="outline"
                onClick={() => setErrorModalVisible(false)}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
