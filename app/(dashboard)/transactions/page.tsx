"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
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
        <h1 className="text-2xl font-bold">Investments & Profits</h1> {/* Updated title */}
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Total Investment</h2> {/* Updated label */}
          <p className="text-3xl font-bold text-chart-1">
            ${transactions
              .filter((t) => t.type === "investment") // updated filter condition
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Total Loss</h2> {/* Updated label */}
          <p className="text-3xl font-bold text-chart-2">
            ${transactions
              .filter((t) => t.type === "loss") // updated filter condition
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Net Balance</h2>
          <p className="text-3xl font-bold text-primary">
            ${transactions
              .reduce(
                (sum, t) =>
                  sum + (t.type === "investment" ? t.amount : -t.amount),
                0
              )
              .toLocaleString()}
          </p>
        </Card>
      </div>

      {showFilters && <TransactionFilters />}

      <TransactionList transactions={transactions} />

      <TransactionDialog
        open={showNewTransaction}
        onOpenChange={setShowNewTransaction}
        onSubmit={addTransaction}
      />
    </div>
  );
}
