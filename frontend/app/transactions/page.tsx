"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Currency context
  const { convertAmount, symbol } = useCurrency();

  const loadTransactions = async () => {
    try {
      // const res = await fetch("http://localhost:8000/expenses");
      const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/expenses`,
      { cache: "no-store" }
    );
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (!categoryFilter) {
      setFiltered(transactions);
    } else {
      setFiltered(
        transactions.filter((txn) =>
          txn.category?.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      );
    }
  }, [categoryFilter, transactions]);

  const sortedTransactions = [...filtered].sort(
    (a, b) =>
      new Date(b.expense_date).getTime() -
      new Date(a.expense_date).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Transactions 📜
          </h1>
          <p className="text-gray-400 mt-1">
            View and filter your complete transaction history
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl mb-10">
          <div className="flex flex-col md:flex-row gap-4">

            <input
              className="border border-gray-300 p-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Filter by category..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />

            <button
              onClick={() => setCategoryFilter("")}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl hover:scale-105 transition transform"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">
            Transaction History
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">
              Loading transactions...
            </p>
          ) : sortedTransactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions found 📭
            </p>
          ) : (
            <div className="divide-y">
              {sortedTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition px-2 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {txn.title || txn.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      {txn.category}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(txn.expense_date).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="font-semibold text-red-600 text-lg">
                    {symbol}{" "}
                    {convertAmount(
                      Number(txn.amount)
                    ).toLocaleString()}
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
