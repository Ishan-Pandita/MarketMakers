// src/components/Navbar.jsx - UPGRADED VERSION
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

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
    <nav className="bg-gradient-to-r from-primary-800 to-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">📈</span>
            <span className="text-xl font-bold hidden sm:block">
              MarketMakers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-primary-200 transition-colors font-medium"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/modules"
                  className="hover:text-primary-200 transition-colors font-medium"
                >
                  Learn
                </Link>
                <Link
                  to="/dashboard"
                  className="hover:text-primary-200 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/exams"
                  className="hover:text-primary-200 transition-colors font-medium"
                >
                  Exams
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-primary-200 transition-colors font-medium"
                >
                  Profile
                </Link>

                {/* Contributor-only link */}
                {user?.role === "contributor" && (
                  <Link
                    to="/create-module"
                    className="hover:text-primary-200 transition-colors font-medium"
                  >
                    Create Module
                  </Link>
                )}

                {/* User menu */}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-primary-400">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-primary-200 capitalize">
                      {user?.role || "learner"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-primary-200 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign Up
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-700 border-t border-primary-600">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-primary-200 transition-colors"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/modules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-primary-200 transition-colors"
                >
                  Learn
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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
