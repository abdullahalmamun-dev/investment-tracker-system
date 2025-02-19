"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const balanceData = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1398 },
  { month: "Mar", amount: 9800 },
  { month: "Apr", amount: 3908 },
  { month: "May", amount: 4800 },
  { month: "Jun", amount: 3800 },
];

const profitLossData = [
  { month: "Jan", profitLoss: 200 },
  { month: "Feb", profitLoss: -100 },
  { month: "Mar", profitLoss: 1200 },
  { month: "Apr", profitLoss: 500 },
  { month: "May", profitLoss: -700 },
  { month: "Jun", profitLoss: 300 },
];

const investmentData = [
  { name: "Stock Market", value: 800 },
  { name: "Restaurant Business", value: 300 },
  { name: "Transport Business", value: 150 },
  { name: "Others", value: 200 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("/api/investments");
        const investments = response.data;

        const profit = investments
          .filter((inv) => inv.profitOrLoss === "profit")
          .reduce((sum, inv) => sum + inv.amount, 0);

        const loss = investments
          .filter((inv) => inv.profitOrLoss === "loss")
          .reduce((sum, inv) => sum + inv.amount, 0);

        setTotalProfit(profit);
        setTotalLoss(loss);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Financial Overview</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
          <p className="text-3xl font-bold text-primary">$12,750</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Investment</h2>
          <p className="text-3xl font-bold text-chart-1">$3,850</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Profit</h2>
          <p className="text-3xl font-bold text-chart-4">
            ${totalProfit.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Loss</h2>
          <p className="text-3xl font-bold text-chart-2">
            ${totalLoss.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Balance Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Profit and Loss Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="profitLoss"
                  fill={profitLossData[0].profitLoss >= 0 ? "green" : "red"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Investment Distribution
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {investmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
