import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">📈</span>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                MarketMakers
                            </span>
                        </Link>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            Empowering the next generation of traders with expert-led
                            education, real-time analytics, and a thriving community.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-gray-200">Platform</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/modules"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Browse Modules
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/community"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Our Contributors
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/exams"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Certification
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-gray-200">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/careers"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Become a Partner
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} MarketMakers. Owned & Operated by <span className="text-white font-semibold">Ishan Pandita</span>.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link to="/cookies" className="text-gray-500 hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
