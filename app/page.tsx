import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen ">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-violet-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent dark:via-slate-800/20"></div>
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                    {/* Hero Text Section */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                                    BA Copilot
                                </span>
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-cyan-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                Welcome to the future of
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600"> Business Analysis</span>
                            </p>
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                Harness the power of AI to revolutionize your workflow, enhance productivity, and unlock deeper insights than ever before.
                            </p>
                        </div>
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
                        <Link
                            href="/register"
                            className="group relative px-10 py-5 text-lg font-bold text-white overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 transition-all duration-300 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Start Your Journey
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/login"
                            className="group px-10 py-5 text-lg font-bold bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-400 text-slate-700 dark:text-slate-200 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Sign In
                                <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </span>
                        </Link>
                    </div>



                    {/* Bottom CTA */}
                    <div className="pt-16 pb-8">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Join thousands of analysts already using BA Copilot
                        </p>
                        <div className="flex justify-center space-x-6 opacity-60">
                            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-1000"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse animation-delay-2000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
