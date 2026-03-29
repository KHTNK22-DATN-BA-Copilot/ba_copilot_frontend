import {
    ArrowRight,
    GitBranch,
    FileText,
    BarChart3,
    Palette,
    ShieldCheck,
    FolderOpen,
    Check,
} from "lucide-react";
import Link from "next/link";
import { DM_Serif_Display, DM_Sans } from "next/font/google";

// Dữ liệu cho các section lặp lại
const features = [
    {
        icon: GitBranch,
        title: "Project Workflows",
        description:
            "5-step guided wizard across Planning, Analysis, and Design phases with real-time WebSocket document generation.",
    },
    {
        icon: FileText,
        title: "Planning Phase",
        description:
            "Generate Stakeholder Registers, High-level Requirements, Business Cases, Scope Statements, and Product Roadmaps.",
    },
    {
        icon: BarChart3,
        title: "Analysis Phase",
        description:
            "Evaluate project viability with Feasibility Studies, Cost-Benefit Analyses, Risk Registers, and Compliance checks.",
    },
    {
        icon: Palette,
        title: "Design Phase",
        description:
            "Produce comprehensive SRS, HLD, LLD, UI/UX conceptualizations, and Requirement Traceability Matrices (RTM).",
    },
    {
        icon: ShieldCheck,
        title: "Smart Dependencies",
        description:
            "Built-in constraints enforce prerequisites and dependent document cascading across all workflow phases.",
    },
    {
        icon: FolderOpen,
        title: "File Management",
        description:
            "Tree-based file and folder management with drag-and-drop upload. Supports PDF, DOC, DOCX, TXT, MD.",
    },
];

const howItWorksSteps = [
    {
        number: "01",
        title: "Create Project",
        description:
            "Set up your project with name, description, and due date. Upload relevant documents to get started.",
    },
    {
        number: "02",
        title: "Select & Generate",
        description:
            "Choose document types across Planning, Analysis, and Design phases. AI generates them in real-time via WebSocket.",
    },
    {
        number: "03",
        title: "Review & Refine",
        description:
            "Preview generated documents with Markdown & Mermaid rendering, iterate with AI chat, and export when ready.",
    },
];

const techStack = [
    { name: "Next.js 15", logo: "/tech/nextjs.svg" },
    { name: "React 19", logo: "/tech/react.svg" },
    { name: "TypeScript", logo: "/tech/typescript.svg" },
    { name: "WebSocket", logo: "/tech/websocket.svg" },
    { name: "Mermaid.js", logo: "/tech/mermaid.svg" },
    { name: "JWT Auth", logo: "/tech/jwt.svg" },
    { name: "Shadcn UI", logo: "/tech/shadcn.svg" },
    { name: "AI", logo: "/tech/ai.svg" },
];

