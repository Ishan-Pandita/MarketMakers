import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error Boundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
                    <div className="max-w-md w-full glass-dark rounded-[40px] border-white/5 p-12 text-center shadow-[0_0_80px_#000000]">
                        <div className="text-6xl mb-6 opacity-50">⚠️</div>
                        <h1 className="text-2xl font-black text-white mb-3 tracking-tight">
                            System Fault Detected.
                        </h1>
                        <p className="text-gray-500 font-bold mb-8">
                            A critical error occurred in this node. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-10 py-4 bg-neon-green text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_30px_#00ff664d] hover:-translate-y-1 transition-all"
                        >
                            Restart Node
                        </button>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-8 text-left">
                                <summary className="cursor-pointer text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-gray-400 transition-colors">
                                    Debug Trace (Dev Only)
                                </summary>
                                <pre className="mt-4 p-5 bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] rounded-2xl overflow-auto font-mono leading-relaxed">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
