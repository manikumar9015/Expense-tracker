import { useState } from "react";
import Header from "../components/Header";
import { useTransactions } from "../context/TransactionContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const { transactions } = useTransactions();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState(null);
  const [filteredTxs, setFilteredTxs] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateStats = (txns) => {
    const totalIncome = txns
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = txns
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) return alert("Please select both dates.");

    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.transaction_date);
      return txDate >= new Date(startDate) && txDate <= new Date(endDate);
    });

    setFilteredTxs(filtered);

    if (filtered.length === 0) {
      setSummary("No transactions found in selected range.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        transactions: filtered.map((tx) => ({
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          date: new Date(tx.transaction_date).toISOString().split("T")[0],
        })),
      };

      console.log("Sending payload to backend:", payload);

      const res = await fetch("http://localhost:8000/reports/analyze-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setSummary(`Error: ${data.detail || "Unable to generate report"}`);
      }
    } catch (error) {
      console.error(error);
      setSummary("An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 16);
    doc.text("Summary:", 14, 28);
    doc.text(summary || "", 14, 36, { maxWidth: 180 });

    const stats = calculateStats(filteredTxs);

    autoTable(doc, {
      startY: 60,
      head: [["Metric", "Value"]],
      body: [
        ["Total Income", `₹${stats.totalIncome.toFixed(2)}`],
        ["Total Expense", `₹${stats.totalExpense.toFixed(2)}`],
        ["Net Balance", `₹${stats.netBalance.toFixed(2)}`],
      ],
    });

    doc.save("financial_report.pdf");
  };

  return (
    <>
      <Header />
      <div className="pt-20 px-6 min-h-screen bg-gray-800 text-white">
        <h1 className="text-2xl font-semibold mb-4">📊 Reports</h1>
        <p className="text-gray-400 mb-6">
          Select a date range to generate a detailed financial report.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 px-3 py-2 rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded shadow cursor-pointer"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Report Output */}
        {summary && (
          <div className="bg-gray-700 p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">📄 Report</h2>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">📝 Summary</h3>
              <p className="text-gray-200 whitespace-pre-wrap mt-2">{summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mt-4">📈 Calculated Stats</h3>
              <ul className="mt-2 space-y-1 text-gray-300">
                {(() => {
                  const { totalIncome, totalExpense, netBalance } = calculateStats(filteredTxs);
                  return (
                    <>
                      <li className="flex justify-between">
                        <span>Total Income</span>
                        <span>₹{totalIncome.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Total Expense</span>
                        <span>₹{totalExpense.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Net Balance</span>
                        <span>₹{netBalance.toFixed(2)}</span>
                      </li>
                    </>
                  );
                })()}
              </ul>
            </div>

            <button
              onClick={exportToPDF}
              className="mt-6 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded cursor-pointer"
            >
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;
