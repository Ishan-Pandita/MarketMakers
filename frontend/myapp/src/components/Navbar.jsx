// src/components/Navbar.jsx — Dual Theme with Theme Toggle
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Briefcase, BarChart3, Bot, Rocket, Shield, LogOut, Menu, X, ChevronDown } from "lucide-react";
import Logo from "./Logo";

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-slate-body dark:text-gray-400 hover:text-indigo-500 dark:hover:text-cyan-400 font-semibold transition-colors relative group text-[15px]"
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-indigo-500 dark:bg-cyan-400 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
    </Link>
  );
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [finDropdownOpen, setFinDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFinDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toolItems = [
    { icon: Briefcase, name: "My Portfolio", path: "/portfolio" },
    { icon: BarChart3, name: "Dashboard", path: "/portfolio/dashboard" },
    { icon: Bot, name: "AI Chatbot", path: "/chatbot" },
    { icon: Rocket, name: "Simulator", path: "/simulator" },
    ...(user?.role === "admin" ? [{ icon: Shield, name: "Admin Panel", path: "/admin" }] : []),
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 fixed top-0 left-0 w-full z-50">
      <nav className={`mx-auto max-w-7xl rounded-2xl backdrop-blur-xl border shadow-nav transition-all duration-500 hover:shadow-elevated ${
        isDark
          ? 'bg-dark-surface/70 border-dark-border/30 shadow-dark-nav hover:shadow-dark-elevated'
          : 'bg-white/70 border-slate-border/50'
      }`}>
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <Logo variant="abbreviated" size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/community">Community</NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink to="/courses">Courses</NavLink>
                  <NavLink to="/exams">Exams</NavLink>

                  {/* Financial Tools Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setFinDropdownOpen(!finDropdownOpen)}
                      className="text-slate-body dark:text-gray-400 hover:text-indigo-500 dark:hover:text-cyan-400 font-semibold transition-colors relative group text-[15px] flex items-center gap-1"
                    >
                      AI Tools
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${finDropdownOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-indigo-500 dark:bg-cyan-400 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
                    </button>
                    {finDropdownOpen && (
                      <div className={`absolute top-full mt-3 -left-4 w-56 backdrop-blur-xl rounded-xl border overflow-hidden animate-slideDown z-50 ${
                        isDark
                          ? 'bg-dark-card/95 border-dark-border/40 shadow-dark-elevated'
                          : 'bg-white/95 border-slate-border/50 shadow-elevated'
                      }`}>
                        {toolItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setFinDropdownOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                              isDark
                                ? 'text-gray-300 hover:bg-dark-elevated hover:text-cyan-400'
                                : 'text-slate-body hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <NavLink to="/profile">Profile</NavLink>

                  <div className={`flex items-center gap-3 ml-4 pl-6 border-l ${isDark ? 'border-dark-border' : 'border-slate-border'}`}>
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isDark
                          ? 'bg-dark-elevated border border-dark-border text-cyan-400 hover:bg-dark-highest hover:text-cyan-300'
                          : 'bg-surface-subtle border border-slate-border text-slate-muted hover:bg-indigo-50 hover:text-indigo-500'
                      }`}
                      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <Link to="/profile" className="group flex flex-col items-end">
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 transition-colors ${
                        isDark ? 'text-gray-500 group-hover:text-cyan-400' : 'text-slate-muted group-hover:text-indigo-500'
                      }`}>
                        {user?.role}
                      </div>
                      <div className={`text-sm font-bold transition-colors ${
                        isDark ? 'text-gray-200 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'
                      }`}>
                        {user?.name}
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        isDark
                          ? 'bg-dark-elevated border-dark-border text-gray-400 hover:bg-red-900/30 hover:border-red-500/30 hover:text-red-400'
                          : 'bg-surface-subtle border-slate-border text-slate-muted hover:bg-danger-light hover:border-danger/30 hover:text-danger'
                      }`}
                      title="Sign Out"
                    >
                      <LogOut className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Theme Toggle for unauthenticated */}
                  <button
                    onClick={toggleTheme}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDark
                        ? 'bg-dark-elevated border border-dark-border text-cyan-400 hover:bg-dark-highest hover:text-cyan-300'
                        : 'bg-surface-subtle border border-slate-border text-slate-muted hover:bg-indigo-50 hover:text-indigo-500'
                    }`}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <Link
                    to="/login"
                    className={`text-sm font-bold transition-all ${
                      isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-slate-body hover:text-indigo-500'
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all ${
                      isDark
                        ? 'bg-cyan-400 text-dark-bg hover:bg-cyan-300 shadow-glow-cyan'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-soft hover:shadow-glow-indigo'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-dark-elevated border border-dark-border text-cyan-400'
                    : 'bg-surface-subtle border border-slate-border text-slate-muted'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  isDark
                    ? 'bg-dark-elevated border-dark-border text-gray-300 hover:text-cyan-400'
                    : 'bg-surface-subtle border-slate-border text-slate-body hover:text-indigo-500'
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden backdrop-blur-xl border-t rounded-b-2xl overflow-hidden animate-slideDown ${
            isDark
              ? 'bg-dark-card/95 border-dark-border/30'
              : 'bg-white/95 border-slate-border/50'
          }`}>
            <div className="px-6 py-6 space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Community', path: '/community' },
                ...(isAuthenticated ? [
                  { name: 'Courses', path: '/courses' },
                  { name: 'Exams', path: '/exams' },
                  { name: 'Portfolio', path: '/portfolio' },
                  { name: 'Dashboard', path: '/portfolio/dashboard' },
                  { name: 'AI Chatbot', path: '/chatbot' },
                  { name: 'Simulator', path: '/simulator' },
                  { name: 'Profile', path: '/profile' }
                ] : [
                  { name: 'Log In', path: '/login' },
                  { name: 'Get Started', path: '/register' }
                ])
              ].map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-bold transition-all ${
                    isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-slate-body hover:text-indigo-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <div className={`pt-4 border-t ${isDark ? 'border-dark-border/50' : 'border-slate-border/50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>{user?.role}</p>
                      <p className={`text-base font-bold ${isDark ? 'text-gray-200' : 'text-slate-heading'}`}>{user?.name}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-indigo-50 text-indigo-500'
                    }`}>
                      {user?.name?.[0] || "U"}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`w-full border py-3 rounded-xl text-sm font-bold transition-all ${
                      isDark
                        ? 'bg-red-900/20 border-red-500/20 text-red-400 hover:bg-red-900/40'
                        : 'bg-danger-light border-danger/20 text-danger hover:bg-danger hover:text-white'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
