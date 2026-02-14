"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export default function ExpensesPage() {
  const { convertAmount, symbol } = useCurrency();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");

  const loadData = async () => {
    try {
      // const [eRes, aRes] = await Promise.all([
      //   fetch("http://localhost:8000/expenses/", { cache: "no-store" }),
      //   fetch("http://localhost:8000/accounts/", { cache: "no-store" }),
      // ]);
      const [eRes, aRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/`, { cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/`, { cache: "no-store" }),
      ]);


      const eData = await eRes.json();
      const aData = await aRes.json();

      setExpenses(Array.isArray(eData) ? eData : []);
      setAccounts(Array.isArray(aData) ? aData : []);

      if (Array.isArray(aData) && aData.length > 0 && !selectedAccount) {
        setSelectedAccount(aData[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addExpense = async () => {
    if (!amount || !category || !selectedAccount) {
      alert("Please fill all required fields");
      return;
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount greater than 0");
      return;
    }

    const account = accounts.find(
      (acc) => acc.id.toString() === selectedAccount.toString()
    );

    if (!account) {
      alert("Invalid account selected");
      return;
    }

    const accountBalance = parseFloat(account.balance);

    if (numericAmount > accountBalance) {
      alert("Insufficient account balance");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const url = new URL("http://localhost:8000/expenses/");
      url.searchParams.append("amount", numericAmount.toString());
      url.searchParams.append("category", category);
      url.searchParams.append("payment_method", "cash");
      url.searchParams.append("expense_date", today);
      url.searchParams.append("notes", notes);
      url.searchParams.append("account_id", selectedAccount);

      const res = await fetch(url.toString(), {
        method: "POST",
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err);
        return;
      }

      setAmount("");
      setCategory("");
      setNotes("");

      await loadData();
    } catch {
      alert("Server not reachable");
    }
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) =>
      new Date(b.expense_date || 0).getTime() -
      new Date(a.expense_date || 0).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Expenses 💸
          </h1>
          <p className="text-gray-400 mt-1">
            Track and manage your spending
          </p>
        </div>

        {/* Add Expense */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl mb-10">
          <h2 className="text-xl font-semibold mb-5">
            Add New Expense
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <input
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <select
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (
                  {symbol}{" "}
                  {convertAmount(Number(acc.balance)).toLocaleString()}
                  )
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addExpense}
            className="mt-6 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition transform"
          >
            Add Expense
          </button>
        </div>

        {/* Expense History */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">
            Expense History
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading expenses...</p>
          ) : sortedExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet 📭</p>
          ) : (
            <div className="divide-y">
              {sortedExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition px-2 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {exp.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(exp.expense_date).toLocaleDateString()}
                    </p>
                    {exp.notes && (
                      <p className="text-xs text-gray-400 mt-1">
                        {exp.notes}
                      </p>
                    )}
                  </div>

                  <p className="font-semibold text-red-600 text-lg">
                    {symbol}{" "}
                    {convertAmount(Number(exp.amount)).toLocaleString()}
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
