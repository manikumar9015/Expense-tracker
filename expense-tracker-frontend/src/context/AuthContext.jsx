// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const res = await axios.post("http://localhost:8000/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    localStorage.setItem("token", res.data.access_token);
    setUser({ username });
  };

  const register = async (userData) => {
    await axios.post("http://localhost:8000/auth/register", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setUser(null);
  // };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          "http://localhost:8000/logout", // ✅ replace with your actual API URL
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Clear client state after successful logout
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, still clear the local user state
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
