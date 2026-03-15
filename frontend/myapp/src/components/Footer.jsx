// src/components/Footer.jsx — Light Theme
import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-heading border-t border-slate-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <Logo variant="full" size="sm" className="[&_span]:!text-white [&_div]:!bg-white/10 [&_div]:!border-white/10" />
            </Link>
            <p className="text-white/50 max-w-sm leading-relaxed text-sm">
              Empowering the next generation of traders with expert-curated
              education, structured courses, and a global learning community.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              {[
                { name: 'Browse Courses', path: '/courses' },
                { name: 'Our Contributors', path: '/community' },
                { name: 'Certifications', path: '/exams' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Careers', path: '/careers' },
                { name: 'Become a Contributor', path: '/register' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-medium">
            © {currentYear} MarketMakers. Owned & Operated by <span className="text-white/60">Ishan Pandita</span>.
          </p>
          <div className="flex gap-8">
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="text-xs text-white/30 hover:text-white/70 transition-colors font-medium">
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
