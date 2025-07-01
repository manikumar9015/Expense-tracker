import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SavingGoalsContext = createContext();

export const useSavingGoals = () => useContext(SavingGoalsContext);

export const SavingGoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchGoals = async () => {
    try {
      const res = await axios.get("http://localhost:8000/goals/", getAuthHeader());
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    }
  };

  const addGoal = async (goal) => {
    try {
      const res = await axios.post("http://localhost:8000/goals/", goal, getAuthHeader());
      setGoals((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add goal", err);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/goals/${id}`, getAuthHeader());
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <SavingGoalsContext.Provider value={{ goals, addGoal, deleteGoal }}>
      {children}
    </SavingGoalsContext.Provider>
  );
};
