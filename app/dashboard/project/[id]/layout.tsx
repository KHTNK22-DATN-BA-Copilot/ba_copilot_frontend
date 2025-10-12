import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project - BA Copilot",
    description: "Project details and management",
};

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
