// src/components/Navbar.jsx - UPGRADED VERSION
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// Helper component for links
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-gray-600 hover:text-primary-600 font-bold transition-colors relative group text-[15px] tracking-wide"
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
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
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
              📈
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              MarketMakers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/community">Community</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/courses">Courses</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/profile">Profile</NavLink>

                {/* Contributor-only link */}
                {user?.role === "contributor" && (
                  <Link
                    to="/create-module"
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all text-sm"
                  >
                    + Create
                  </Link>
                )}

                {/* User menu */}
                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-200/50">
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-bold text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                      {user?.role}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all duration-200"
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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
                  className="text-gray-600 hover:text-primary-700 font-bold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {
        mobileMenuOpen && (
          <div className="md:hidden bg-primary-700 border-t border-primary-600">
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-primary-200 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-primary-200 transition-colors"
              >
                Community
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:text-primary-200 transition-colors"
                  >
                    Courses
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:text-primary-200 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/exams"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:text-primary-200 transition-colors"
                  >
                    Exams
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:text-primary-200 transition-colors"
                  >
                    Profile
                  </Link>
                  {user?.role === "contributor" && (
                    <Link
                      to="/create-module"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 hover:text-primary-200 transition-colors"
                    >
                      Create Module
                    </Link>
                  )}
                  <div className="pt-3 border-t border-primary-600">
                    <p className="text-sm mb-2">
                      Logged in as{" "}
                      <span className="font-medium">{user?.name}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 hover:text-primary-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div >
        )
      }
    </nav >
  );
}

export default Navbar;
