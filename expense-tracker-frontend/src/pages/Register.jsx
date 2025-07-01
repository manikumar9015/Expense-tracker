import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    is_admin: false,
  });

  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/register", form);
      nav("/login");
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handle}
        className="bg-gray-800 p-8 rounded-md shadow-lg w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded transition duration-200 cursor-pointer"
        >
          Register
        </button>

        {error && (
          <div className="text-red-400 text-sm mt-4">
            {Array.isArray(error.detail)
              ? error.detail.map((e, i) => <p key={i}>{e.msg}</p>)
              : <p>{error.detail || error}</p>}
          </div>
        )}

        <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
