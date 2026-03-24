/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

import API from "../services/api";

const AuthContext = createContext(null);

const decodeTokenPayload = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [appContext, setAppContext] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAppContext(null);
  };

  const refreshUser = async () => {
    const res = await API.get("/auth/me");
    setUser(res.data);
    return res.data;
  };

  const refreshAppContext = async () => {
    const res = await API.get("/auth/me/context");
    setAppContext(res.data);
    return res.data;
  };

  useEffect(() => {
    const hydrateAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = decodeTokenPayload(token);

      if (!payload?.id) {
        clearAuthState();
        setLoading(false);
        return;
      }

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        clearAuthState();
        setLoading(false);
        return;
      }

      setUser((currentUser) => ({
        ...(currentUser || {}),
        id: payload.id,
        role: payload.role,
      }));

      try {
        await Promise.all([refreshUser(), refreshAppContext()]);
      } catch (error) {
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    hydrateAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
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

  const updateUser = (nextUser) => {
    setUser((currentUser) => ({
      ...(currentUser || {}),
      ...(nextUser || {}),
    }));

    setAppContext((currentContext) =>
      currentContext
        ? {
            ...currentContext,
            user: {
              ...(currentContext.user || {}),
              ...(nextUser || {}),
            },
          }
        : currentContext
    );
  };

  const completeOnboarding = async (payload) => {
    const res = await API.post("/auth/complete-onboarding", payload);
    updateUser(res.data.user);
    await refreshAppContext();
    return res.data;
  };

  const logout = () => {
    clearAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        appContext,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        updateUser,
        refreshUser,
        refreshAppContext,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
