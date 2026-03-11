function StaticPage({ title, content }) {
    return (
        <div className="min-h-screen bg-[#050505] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="glass-dark p-12 md:p-16 rounded-[40px] border-white/5 shadow-[0_0_80px_#000000]">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">{title}<span className="text-neon-purple">.</span></h1>
                    <div className="text-gray-400 font-bold leading-relaxed space-y-6">
                        {content ? (
                            <p className="text-lg">{content}</p>
                        ) : (
                            <>
                                <p>
                                    This archive is currently under construction. Our architects are
                                    synthesizing this content for the global network.
                                </p>
                                <p>
                                    Please check back later or contact us at{" "}
                                    <a
                                        href="mailto:support@marketmakers.com"
                                        className="text-neon-green hover:text-white transition-colors underline underline-offset-4 decoration-neon-green/30"
                                    >
                                        support@marketmakers.com
                                    </a>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaticPage;
