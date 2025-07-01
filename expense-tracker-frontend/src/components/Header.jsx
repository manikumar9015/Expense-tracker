import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white py-3 fixed top-0 w-full z-50 shadow">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo on the left */}
        <div className="text-lg font-semibold">
          <Link to="/" className="hover:text-gray-300">
            💸 Expenso
          </Link>
        </div>

        {/* Centered links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="hover:bg-gray-800 px-3 py-2 rounded transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="hover:bg-gray-800 px-3 py-2 rounded transition duration-200"
          >
            Transactions
          </Link>
          <Link
            to="/reports"
            className="hover:bg-gray-800 px-3 py-2 rounded transition duration-200"
          >
            Reports
          </Link>
        </div>

        {/* Logout on the right */}
        <div>
          {user && (
            <button
              onClick={logout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
