import { Metadata } from "next";
import { ProjectMembershipProvider } from "@/context/ProjectMembershipContext";

export const metadata: Metadata = {
    title: "Project - BA Copilot",
    description: "Project details and management",
};

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <ProjectMembershipProvider projectId={id}>
            {children}
        </ProjectMembershipProvider>
    );
}
