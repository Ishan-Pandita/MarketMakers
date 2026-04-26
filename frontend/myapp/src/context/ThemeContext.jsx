/* eslint-disable react-refresh/only-export-components */
// src/context/ThemeContext.jsx -- Dark/Light Theme Toggle
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem("mm-theme");
    if (stored === "dark" || stored === "light") return stored;
    // Fall back to system preference
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("mm-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (t) => {
    if (t === "dark" || t === "light") setThemeState(t);
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
