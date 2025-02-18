"use client";

import { Card } from "@/components/ui/card";
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
  { name: "Rent", value: 800 },
  { name: "Food", value: 300 },
  { name: "Transport", value: 150 },
  { name: "Entertainment", value: 100 },
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
  return (
    <div className="h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Financial Overview</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
          <p className="text-3xl font-bold text-primary">$12,750</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Investment</h2>
          <p className="text-3xl font-bold text-chart-1">$3,850</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Profit and Loss</h2>
          <p className="text-3xl font-bold text-chart-2">$1,550</p>
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
          <h2 className="text-lg font-semibold mb-4">Investment Distribution</h2>
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
