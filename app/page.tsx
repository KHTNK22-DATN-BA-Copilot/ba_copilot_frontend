import { ArrowRight, FileText, Wand2, Network, MessageSquare, Zap, Users, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-violet-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent dark:via-slate-800/20"></div>
            </div>

            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
                            <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">AI-Powered Business Analysis</span>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-6">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    BA Copilot
                                </span>
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-cyan-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Subheading */}
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                Transform Your Business Analysis
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600"> with AI</span>
                            </p>
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                Generate comprehensive SRS documents, create stunning wireframes, and visualize complex systems—all powered by cutting-edge AI technology. Save 80% of your documentation time.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link
                                href="/register"
                                className="group relative px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 transition-all duration-300 group-hover:scale-110"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Link>

                            <Link
                                href="/login"
                                className="group px-8 py-4 text-lg font-bold bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border-2 border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-400 text-slate-700 dark:text-slate-200 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Sign In
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400">80%</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Faster Documentation</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">4+</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">AI-Powered Tools</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-cyan-600 dark:text-cyan-400">100%</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Secure & Private</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            Powerful Features for Modern BAs
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Everything you need to streamline your business analysis workflow in one intelligent platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1: SRS Generator */}
                        <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">SRS Generator</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Generate comprehensive Software Requirements Specifications in minutes with AI-powered templates and smart suggestions.
                            </p>
                        </div>

                        {/* Feature 2: Wireframe Creator */}
                        <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Wand2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Wireframe Creator</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Transform text descriptions into beautiful wireframes instantly. Visualize your ideas with drag-and-drop simplicity.
                            </p>
                        </div>

                        {/* Feature 3: Diagram Generator */}
                        <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Network className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Diagram Generator</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Create UML diagrams, flowcharts, and system architectures with AI assistance. Export to multiple formats.
                            </p>
                        </div>

                        {/* Feature 4: AI Assistant */}
                        <div className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">AI Conversations</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Chat with your intelligent BA assistant. Get instant answers, suggestions, and expert guidance 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            Why Choose BA Copilot?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Built for modern teams who demand excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Save Time</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Reduce documentation time by 80%. Focus on what matters—analyzing requirements and solving problems.
                            </p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Collaboration</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Real-time collaboration with stakeholders. Keep everyone aligned with shared projects and instant updates.
                            </p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Enterprise Security</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Bank-level encryption and compliance. Your data is protected with industry-leading security standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Join thousands of business analysts, product managers, and developers who trust BA Copilot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            href="/register"
                            className="group px-8 py-4 text-lg font-bold bg-white text-violet-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto hover:shadow-white/50"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/login"
                            className="group px-8 py-4 text-lg font-bold bg-white/10 backdrop-blur-xl border-2 border-white/30 hover:border-white text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Sign In
                        </Link>
                    </div>
                    <p className="text-sm text-white/80 pt-4">
                        No credit card required • Free 14-day trial • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        © 2025 BA Copilot. Empowering Business Analysts with AI.
                    </p>
                </div>
            </footer>
        </div>
    );
}
