import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      nav("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form
        onSubmit={handle}
        className="bg-gray-800 p-8 rounded-md shadow-lg w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && (
          <p className="mb-4 text-red-400 text-sm text-center">{error}</p>
        )}

        <input
          name="username"
          placeholder="Username"
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
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
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded transition duration-200 cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
