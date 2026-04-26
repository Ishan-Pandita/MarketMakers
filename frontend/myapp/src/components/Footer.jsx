// src/components/Footer.jsx -- Dual Theme
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { isDark } = useTheme();

  return (
    <footer className={`pt-16 pb-8 border-t ${
      isDark ? 'bg-dark-surface border-dark-border/30' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <Logo variant="full" size="sm" />
            </Link>
            <p className={`max-w-sm leading-relaxed text-sm ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
              Empowering the next generation of traders with expert-curated
              education, structured courses, and a global learning community.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-300' : 'text-[#1A1A2E]'}`}>Platform</h4>
            <ul className="space-y-4">
              {[
                { name: 'Browse Courses', path: '/courses' },
                { name: 'Our Contributors', path: '/community' },
                { name: 'Certifications', path: '/exams' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isDark ? 'text-gray-500 hover:text-cyan-400' : 'text-[#6B7280] hover:text-indigo-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${isDark ? 'text-gray-300' : 'text-[#1A1A2E]'}`}>Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Careers', path: '/careers' },
                { name: 'Become a Contributor', path: '/register' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isDark ? 'text-gray-500 hover:text-cyan-400' : 'text-[#6B7280] hover:text-indigo-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDark ? 'border-dark-border/30' : 'border-slate-200'
        }`}>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-600' : 'text-[#9CA3AF]'}`}>
            © {currentYear} MarketMakers. Owned & Operated by <span className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>Ishan Pandita</span>.
          </p>
          <div className="flex gap-8">
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <Link key={item} to={`/${item.toLowerCase()}`} className={`text-xs font-medium transition-colors ${
                isDark ? 'text-gray-600 hover:text-cyan-400' : 'text-[#9CA3AF] hover:text-indigo-600'
              }`}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
