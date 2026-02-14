"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export default function InvestmentsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [recurrings, setRecurrings] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("Investment");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const { convertAmount, symbol } = useCurrency();

  const loadData = async () => {
    try {
      const [hRes, rRes, aRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/history`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/recurring/investments`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
          cache: "no-store",
        }),
      ]);

      setHistory(await hRes.json());
      setRecurrings(await rRes.json());
      setAccounts(await aRes.json());
    } catch (err) {
      console.error("Failed loading investments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const normalizeTitle = (value?: string) =>
    value?.replace(/^Auto:\s*/i, "").trim();

  const calculateAccumulatedByTitle = (planTitle: string) =>
    history
      .filter(
        (h) =>
          normalizeTitle(h.title) === planTitle ||
          normalizeTitle(h.notes) === planTitle
      )
      .reduce((sum, h) => sum + Math.abs(Number(h.amount)), 0);

  const totalInvestments = history
    .filter((h) => h.category === "Investment")
    .reduce((sum, h) => sum + Math.abs(Number(h.amount)), 0);

  const totalSavings = history
    .filter((h) => h.category === "Savings" || h.category === "Saving")
    .reduce((sum, h) => sum + Math.abs(Number(h.amount)), 0);

  const addRecurring = async () => {
    const numericAmount = Math.abs(Number(amount));

    if (!title.trim()) return alert("Title is required");
    if (!numericAmount || numericAmount <= 0)
      return alert("Amount must be greater than 0");
    if (!nextDate) return alert("Please select next due date");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recurring/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount: -numericAmount,
        category,
        account_id: accountId || null,
        next_due_date: nextDate,
        start_date: nextDate,
      }),
    });

    setTitle("");
    setAmount("");
    setNextDate("");
    setAccountId("");
    setCategory("Investment");
    loadData();
  };

  const saveEdit = async (txnId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recurring/${txnId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editData.title,
        amount: -Math.abs(Number(editData.amount)),
        next_due_date: editData.next_due_date,
        category: editData.category,
        account_id: editData.account_id || null,
      }),
    });

    setEditingId(null);
    setEditData({});
    loadData();
  };

  const deleteRecurring = async (txnId: string) => {
    if (!confirm("Delete this recurring plan?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recurring/${txnId}`, {
      method: "DELETE",
    });
    loadData();
  };

  const resolveDate = (item: any) =>
    item.date ||
    item.transaction_date ||
    item.created_at ||
    item.timestamp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10">
          Investments & Savings 💰
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SummaryCard title="Total Investments" value={totalInvestments} />
          <SummaryCard title="Total Savings" value={totalSavings} />
        </div>

        <div className="bg-white text-black p-6 rounded-3xl shadow-2xl mb-10">
          <h2 className="text-xl font-semibold mb-6">Add Plan ➕</h2>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              placeholder="Title"
              className="border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              className="border rounded px-3 py-2"
              value={amount}
              onKeyDown={(e) => e.key === "-" && e.preventDefault()}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="date"
              className="border rounded px-3 py-2"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />

            <select
              className="border rounded px-3 py-2"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Investment">Investment</option>
              <option value="Saving">Saving</option>
            </select>

            <button
              onClick={addRecurring}
              className="bg-black text-white rounded px-4 py-2 hover:bg-gray-900"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white text-black p-6 rounded-3xl shadow-2xl mb-10">
          <h2 className="text-xl font-semibold mb-6">Active Plans 🔁</h2>

          <div className="divide-y">
            {recurrings.map((txn) => (
              <div
                key={txn.id}
                className="grid grid-cols-1 md:grid-cols-12 items-center py-4 gap-4"
              >
                <div className="md:col-span-5">
                  <p className="font-semibold">{txn.title}</p>
                  <p className="text-sm text-gray-500">
                    Next: {new Date(txn.next_due_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">{txn.category}</p>
                </div>

                <div className="md:col-span-3 text-left md:text-right">
                  <p className="font-semibold">
                    {symbol}{" "}
                    {convertAmount(
                      Math.abs(Number(txn.amount))
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600">
                    Accumulated {symbol}{" "}
                    {convertAmount(
                      calculateAccumulatedByTitle(txn.title)
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="md:col-span-4 flex justify-start md:justify-end">
                  {editingId === txn.id ? (
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            title: e.target.value,
                          })
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="border rounded px-2 py-1 text-sm w-24"
                        value={editData.amount}
                        onKeyDown={(e) =>
                          e.key === "-" && e.preventDefault()
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            amount: e.target.value,
                          })
                        }
                      />

                      <input
                        type="date"
                        className="border rounded px-2 py-1 text-sm"
                        value={editData.next_due_date}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            next_due_date: e.target.value,
                          })
                        }
                      />

                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={editData.category}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Investment">Investment</option>
                        <option value="Saving">Saving</option>
                      </select>

                      <button
                        onClick={() => saveEdit(txn.id)}
                        className="text-green-600 font-semibold"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setEditingId(txn.id);
                          setEditData({
                            title: txn.title,
                            amount: Math.abs(Number(txn.amount)),
                            next_due_date: txn.next_due_date,
                            category: txn.category,
                            account_id: txn.account_id,
                          });
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteRecurring(txn.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white text-black p-6 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold mb-6">History 📜</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="divide-y">
              {history.map((item) => {
                const resolvedDate = resolveDate(item);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 md:grid-cols-3 py-3 items-center text-sm"
                  >
                    <p className="font-medium">
                      {item.title || item.notes || item.category}
                    </p>

                    <p className="text-gray-500 text-left md:text-center">
                      {resolvedDate
                        ? new Date(resolvedDate).toLocaleDateString()
                        : "-"}
                    </p>

                    <p className="font-semibold text-right">
                      {symbol}{" "}
                      {convertAmount(
                        Math.abs(Number(item.amount))
                      ).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  const { convertAmount, symbol } = useCurrency();

  return (
    <div className="bg-white/10 p-6 rounded-3xl">
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-2xl font-bold">
        {symbol} {convertAmount(value).toLocaleString()}
      </p>
    </div>
  );
}