export default function Home() {
    return (
        <div className={`font-sans text-[#475569] bg-white`}>
            {/* ═ HEADER ═ */}
            <header className="sticky top-0 z-[100] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
                <nav className="flex items-center justify-between max-w-[1240px] mx-auto p-4 md:p-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3 no-underline"
                    >
                        <svg
                            viewBox="0 0 18 18"
                            fill="none"
                            className="w-9 h-9"
                        >
                            <rect
                                width="18"
                                height="18"
                                rx="5"
                                fill="#2A4DD4"
                            />
                            <path
                                d="M3 5h8M3 9h12M3 13h6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="14"
                                cy="5"
                                r="2.5"
                                fill="white"
                                opacity="0.9"
                            />
                        </svg>
                        <span className="text-2xl font-bold text-[#0F1B3C]">
                            BA Copilot
                        </span>
                    </Link>
                    <div className="flex items-center gap-8 text-[15px] font-medium text-[#0F1B3C]">
                        {/* <Link
                            href="#workflows"
                            className="hover:text-[#2A4DD4] transition-colors"
                        >
                            Workflows
                        </Link>
                        <Link
                            href="#file-manager"
                            className="hover:text-[#2A4DD4] transition-colors"
                        >
                            File Manager
                        </Link> */}
                        <Link
                            href="/login"
                            className="text-[#2A4DD4] font-semibold hover:text-[#1D3AA1] transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2.5 rounded-full bg-[#0F1B3C] text-white text-[15px] font-semibold hover:bg-[#16244A] transition-all no-underline"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </nav>
            </header>

            {/* ═ HERO ═ */}
            <section className="bg-[#F1F4F9]">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,500px)] items-center gap-12 lg:gap-20 max-w-[1240px] mx-auto p-8 md:p-16 lg:p-24">
                    <div>
                        <div className="inline-flex items-center gap-2.5 bg-[#EEF2FF] text-[#2A4DD4] border border-[#C2D4FF] rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wide uppercase mb-8">
                            <span className="w-1.5 h-1.5 bg-[#2A4DD4] rounded-full animate-pulse"></span>
                            AI-Powered Business Analysis
                        </div>
                        <h1 className="font-serif text-[48px] md:text-[56px] lg:text-[64px] leading-[1.15] text-[#0F1B3C] mb-6">
                            Your intelligent
                            <br />
                            <em className="text-[#2A4DD4]">
                                Business Analysis
                            </em>
                            <br />
                            assistant
                        </h1>
                        <p className="text-[18px] md:text-[20px] text-[#475569] leading-[1.75] mb-12 max-w-[600px]">
                            Generate comprehensive project documentation across
                            Planning, Analysis, and Design phases — a fully
                            guided workflow powered by AI. Accelerate your
                            process and ensure consistency.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#2A4DD4] text-white text-[17px] font-semibold hover:bg-[#1D3AA1] hover:-translate-y-0.5 hover:shadow-lg transition-all no-underline"
                            >
                                Get Started Free{" "}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center px-9 py-4 rounded-full bg-white text-[#0F1B3C] border-2 border-[#CBD5E1] text-[17px] font-semibold hover:border-[#0F1B3C] hover:bg-[#F8FAFC] transition-all no-underline"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#16244A] rounded-xl border border-[#1A2A56] shadow-xl p-5 md:p-6">
                        <div className="bg-[#16244A] rounded-xl border border-[#1A2A56] shadow-xl overflow-hidden">
                            {/* Topbar */}
                            <div className="bg-white/5 px-4 py-3 flex items-center border-b border-white/10">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
                                </div>
                                <span className="text-[11px] text-white/30 font-sans ml-2">
                                    BA Copilot — Project Workspace
                                </span>
                            </div>

                            {/* Inner Content */}
                            <div className="p-4 md:p-5">
                                <div className="text-[10px] text-white/40 tracking-wide uppercase mb-4">
                                    Document Workflow
                                </div>

                                {/* Planning Phase */}
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2.5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[12px] font-semibold text-white/80">
                                            📋 Planning Phase
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#86EFAC]">
                                            5/5 done
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            "Stakeholder Register",
                                            "Business Case",
                                            "Scope Statement",
                                            "Requirements",
                                            "Roadmap",
                                        ].map((doc) => (
                                            <span
                                                key={doc}
                                                className="text-[10px] px-2 py-1 rounded bg-[#16A34A]/20 text-[#86EFAC]"
                                            >
                                                {doc}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Analysis Phase */}
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2.5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[12px] font-semibold text-white/80">
                                            📊 Analysis Phase
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A4DD4]/25 text-[#93B0FF]">
                                            In progress
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[10px] px-2 py-1 rounded bg-[#16A34A]/20 text-[#86EFAC]">
                                            Feasibility Study
                                        </span>
                                        <span className="text-[10px] px-2 py-1 rounded bg-[#2A4DD4]/30 text-[#93B0FF]">
                                            Cost-Benefit Analysis ✦
                                        </span>
                                        <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40">
                                            Risk Register
                                        </span>
                                        <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40">
                                            Compliance
                                        </span>
                                    </div>
                                </div>

                                {/* Design Phase */}
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[12px] font-semibold text-white/80">
                                            🎨 Design Phase
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                                            Locked
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            "SRS",
                                            "HLD",
                                            "LLD",
                                            "UI/UX Spec",
                                            "RTM",
                                        ].map((doc) => (
                                            <span
                                                key={doc}
                                                className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40"
                                            >
                                                {doc}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                                        <span>Overall progress</span>
                                        <span>62%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        {/* Để có animation chạy thanh progress, bạn có thể thêm duration-1000 ease-out và control w-[62%] bằng state nếu muốn */}
                                        <div className="h-full bg-gradient-to-r from-[#2A4DD4] to-[#7B9EFF] rounded-full w-[62%] transition-all"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═ FEATURES ═ */}
            <section
                id="workflows"
                className="max-w-[1240px] mx-auto p-8 md:p-16 lg:p-24"
            >
                <div className="text-center mb-16 max-w-[700px] mx-auto">
                    <div className="inline-flex bg-[#EEF2FF] text-[#2A4DD4] border border-[#C2D4FF] rounded-full px-4 py-1 text-[11px] font-bold tracking-wide uppercase mb-4">
                        Features
                    </div>
                    <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.2] text-[#0F1B3C] mb-4">
                        Everything you need for
                        <br />
                        <em className="text-[#2A4DD4]">Business Analysis</em>
                    </h2>
                    <p className="text-[18px] text-[#475569] leading-[1.7]">
                        From requirements gathering to design documentation — BA
                        Copilot covers the entire analysis lifecycle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-[#CBD5E1] border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 group transition-colors hover:bg-[#F8FAFC]"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-6 group-hover:bg-[#C2D4FF]/70 transition-colors">
                                <feature.icon className="w-6 h-6 text-[#2A4DD4]" />
                            </div>
                            <h3 className="text-[18px] font-semibold text-[#0F1B3C] mb-3 group-hover:text-[#2A4DD4] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-[14px] text-[#475569] leading-[1.7]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═ HOW IT WORKS ═ */}
            <section className="bg-[#0F1B3C] text-white">
                <div className="max-w-[1240px] mx-auto p-8 md:p-16 lg:p-24">
                    <div className="text-center mb-16 max-w-[700px] mx-auto">
                        <div className="inline-flex bg-white/10 text-white border border-white/20 rounded-full px-4 py-1 text-[11px] font-bold tracking-wide uppercase mb-4">
                            How It Works
                        </div>
                        <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.2] text-white mb-4">
                            Streamlined workflow in{" "}
                            <em className="text-[#6B8FF5]">3 simple steps</em>
                        </h2>
                        <p className="text-[18px] text-[#CBD5E1] leading-[1.7]">
                            From project setup to polished documentation in
                            minutes, not hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-white/10 z-0"></div>
                        {howItWorksSteps.map((step, i) => (
                            <div key={i} className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-[#2A4DD4] border border-[#C2D4FF]/20 flex items-center justify-center font-serif text-[24px] text-white mb-6">
                                    {step.number}
                                </div>
                                <h3 className="text-[18px] font-semibold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-[14px] text-[#CBD5E1] leading-[1.7]">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═ TECH STACK ═ */}
            <section className="bg-[#F8FAFC]">
                <div className="max-w-[1240px] mx-auto p-8 md:p-16 lg:p-24 text-center">
                    <h3 className="font-serif text-[32px] md:text-[36px] text-[#0F1B3C] mb-12">
                        Built with modern tech for{" "}
                        <em className="text-[#2A4DD4]">reliability</em>
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                        {techStack.map((tech) => (
                            <div
                                key={tech.name}
                                className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#C2D4FF] hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-[#2A4DD4]" />
                                </div>
                                <span className="text-[15px] font-medium text-[#0F1B3C]">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═ FINAL CTA ═ */}
            <section className="text-center max-w-[1240px] mx-auto p-8 md:p-16 lg:p-24 lg:pb-32">
                <h2 className="font-serif text-[48px] md:text-[56px] leading-[1.15] text-[#0F1B3C] mb-6">
                    Ready to accelerate
                    <br />
                    <em className="text-[#2A4DD4]">your analysis?</em>
                </h2>
                <p className="text-[20px] md:text-[22px] text-[#475569] leading-[1.7] mb-12 max-w-[650px] mx-auto">
                    Start generating professional BA documents in minutes, not
                    hours. Join the future of Business Analysis.
                </p>
                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-10 py-4.5 rounded-full bg-[#0F1B3C] text-white text-[18px] font-semibold hover:bg-[#16244A] hover:-translate-y-0.5 hover:shadow-lg transition-all no-underline"
                >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
            </section>

            {/* ═ FOOTER ═ */}
            <footer className="bg-[#0F1B3C] text-[#CBD5E1] border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1240px] mx-auto p-8 md:px-6 md:py-8 text-[14px]">
                    <div className="flex items-center gap-3">
                        <svg
                            viewBox="0 0 18 18"
                            fill="none"
                            className="w-7 h-7"
                        >
                            <rect
                                width="18"
                                height="18"
                                rx="5"
                                fill="#2A4DD4"
                            />
                            <path
                                d="M3 5h8M3 9h12M3 13h6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="14"
                                cy="5"
                                r="2.5"
                                fill="white"
                                opacity="0.9"
                            />
                        </svg>
                        <span className="text-xl font-bold text-white">
                            BA Copilot
                        </span>
                    </div>
                    <span className="text-center">
                        &copy; {new Date().getFullYear()} BA Copilot. All rights
                        reserved.
                    </span>
                    <span className="flex items-center gap-1.5">
                        Built with Next.js &amp; TypeScript.
                    </span>
                </div>
            </footer>
        </div>
    );
}
