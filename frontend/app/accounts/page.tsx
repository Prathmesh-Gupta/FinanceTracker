"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);

  const { convertAmount, symbol } = useCurrency();

  // const API_URL = "http://localhost:8000/accounts/";
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/accounts/`;


  const loadAccounts = async () => {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const addAccount = async () => {
    if (!name || !type || !balance) {
      alert("Please fill all fields");
      return;
    }

    const numericBalance = parseFloat(balance);

    if (numericBalance < 0) {
      alert("Balance cannot be negative");
      return;
    }

    try {
      const url = new URL(API_URL);

      url.searchParams.append("name", name);
      url.searchParams.append("type", type);
      url.searchParams.append("balance", numericBalance.toString());

      const res = await fetch(url.toString(), {
        method: "POST",
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err);
        return;
      }

      setName("");
      setType("");
      setBalance("");

      await loadAccounts();
    } catch (err) {
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Accounts 🏦
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and track your financial accounts
          </p>
        </div>

        {/* Add Account Card */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl mb-10">
          <h2 className="text-xl font-semibold mb-5">
            Add New Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <input
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Account Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Saving">Saving</option>
              <option value="Current">Current</option>
              <option value="Credit">Credit</option>
            </select>

            <input
              className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Initial Balance"
              type="number"
              min="0"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>

          <button
            onClick={addAccount}
            className="mt-6 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition transform"
          >
            Add Account
          </button>
        </div>

        {/* Accounts List */}
        <div className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">
            Your Accounts
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">No accounts added yet 📭</p>
          ) : (
            <div className="divide-y">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 transition px-2 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {acc.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {acc.type}
                    </p>
                  </div>

                  <p className="font-semibold text-lg">
                    {symbol}{" "}
                    {convertAmount(Number(acc.balance || 0)).toLocaleString()}
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
