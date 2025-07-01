import { useTransactions } from "../context/TransactionContext";
import { useState } from "react";

const TransactionItem = ({ tx }) => {
  const { deleteTransaction, updateTransaction } = useTransactions();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...tx });
  const [selected, setSelected] = useState(false);

  const amountClass =
    tx.type === "income" ? "text-emerald-400" : "text-rose-400";

  const handleUpdate = async () => {
    await updateTransaction(tx.id, editForm);
    setEditing(false);
  };

  return (
    <li
      className={`px-4 py-1 border rounded mb-2 shadow-sm transition-all duration-300 ease-in-out 
        ${selected ? "bg-gray-900" : "bg-gray-800"} 
        hover:bg-gray-900 hover:py-1.5 border-gray-700`}
      onClick={() => setSelected(!selected)}
    >
      <div className="flex justify-between items-center text-gray-100">
        {!editing ? (
          <>
            <div>
              <div className="font-medium">{tx.description}</div>
              <div className="text-sm text-gray-400">
                {tx.category} • {tx.type} •{" "}
                {new Date(tx.transaction_date).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`font-semibold text-lg ${amountClass}`}>
                ₹{tx.amount}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="text-indigo-400 border border-indigo-500 px-2 py-1 rounded hover:bg-indigo-600 hover:text-white transition"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTransaction(tx.id);
                }}
                className="text-red-400 border border-red-500 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-wrap items-center gap-2">
            <input
              className="bg-gray-900 text-gray-100 border border-gray-600 px-2 py-1 rounded w-24"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
            <input
              className="bg-gray-900 text-gray-100 border border-gray-600 px-2 py-1 rounded w-20"
              type="number"
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: e.target.value })
              }
            />
            <select
              className="bg-gray-900 text-gray-100 border border-gray-600 px-2 py-1 rounded"
              value={editForm.type}
              onChange={(e) =>
                setEditForm({ ...editForm, type: e.target.value })
              }
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              onClick={handleUpdate}
              className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TransactionItem;
