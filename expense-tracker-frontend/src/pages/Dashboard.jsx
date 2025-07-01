import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import { useSavingGoals } from "../context/SavingGoalsContext";
import GoalFormModal from "../components/GoalFormModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CountUp from "react-countup";

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const { goals, deleteGoal } = useSavingGoals();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [summary, setSummary] = useState("Loading report summary...");

  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const net = income - expense;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 9);

  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const monthIncome = transactions
      .filter(
        (tx) =>
          new Date(tx.transaction_date).getMonth() === month &&
          tx.type === "income"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
    const monthExpense = transactions
      .filter(
        (tx) =>
          new Date(tx.transaction_date).getMonth() === month &&
          tx.type === "expense"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      month: new Date(0, month).toLocaleString("default", { month: "short" }),
      income: monthIncome,
      expense: monthExpense,
    };
  });

  const exportToCSV = () => {
    const ws = utils.json_to_sheet(recent);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "RecentTransactions");
    writeFile(wb, "recent_transactions.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Recent Transactions", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Description", "Amount", "Type", "Category", "Date"]],
      body: recent.map((tx) => [
        tx.description,
        `₹${tx.amount}`,
        tx.type,
        tx.category,
        tx.transaction_date,
      ]),
    });
    doc.save("recent_transactions.pdf");
  };

  const generateFullSummary = async () => {
    try {
      const payload = {
        transactions: transactions.map((tx) => ({
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          date: new Date(tx.transaction_date).toISOString().split("T")[0],
        })),
      };

      const res = await fetch("http://localhost:8000/reports/analyze-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSummary(data.summary || "No summary available.");
    } catch (err) {
      console.error("Summary fetch failed", err);
      setSummary("⚠️ Error generating summary.");
    }
  };

  // Refresh every 30s when transactions are loaded
  useEffect(() => {
    if (transactions.length === 0) return;

    generateFullSummary();

    const interval = setInterval(() => {
      generateFullSummary();
    }, 30000);

    return () => clearInterval(interval);
  }, [transactions]);

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="pt-20 px-6 pb-3 bg-gray-800 min-h-screen text-white">
        <h1 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200 text-transparent bg-clip-text inline-block">
          Hello, {user?.username} 👋
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-2">Total Income</h2>
            <p className="text-2xl text-green-400 font-bold">
              ₹
              <CountUp end={income} duration={1.5} separator="," decimals={2} />
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-2">Total Expense</h2>
            <p className="text-2xl text-red-400 font-bold">
              ₹
              <CountUp
                end={expense}
                duration={1.5}
                separator=","
                decimals={2}
              />
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-2">Net Balance</h2>
            <p
              className={`text-2xl font-bold ${
                net >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              ₹<CountUp end={net} duration={1.5} separator="," decimals={2} />
            </p>
          </div>
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Income vs Expense
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="income" fill="#34D399" />
                <Bar dataKey="expense" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <div className="space-x-2">
                <button
                  onClick={exportToCSV}
                  className="px-3 py-1 bg-black rounded hover:bg-gray-900 text-sm cursor-pointer"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-3 py-1 bg-black rounded hover:bg-gray-900 text-sm cursor-pointer"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => navigate("/transactions")}
                  className="px-3 py-1 bg-black rounded hover:bg-gray-900 text-sm cursor-pointer"
                >
                  Add Transaction
                </button>
              </div>
            </div>
            {recent.length === 0 ? (
              <p className="text-gray-400">No recent transactions.</p>
            ) : (
              <ul className="space-y-3">
                {recent.map((tx) => (
                  <li key={tx.id} className="flex justify-between">
                    <span className="text-gray-300">{tx.description}</span>
                    <span
                      className={
                        tx.type === "income" ? "text-green-400" : "text-red-400"
                      }
                    >
                      ₹{tx.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Saving Goals Section */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">🎯 Saving Goals</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-4 py-2 bg-black rounded hover:bg-gray-900 text-sm cursor-pointer"
            >
              + Add Goal
            </button>
          </div>
          {goals.length === 0 ? (
            <p className="text-gray-400">No saving goals added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => {
                const percent = Math.min((net / goal.target_amount) * 100, 100);
                return (
                  <div
                    key={goal.id}
                    className="bg-gray-700 p-4 rounded-lg shadow relative"
                  >
                    <h4 className="text-lg font-semibold">{goal.goal_name}</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      Target: ₹{goal.target_amount}
                    </p>
                    {goal.deadline && (
                      <p className="text-xs text-gray-400 mb-2">
                        Deadline: {goal.deadline}
                      </p>
                    )}
                    <div className="w-full bg-gray-600 h-3 rounded-full mb-2">
                      <div
                        className="h-3 bg-gray-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-sm text-white">
                      Progress: {percent.toFixed(0)}%
                    </p>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                    >
                      ✖
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report Summary Section */}
        <div className="mt-10">
          <div className="bg-gray-700 p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold mb-2">📊 Report Summary</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
            <p className="text-xs text-gray-500 mt-2">
              Auto-refreshes every 30s
            </p>
          </div>
        </div>
      </div>

      {showGoalModal && (
        <GoalFormModal onClose={() => setShowGoalModal(false)} />
      )}
    </>
  );
};

export default Dashboard;
