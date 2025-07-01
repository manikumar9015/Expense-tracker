
// // context/TransactionContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import API from "../services/api";

// const TransactionContext = createContext();

// export const TransactionProvider = ({ children }) => {
//   const [transactions, setTransactions] = useState([]);

//   const fetchTransactions = async () => {
//     try {
//       const res = await API.get("/transactions");
//       setTransactions(res.data);
//     } catch (error) {
//       console.error("Fetch transactions failed", error);
//     }
//   };

//   const addTransaction = async (data) => {
//     await API.post("/transactions", data);
//     fetchTransactions();
//   };

//   const deleteTransaction = async (id) => {
//     try {
//       await API.delete(`/transactions/${id}`);
//       fetchTransactions();
//     } catch (error) {
//       console.error("Delete transaction failed", error);
//     }
//   };

//   const updateTransaction = async (id, data) => {
//     try {
//       await API.put(`/transactions/${id}`, data);
//       fetchTransactions();
//     } catch (error) {
//       console.error("Update transaction failed", error);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   return (
//     <TransactionContext.Provider
//       value={{ transactions, addTransaction, deleteTransaction, updateTransaction }}
//     >
//       {children}
//     </TransactionContext.Provider>
//   );
// };

// export const useTransactions = () => useContext(TransactionContext);


//---------------------------------------------------------------------------------------------

import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Fetch transactions failed", error);
    }
  };

  const addTransaction = async (data) => {
    try {
      // Force lowercase type
      const payload = {
        ...data,
        type: data.type.toLowerCase(),
      };
      const res = await API.post("/transactions", payload);
      setTransactions((prev) => [...prev, res.data]); // Optimistic update
    } catch (error) {
      console.error("Add transaction failed", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error("Delete transaction failed", error);
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const payload = {
        ...data,
        type: data.type.toLowerCase(),
      };
      const res = await API.put(`/transactions/${id}`, payload);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? res.data : tx))
      );
    } catch (error) {
      console.error("Update transaction failed", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);

