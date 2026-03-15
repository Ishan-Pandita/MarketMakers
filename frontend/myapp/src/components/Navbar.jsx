// src/components/Navbar.jsx — Light Theme
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Logo from "./Logo";

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-slate-body hover:text-indigo-500 font-semibold transition-colors relative group text-[15px]"
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-indigo-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
    </Link>
  );
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto max-w-7xl rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-border/50 shadow-nav transition-all duration-500 hover:shadow-elevated">
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
                  <NavLink to="/profile">Profile</NavLink>

                  <div className="flex items-center gap-4 ml-4 pl-6 border-l border-slate-border">
                    <Link to="/profile" className="group flex flex-col items-end">
                      <div className="text-[10px] font-bold text-slate-muted uppercase tracking-wider mb-0.5 group-hover:text-indigo-500 transition-colors">
                        {user?.role}
                      </div>
                      <div className="text-sm font-bold text-slate-heading group-hover:text-indigo-500 transition-colors">
                        {user?.name}
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-10 h-10 rounded-xl bg-surface-subtle border border-slate-border text-slate-muted hover:bg-danger-light hover:border-danger/30 hover:text-danger flex items-center justify-center transition-all duration-300"
                      title="Sign Out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-body hover:text-indigo-500 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 shadow-soft hover:shadow-glow-indigo hover:-translate-y-0.5 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-subtle border border-slate-border flex items-center justify-center text-slate-body hover:text-indigo-500 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-border/50 rounded-b-2xl overflow-hidden animate-slideDown">
            <div className="px-6 py-6 space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Community', path: '/community' },
                ...(isAuthenticated ? [
                  { name: 'Courses', path: '/courses' },
                  { name: 'Exams', path: '/exams' },
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
                  className="block py-2 text-lg font-bold text-slate-body hover:text-indigo-500 transition-all"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <div className="pt-4 border-t border-slate-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-muted uppercase tracking-wider">{user?.role}</p>
                      <p className="text-base font-bold text-slate-heading">{user?.name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold">
                      {user?.name?.[0] || "U"}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-danger-light border border-danger/20 text-danger py-3 rounded-xl text-sm font-bold hover:bg-danger hover:text-white transition-all"
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
