"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { InvestmentDialog } from "@/components/transactions/transaction-dialog";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionFilters } from "@/components/transactions/transaction-filters";

export type Transaction = {
  id: string;
  type: "investment" | "profit" | "loss"; // updated types
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function TransactionsPage() {
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "investment", // changed from "income" to "investment"
      amount: 2000,
      category: "Salary",
      description: "Monthly salary",
      date: "2024-03-01",
    },
    {
      id: "2",
      type: "loss", // changed from "expense" to "loss"
      amount: 800,
      category: "Rent",
      description: "Monthly rent",
      date: "2024-03-02",
    },
    {
      id: "3",
      type: "loss", // changed from "expense" to "loss"
      amount: 50,
      category: "Groceries",
      description: "Weekly groceries",
      date: "2024-03-03",
    },
  ]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Investments</h1> {/* Updated title */}
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
