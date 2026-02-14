"use client";

import { useEffect, useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch("http://localhost:8000/goals")
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch goals", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 p-6 text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Goals 🎯
          </h1>
          <p className="text-gray-400 mt-1">
            Track your financial targets and milestones
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400 animate-pulse">
            Loading goals...
          </p>
        ) : goals.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-lg text-center">
            <p className="text-gray-300">
              No goals yet 🚀 Start planning your future!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white/95 text-black p-6 rounded-3xl shadow-2xl hover:scale-[1.02] transition transform"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {goal.title}
                </h2>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Target:</span>{" "}
                    ₹ {Number(goal?.target_amount ?? 0).toLocaleString("en-IN")}
                  </p>

                  <p>
                    <span className="font-medium">Deadline:</span>{" "}
                    {goal.target_date
                      ? new Date(goal.target_date).toLocaleDateString("en-IN")
                      : "No deadline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
