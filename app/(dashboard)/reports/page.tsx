"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

interface Investment {
  _id: string;
  name: string;
  profitOrLoss: "profit" | "loss";
  description: string;
  profitOrLossAmount: number;
  amount: number;
  date: string;
}

const Report = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get<Investment[]>("http://go04g4woko84gssww4so4oss.92.112.181.229.sslip.io/api/investments");
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchInvestments();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-800 shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4 text-white">Investment Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Date
              </th>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Investment Name
              </th>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Profit or Loss
              </th>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Description
              </th>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Amount
              </th>
              <th className="px-4 py-2 text-center text-lg font-bold text-black uppercase tracking-wider border border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-00 divide-y divide-gray-200">
            {investments.map((investment) => (
              <tr key={investment._id}>
                <td className="px-4 py-2 whitespace-nowrap font-bold border text-white text-center border-gray-200">
                  {new Date(investment.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap border font-bold text-white text-center border-gray-200">{investment.name}</td>
                <td className="px-4 py-2 whitespace-nowrap border font-bold text-white text-center uppercase border-gray-200">{investment.profitOrLoss}</td>
                <td className="px-4 py-2 whitespace-nowrap border font-bold text-white text-justify border-gray-200">{investment.description}</td>
                <td className="px-4 py-2 whitespace-nowrap border font-bold text-white text-center border-gray-200">$ {investment.amount.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap border font-bold border-gray-200">
                  <PDFDownloadLink
                    document={<MyDocument investment={investment} />}
                    fileName={`investment_${investment._id}.pdf`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {({ loading }) => (loading ? "Loading PDF..." : "Download PDF")}
                  </PDFDownloadLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
