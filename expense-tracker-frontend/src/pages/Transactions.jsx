import Header from "../components/Header";
import TransactionItem from "../components/TransactionItem";
import { useTransactions } from "../context/TransactionContext";
import { useState, useMemo } from "react";

const Transactions = () => {
  const { transactions, addTransaction } = useTransactions();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    transaction_date: "",
  });

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    from: "",
    to: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.category || !form.transaction_date) {
      alert("Please fill in all fields");
      return;
    }

    await addTransaction(form);
    setForm({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      transaction_date: "",
    });
  };

  const uniqueCategories = useMemo(() => {
    const cats = transactions.map(tx => tx.category).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = filters.type === "all" || tx.type === filters.type;
      const matchesCategory = filters.category === "all" || tx.category === filters.category;
      const matchesFrom = !filters.from || new Date(tx.transaction_date) >= new Date(filters.from);
      const matchesTo = !filters.to || new Date(tx.transaction_date) <= new Date(filters.to);
      return matchesType && matchesCategory && matchesFrom && matchesTo;
    });
  }, [transactions, filters]);

  const incomeTotal = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }, [filteredTransactions]);

  const expenseTotal = useMemo(() => {
    return filteredTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }, [filteredTransactions]);

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-800 py-6 pt-20 px-6 space-x-8 text-gray-100">
        {/* Form - 1/3 width */}
        <div className="w-1/3 bg-gray-700 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="transaction_date"
              type="date"
              value={form.transaction_date}
              onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-200"
            >
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transaction list - 2/3 width */}
        <div className="w-2/3 bg-gray-700 p-6 rounded-xl shadow">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded-md"
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded-md"
            />
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2 rounded-md"
            />

            <button
              onClick={() =>
                setFilters({ type: "all", category: "all", from: "", to: "" })
              }
              className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-500 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Transaction list */}
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400 italic">No transactions found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTransactions.map((tx) => (
                <TransactionItem key={tx.id} tx={tx} />
              ))}
            </ul>
          )}

          {/* Totals */}
          <div className="mt-6 flex justify-between border-t border-gray-600 pt-4">
            <div className="text-green-400 font-medium">
              Total Income: ₹{incomeTotal.toFixed(2)}
            </div>
            <div className="text-red-400 font-medium">
              Total Expense: ₹{expenseTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
