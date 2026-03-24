import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bot, BookOpen, Bookmark, LogOut, Menu, Moon, Shield, Sun, Wallet, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

function NavLink({ to, children, activePath }) {
  const isActive = activePath === to;

  return (
    <Link
      to={to}
      className={`relative text-[15px] font-semibold transition-colors ${
        isActive
          ? "text-indigo-600 dark:text-cyan-400"
          : "text-slate-body hover:text-indigo-500 dark:text-gray-400 dark:hover:text-cyan-400"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all ${
          isActive
            ? "w-full bg-indigo-500 dark:bg-cyan-400"
            : "w-0 bg-indigo-500 group-hover:w-full dark:bg-cyan-400"
        }`}
      />
    </Link>
  );
}

function Navbar() {
  const { appContext, isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const authLinks = [
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/portfolio", label: "Portfolio", icon: Wallet },
    { to: "/watchlist", label: "Watchlist", icon: Bookmark },
    { to: "/chatbot", label: "Chatbot", icon: Bot },
    ...(user?.role === "admin"
      ? [{ to: "/admin", label: "Admin", icon: Shield }]
      : []),
  ];

  const watchlistCount = appContext?.watchlist?.count || 0;

  return (
    <div className="fixed left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        ref={menuRef}
        className={`mx-auto max-w-7xl rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? "border-dark-border/30 bg-dark-surface/75 shadow-dark-nav"
            : "border-slate-border/50 bg-white/75 shadow-nav"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center">
            <Logo variant="abbreviated" size="sm" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" activePath={location.pathname}>
              Home
            </NavLink>
            <NavLink to="/community" activePath={location.pathname}>
              Community
            </NavLink>

            {isAuthenticated &&
              authLinks.map((link) => (
                <div key={link.to} className="relative">
                  <NavLink to={link.to} activePath={location.pathname}>
                    {link.label}
                  </NavLink>
                  {link.to === "/watchlist" && watchlistCount > 0 && (
                    <span
                      className={`absolute -right-4 -top-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isDark
                          ? "bg-cyan-400/15 text-cyan-300"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {watchlistCount}
                    </span>
                  )}
                </div>
              ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                isDark
                  ? "border-dark-border bg-dark-elevated text-cyan-400 hover:bg-dark-highest"
                  : "border-slate-border bg-surface-subtle text-slate-muted hover:bg-indigo-50 hover:text-indigo-500"
              }`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="group text-right">
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? "text-gray-500 group-hover:text-cyan-400" : "text-slate-muted group-hover:text-indigo-500"
                    }`}
                  >
                    {user?.role}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      isDark ? "text-gray-100 group-hover:text-cyan-400" : "text-slate-heading group-hover:text-indigo-500"
                    }`}
                  >
                    {user?.name}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                    isDark
                      ? "border-dark-border bg-dark-elevated text-gray-400 hover:border-red-500/30 hover:bg-red-900/20 hover:text-red-400"
                      : "border-slate-border bg-surface-subtle text-slate-muted hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                  }`}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-bold transition-colors ${
                    isDark ? "text-gray-300 hover:text-cyan-400" : "text-slate-body hover:text-indigo-500"
                  }`}
                >
                  Log In
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isDark
                  ? "border-dark-border bg-dark-elevated text-cyan-400"
                  : "border-slate-border bg-surface-subtle text-slate-muted"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isDark
                  ? "border-dark-border bg-dark-elevated text-gray-300"
                  : "border-slate-border bg-surface-subtle text-slate-body"
              }`}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`border-t px-5 py-5 md:hidden ${
              isDark ? "border-dark-border/30 bg-dark-card/95" : "border-slate-border/50 bg-white/95"
            }`}
          >
            <div className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/community", label: "Community" },
                ...(isAuthenticated
                  ? authLinks.map(({ to, label }) => ({ to, label }))
                  : [
                      { to: "/login", label: "Log In" },
                      { to: "/register", label: "Get Started" },
                    ]),
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block rounded-xl px-3 py-2 text-sm font-semibold ${
                    location.pathname === link.to
                      ? isDark
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-indigo-50 text-indigo-700"
                      : isDark
                      ? "text-gray-300 hover:bg-dark-elevated"
                      : "text-slate-body hover:bg-surface-subtle"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/50 bg-surface-subtle"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                      {user?.role}
                    </p>
                    <p className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-slate-heading"}`}>
                      {user?.name}
                    </p>
                  </div>
                  <Link to="/profile" className="btn-outline px-4 py-2 text-xs">
                    Profile
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className={`mt-4 w-full rounded-xl border py-2.5 text-sm font-bold transition-all ${
                    isDark
                      ? "border-red-500/20 bg-red-900/20 text-red-400 hover:bg-red-900/30"
                      : "border-danger/20 bg-danger/10 text-danger hover:bg-danger hover:text-white"
                  }`}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
