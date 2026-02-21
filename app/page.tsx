import {
    ArrowRight,
    FileText,
    LayoutDashboard,
    MessageSquare,
    GitBranch,
    Palette,
    FolderOpen,
    ShieldCheck,
    Sparkles,
    BarChart3,
    Zap,
    ChevronDown,
    Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/animations/ScrollReveal";

/* ────────────────────── Data ────────────────────── */

const features = [
    {
        icon: GitBranch,
        title: "Project Workflows",
        description:
            "5-step guided wizard across Planning, Analysis, and Design phases with real-time WebSocket document generation.",
        color: "from-violet-500 to-purple-600",
        shadowColor: "shadow-violet-500/20",
    },
    {
        icon: FileText,
        title: "SRS Generator",
        description:
            "Generate comprehensive Software Requirements Specifications from project details, with AI-powered refinement.",
        color: "from-blue-500 to-cyan-600",
        shadowColor: "shadow-blue-500/20",
    },
    {
        icon: BarChart3,
        title: "Diagram Generator",
        description:
            "Create Use Case, Class, and Activity diagrams rendered with Mermaid.js. Iterate with AI chat.",
        color: "from-emerald-500 to-teal-600",
        shadowColor: "shadow-emerald-500/20",
    },
    {
        icon: Palette,
        title: "Wireframe Generator",
        description:
            "AI-generated HTML/CSS wireframes with live preview, split view, and iterative refinement.",
        color: "from-orange-500 to-amber-600",
        shadowColor: "shadow-orange-500/20",
    },
    {
        icon: MessageSquare,
        title: "AI Conversations",
        description:
            "Context-aware chat assistant for Business Analysis tasks with conversation management.",
        color: "from-pink-500 to-rose-600",
        shadowColor: "shadow-pink-500/20",
    },
    {
        icon: FolderOpen,
        title: "File Management",
        description:
            "Tree-based file and folder management with drag-and-drop upload. Supports PDF, DOC, DOCX, TXT, MD.",
        color: "from-indigo-500 to-blue-600",
        shadowColor: "shadow-indigo-500/20",
    },
];

const highlights = [
    {
        icon: Zap,
        label: "Real-time Generation",
        detail: "WebSocket streaming",
    },
    {
        icon: ShieldCheck,
        label: "Secure Auth",
        detail: "JWT + auto-refresh",
    },
    {
        icon: Sparkles,
        label: "AI-Powered",
        detail: "Iterative refinement",
    },
    {
        icon: LayoutDashboard,
        label: "Dark Mode",
        detail: "Full theme support",
    },
];

const steps = [
    {
        step: "01",
        title: "Create Project",
        desc: "Set up your project with name, description, and due date. Upload relevant documents to get started.",
        accent: "from-violet-500 to-purple-600",
    },
    {
        step: "02",
        title: "Select & Generate",
        desc: "Choose document types across Planning, Analysis, and Design phases. AI generates them in real-time via WebSocket.",
        accent: "from-blue-500 to-cyan-600",
    },
    {
        step: "03",
        title: "Review & Refine",
        desc: "Preview generated documents with Markdown & Mermaid rendering, iterate with AI chat, and export when ready.",
        accent: "from-emerald-500 to-teal-600",
    },
];

const stats = [
    { value: "22+", label: "Document Types" },
    { value: "3", label: "Workflow Phases" },
    { value: "5", label: "Step Wizard" },
    { value: "∞", label: "AI Iterations" },
];

/* ────────────────────── Page ────────────────────── */

export default function Home() {
    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* ═══════════ HERO ═══════════ */}
            <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                {/* Decorative floating shapes */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-[8%] w-20 h-20 rounded-2xl border border-violet-300/30 dark:border-violet-500/20 rotate-12 animate-float-slow" />
                    <div className="absolute top-40 right-[12%] w-14 h-14 rounded-full border border-cyan-300/30 dark:border-cyan-500/20 animate-float-slow-reverse" />
                    <div className="absolute bottom-32 left-[15%] w-10 h-10 rounded-full bg-gradient-to-br from-violet-400/10 to-blue-400/10 animate-float-slow" />
                    <div className="absolute bottom-48 right-[8%] w-16 h-16 rounded-2xl border border-emerald-300/20 dark:border-emerald-500/15 -rotate-12 animate-float-slow-reverse" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center space-y-8">
                    {/* Logo + Brand Badge */}
                    <div className="animate-hero-1 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-sm mx-auto">
                        <Image
                            src="/ic_ba_copilot.svg"
                            alt="BA Copilot"
                            width={28}
                            height={28}
                            className="drop-shadow"
                        />
                        <span className="text-sm font-semibold tracking-widest uppercase text-slate-600 dark:text-slate-300">
                            BA Copilot
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white">
                            Beta
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="animate-hero-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                        <span className="text-slate-900 dark:text-white">
                            Your AI-Powered
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x">
                            Business Analysis
                        </span>
                        <br />
                        <span className="text-slate-900 dark:text-white">
                            Assistant
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-hero-3 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Generate SRS documents, create diagrams, build
                        wireframes, and manage project workflows — all
                        powered by AI to accelerate your analysis process.
                    </p>

                    {/* CTA Buttons */}
                    <div className="animate-hero-4 flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                        <Link
                            href="/register"
                            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
                        >
                            {/* Animated gradient bg */}
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 animate-gradient-x" />
                            <span className="relative flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <Link
                            href="/login"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 hover:-translate-y-0.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm w-full sm:w-auto"
                        >
                            Sign In
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                    </div>

                    {/* Highlight Pills */}
                    <div className="animate-hero-5 flex flex-wrap justify-center gap-3 pt-4">
                        {highlights.map((h) => (
                            <div
                                key={h.label}
                                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-300"
                            >
                                <h.icon className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {h.label}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                                    — {h.detail}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                        Explore Features
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
                </div> */}
            </section>

            {/* ═══════════ STATS BAR ═══════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-12 border-y border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up" duration={600}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                                        {s.value}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ═══════════ FEATURES GRID ═══════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-28 dot-grid">
                {/* Section accent blob */}
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/10 via-blue-300/10 to-transparent rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto">
                    {/* Section Header */}
                    <ScrollReveal direction="up">
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-4">
                                Features
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
                                Everything you need for
                                <br className="hidden sm:block" />{" "}
                                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                                    Business Analysis
                                </span>
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
                                From requirements gathering to design
                                documentation — BA Copilot covers the
                                entire analysis lifecycle.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, i) => (
                            <ScrollReveal
                                key={feature.title}
                                direction="up"
                                delay={i * 100}
                            >
                                <div
                                    className={`group relative p-7 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-xl ${feature.shadowColor} hover:-translate-y-1.5 transition-all duration-400 h-full`}
                                >
                                    {/* Hover gradient glow */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-400`}
                                    />

                                    {/* Icon */}
                                    <div
                                        className={`relative inline-flex items-center justify-center w-13 h-13 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg ${feature.shadowColor} mb-5 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                                    >
                                        <feature.icon className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="relative text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                                        {feature.title}
                                    </h3>
                                    <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-28">
                {/* Accent blob */}
                <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-cyan-300/10 via-blue-300/10 to-transparent rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4">
                                How It Works
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                                Streamlined workflow
                                <br className="hidden sm:block" /> in{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    3 simple steps
                                </span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    {/* Steps */}
                    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6">
                        {/* Connecting line (desktop) */}
                        <div className="hidden lg:block absolute top-[3.25rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-violet-300 via-blue-300 to-emerald-300 dark:from-violet-600 dark:via-blue-600 dark:to-emerald-600 opacity-40" />

                        {steps.map((item, i) => (
                            <ScrollReveal
                                key={item.step}
                                direction="up"
                                delay={i * 150}
                            >
                                <div className="relative text-center lg:text-left">
                                    {/* Step Number */}
                                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-6 z-10">
                                        <span
                                            className={`text-xl font-extrabold bg-gradient-to-br ${item.accent} bg-clip-text text-transparent`}
                                        >
                                            {item.step}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto lg:mx-0">
                                        {item.desc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ SOCIAL PROOF / TECH ═══════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-20 dot-grid">
                <div className="relative max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-100/40 to-transparent dark:from-violet-900/20 rounded-bl-[80px]" />

                            <div className="relative">
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                    Built with modern tech
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Next.js 15 (App Router) + React 19",
                                        "TypeScript with strict typing",
                                        "Tailwind CSS v4 + Shadcn UI",
                                        "WebSocket real-time streaming",
                                        "JWT auth with auto-refresh",
                                        "Mermaid.js diagram rendering",
                                        "Document dependency constraints",
                                        "Responsive dark/light mode",
                                    ].map((text) => (
                                        <div
                                            key={text}
                                            className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
                                        >
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ═══════════ BOTTOM CTA ═══════════ */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-28">
                <ScrollReveal direction="zoom">
                    <div className="relative max-w-3xl mx-auto text-center">
                        {/* Glow behind CTA */}
                        <div className="absolute inset-0 -z-10 mx-auto w-full max-w-lg h-64 bg-gradient-to-r from-violet-400/15 via-blue-400/15 to-cyan-400/15 rounded-full blur-3xl" />

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-5">
                            Ready to accelerate
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                                your analysis?
                            </span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto text-lg">
                            Start generating professional BA documents in
                            minutes, not hours. Join the future of
                            Business Analysis.
                        </p>
                        <Link
                            href="/register"
                            className="group relative inline-flex items-center justify-center gap-2 px-12 py-5 text-lg font-semibold text-white rounded-2xl overflow-hidden shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 animate-gradient-x" />
                            <span className="relative flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-5">
                            No credit card required
                        </p>
                    </div>
                </ScrollReveal>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="border-t border-slate-200/60 dark:border-slate-700/60 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/ic_ba_copilot.svg"
                            alt="BA Copilot"
                            width={20}
                            height={20}
                        />
                        <span className="font-medium">BA Copilot</span>
                    </div>
                    <p>
                        Built with Next.js 15, React 19 &amp; TypeScript.
                    </p>
                </div>
            </footer>
        </div>
    );
}
