"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { InvestmentDialog } from "@/components/transactions/transaction-dialog";
import { TransactionFilters } from "@/components/transactions/transaction-filters";

export type Transaction = {
  id: string;
  type: "investment" | "profit" | "loss";
  amount: number;
  category: string;
  description: string;
  date: string;
};

interface TransactionListProps {
  transactions: Transaction[];
}

function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border p-4 rounded-lg bg-card"
        >
          <div className="flex justify-between">
            <span className="font-medium">{transaction.category}</span>
            <span className={
              transaction.type === "loss"
                ? "text-red-500"
                : transaction.type === "profit"
                  ? "text-green-500"
                  : "text-blue-500"
            }>
              {transaction.type === "loss" ? "-" : "+"} ${transaction.amount}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{transaction.description}</div>
          <div className="text-xs text-muted-foreground mt-2">{transaction.date}</div>
        </div>
      ))}
    </div>
  );
}

export default function TransactionsPage() {
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "investment",
      amount: 2000,
      category: "Salary",
      description: "Monthly salary",
      date: "2024-03-01",
    },
    {
      id: "2",
      type: "loss",
      amount: 800,
      category: "Rent",
      description: "Monthly rent",
      date: "2024-03-02",
    },
    {
      id: "3",
      type: "loss",
      amount: 50,
      category: "Groceries",
      description: "Weekly groceries",
      date: "2024-03-03",
    },
  ]);

  const addTransaction = (investment: { 
    name: string; 
    profitOrLoss: "Profit" | "Loss"; 
    description: string; 
    date: string; 
    amount: number; 
    profitOrLossAmount: number; 
  }) => {
    const transaction: Omit<Transaction, "id"> = {
      type: investment.profitOrLoss === "Profit" 
        ? "profit" 
        : investment.profitOrLoss === "Loss" 
          ? "loss" 
          : "investment",
      amount: investment.profitOrLoss === "Profit" || investment.profitOrLoss === "Loss" 
        ? investment.profitOrLossAmount 
        : investment.amount,
      category: investment.name,
      description: investment.description,
      date: investment.date,
    };

    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Investments</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setShowNewTransaction(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {showFilters && <TransactionFilters />}

      <TransactionList transactions={transactions} />

      <InvestmentDialog
        open={showNewTransaction}
        onOpenChange={setShowNewTransaction}
        onSubmit={addTransaction}
      />
    </div>
  );
}
