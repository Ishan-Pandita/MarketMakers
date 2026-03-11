// src/components/Navbar.jsx - UPGRADED VERSION
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Logo from "./Logo";

// Helper component for links
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-gray-400 hover:text-white font-bold transition-colors relative group text-[15px] tracking-wide"
    >
      {children}
      <span className="absolute -bottom-1 left-1/2 w-0 h-[2px] bg-neon-green transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_10px_#00ff66cc]"></span>
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
    <div className="px-4 sm:px-6 lg:px-8 pt-6 fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto max-w-7xl rounded-full bg-black/40 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/10">
        <div className="px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Neon Pulse */}
            <Link to="/" className="flex items-center group">
              <Logo variant="abbreviated" size="md" glowColor="purple" />
            </Link>

            {/* Desktop Navigation - Minimalist Elite */}
            <div className="hidden md:flex items-center space-x-10">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/community">Community</NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink to="/courses">Courses</NavLink>
                  <NavLink to="/exams">Verification</NavLink>
                  <NavLink to="/profile">Identity</NavLink>

                  <div className="flex items-center gap-6 ml-6 pl-10 border-l border-white/10">
                    <Link to="/profile" className="group flex flex-col items-end">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-neon-green transition-colors">
                        {user?.role} // Role
                      </div>
                      <div className="text-sm font-black text-white group-hover:text-neon-purple transition-colors">
                        {user?.name}
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 flex items-center justify-center transition-all duration-300 group"
                      title="Sign Out"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:rotate-12 transition-transform"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link
                    to="/login"
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-neon-green text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_40px_rgba(0,255,102,0.5)] hover:-translate-y-1 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Cyber Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-3xl border-t border-white/5 rounded-b-[32px] overflow-hidden animate-slideDown">
            <div className="px-8 py-10 space-y-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'Community', path: '/community' },
                ...(isAuthenticated ? [
                  { name: 'Courses', path: '/courses' },
                  { name: 'Verification', path: '/exams' },
                  { name: 'Identity', path: '/profile' }
                ] : [
                  { name: 'Login', path: '/login' },
                  { name: 'Sign Up', path: '/register' }
                ])
              ].map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-2xl font-black text-gray-500 hover:text-white transition-all tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{user?.role}</p>
                      <p className="text-xl font-black text-white">{user?.name}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 flex items-center justify-center text-xl">💎</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all"
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
