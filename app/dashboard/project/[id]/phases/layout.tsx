import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Project Phases - BA Copilot",
	description: "Generate and manage phase documents for your project",
};

export default function ProjectPhasesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}

