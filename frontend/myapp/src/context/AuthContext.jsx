// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user from token on mount
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Check if token has expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.warn("Token expired, logging out");
          logout();
          setLoading(false);
          return;
        }

        // Set basic user from token, then fetch full profile
        setUser({
          id: payload.id,
          role: payload.role,
        });

        // Fetch full user profile to get name/email
        API.get("/auth/me")
          .then((res) => {
            setUser(res.data);
          })
          .catch(() => {
            // Token might be invalid, keep basic info
          })
          .finally(() => setLoading(false));
        return;
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (
    name,
    email,
    password,
    role = "learner",
    experience,
    reason
  ) => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
        experience,
        reason,
      });
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
