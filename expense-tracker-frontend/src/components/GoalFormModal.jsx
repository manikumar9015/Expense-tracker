import { useState } from "react";
import { useSavingGoals } from "../context/SavingGoalsContext";

const GoalFormModal = ({ onClose }) => {
  const { addGoal } = useSavingGoals();
  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addGoal(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl w-11/12 max-w-sm border border-gray-700">
        <h2 className="text-xl font-bold mb-5 text-center">
          🎯 Set a New Goal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="goal_name"
            onChange={handleChange}
            placeholder="Goal Name"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            name="target_amount"
            onChange={handleChange}
            placeholder="Target Amount"
            type="number"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            name="deadline"
            onChange={handleChange}
            type="date"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex justify-center  pt-2">
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-700 px-16 py-2 rounded-lg text-white font-semibold transition cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-900 hover:bg-gray-700 px-16 py-2 rounded-lg text-white font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalFormModal;
