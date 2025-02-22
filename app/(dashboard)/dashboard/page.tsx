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
  BarProps, // Import BarProps from recharts
} from "recharts";

// Define the types for the data we're working with
interface Investment {
  _id: string;
  profitOrLoss: "profit" | "loss";
  description: string;
  amount: number;
  date: string;
  profitOrLossAmount: number; // Added property
}

interface InvestmentData {
  name: string;
  value: number;
}

// Define a type for the accumulator in reduce
interface InvestmentCategoryAccumulator {
  [key: string]: number; // Dynamic keys of type string with values of type number
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

// Custom shape component for bars
const CustomBarShape = (props: BarProps) => {
  const { x, y, width, height, payload } = props; // Access props directly
  const value = payload.profitLoss; // Get the value from payload
  const fillColor = value < 0 ? "red" : "green"; // Determine color based on value

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fillColor}
    />
  );
};

export default function DashboardPage() {
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [totalLoss, setTotalLoss] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceData, setBalanceData] = useState<
    { month: string; amount: number }[]
  >([]);
  const [profitLossData, setProfitLossData] = useState<
    { month: string; profitLoss: number }[]
  >([]);
  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Investment[]>(
          "http://localhost:5000/api/investments"
        );
        const investments = response.data;

        // Calculate total profit and loss
        const profit = investments
          .filter((inv) => inv.profitOrLoss === "profit")
          .reduce((sum, inv) => sum + inv.profitOrLossAmount, 0);
        const loss = investments
          .filter((inv) => inv.profitOrLoss === "loss")
          .reduce((sum, inv) => sum + Math.abs(inv.profitOrLossAmount), 0); // Only sum absolute values of losses
        const investmentAmount = investments.reduce(
          (sum, inv) => sum + inv.amount,
          0
        );

        // Set dynamic data
        setTotalProfit(profit);
        setTotalLoss(loss);
        setTotalInvestment(investmentAmount);
        setCurrentBalance(profit + investmentAmount - loss);

        // Prepare data for charts
        const balanceData = investments.map((inv) => ({
          month: new Date(inv.date).toLocaleString("default", {
            month: "short",
          }),
          amount: inv.amount,
        }));
        setBalanceData(balanceData);

        const profitLossData = investments.map((inv) => ({
          month: new Date(inv.date).toLocaleString("default", {
            month: "short",
          }),
          profitLoss:
            inv.profitOrLoss === "profit"
              ? inv.profitOrLossAmount
              : -inv.profitOrLossAmount,
        }));
        setProfitLossData(profitLossData);

        // Update this part to define the accumulator type correctly
        const investmentData = investments.reduce<InvestmentCategoryAccumulator>((acc, inv) => {
          const category = inv.description || "Others"; // Use description or "Others" as fallback
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += inv.amount;
          return acc;
        }, {});

        setInvestmentData(
          Object.keys(investmentData).map((key) => ({
            name: key,
            value: investmentData[key],
          }))
        );
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Financial Overview</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Current Balance</h2>
          <p className="text-3xl font-bold text-primary">
            ${currentBalance.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Investment</h2>
          <p className="text-3xl font-bold text-chart-1">
            ${totalInvestment.toFixed(2)}
          </p>
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
                  fill="hsl(var(--chart-1))"
                  shape={<CustomBarShape />} // Use CustomBarShape component here
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
