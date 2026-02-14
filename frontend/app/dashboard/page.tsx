"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { currency, convertAmount, symbol } = useCurrency();

  const [summary, setSummary] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      // const [sRes, bRes, tRes, rRes] = await Promise.all([
      //   fetch("http://localhost:8000/dashboard/summary", { cache: "no-store" }),
      //   fetch("http://localhost:8000/dashboard/category-breakdown", { cache: "no-store" }),
      //   fetch("http://localhost:8000/dashboard/monthly-trend", { cache: "no-store" }),
      //   fetch("http://localhost:8000/dashboard/recent", { cache: "no-store" }),
      // ]);
      const [sRes, bRes, tRes, rRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/category-breakdown`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/monthly-trend`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recent`, { cache: "no-store" }),
      ]);


      setSummary(await sRes.json());
      setBreakdown(await bRes.json());
      setTrend(await tRes.json());
      setRecent(await rRes.json());
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#eab308",
    "#a855f7",
    "#14b8a6",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Finance Dashboard 📊
          </h1>
          <p className="text-gray-400 mt-1">
            Overview of your financial performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card title="Total Balance" value={convertAmount(summary?.total_balance || 0)} highlight symbol={symbol} />
          <Card title="Monthly Spend" value={convertAmount(summary?.monthly_spend || 0)} symbol={symbol} />
          <Card title="Investments" value={convertAmount(summary?.monthly_investment || 0)} symbol={symbol} />
          <Card title="Savings" value={convertAmount(summary?.monthly_savings || 0)} symbol={symbol} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Pie Chart */}
          <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Spending Breakdown 🧾
            </h2>

            <div className="h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={breakdown.map(item => ({
                      ...item,
                      total: convertAmount(item.total)
                    }))}
                    dataKey="total"
                    nameKey="category"
                    outerRadius={110}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {breakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      `${symbol} ${Number(value).toLocaleString()}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Spending Trend 📈
            </h2>

            <div className="h-80">
              <ResponsiveContainer>
                <LineChart
                  data={trend.map(item => ({
                    ...item,
                    total: convertAmount(item.total)
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) =>
                      `${symbol} ${Number(value).toLocaleString()}`
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">
            Recent Transactions ⏳
          </h2>

          {recent.length === 0 ? (
            <p className="text-gray-500">No recent transactions</p>
          ) : (
            <div className="divide-y">
              {recent.map((txn: any) => (
                <div
                  key={txn.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition rounded-lg px-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {txn.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.expense_date).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="font-semibold text-red-600 text-lg">
                    {symbol} {Math.abs(convertAmount(Number(txn.amount))).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Card({
  title,
  value,
  highlight,
  symbol,
}: {
  title: string;
  value: number;
  highlight?: boolean;
  symbol: string;
}) {
  return (
    <div
      className={`p-6 rounded-3xl shadow-xl backdrop-blur-lg transition transform hover:scale-[1.02]
      ${
        highlight
          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          : "bg-white/10 text-white"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-2">
        {symbol} {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}
