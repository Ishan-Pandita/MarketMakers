import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-4 mb-6 group">
                            <Logo variant="abbreviated" size="md" glowColor="purple" />
                        </Link>
                        <p className="text-gray-500 max-w-sm leading-relaxed font-bold text-sm">
                            Empowering the next generation of traders with institutional-grade
                            education, real-time analytics, and a global network of elite operators.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Platform</h4>
                        <ul className="space-y-5">
                            {[
                                { name: 'Browse Modules', path: '/modules' },
                                { name: 'Our Contributors', path: '/community' },
                                { name: 'Certification', path: '/exams' },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-500 hover:text-white transition-colors text-sm font-bold"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Company</h4>
                        <ul className="space-y-5">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Become a Partner', path: '/register' },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-500 hover:text-white transition-colors text-sm font-bold"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        © {currentYear} MarketMakers. Owned & Operated by <span className="text-white">Ishan Pandita</span>.
                    </p>
                    <div className="flex gap-10">
                        {['Terms', 'Privacy', 'Cookies'].map(item => (
                            <Link key={item} to={`/${item.toLowerCase()}`} className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
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
