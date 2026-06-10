"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProjectMembership } from "@/app/dashboard/project/[id]/_components/types";
import { getMyProjectMembership } from "@/actions/project.action";

interface ProjectMembershipContextType {
    membership: ProjectMembership | null;
    role: "Owner" | "Editor" | "Viewer" | null;
    permissions: {
        project: string[];
        file: string[];
        folder: string[];
    } | null;
    hasPermission: (
        resource: "project" | "file" | "folder",
        action: "read" | "write" | "delete" | "manage_members"
    ) => boolean;
    isLoading: boolean;
    error: string | null;
}

const ProjectMembershipContext = createContext<ProjectMembershipContextType>({
    membership: null,
    role: null,
    permissions: null,
    hasPermission: () => false,
    isLoading: true,
    error: null,
});

export function ProjectMembershipProvider({
    projectId,
    children,
}: {
    projectId: string;
    children: React.ReactNode;
}) {
    const [membership, setMembership] = useState<ProjectMembership | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        if (!projectId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getMyProjectMembership(projectId)
            .then((data) => {
                if (!mounted) return;
                setMembership(data);
            })
            .catch((err) => {
                if (!mounted) return;
                console.error("Failed to load project membership:", err);
                setError(err instanceof Error ? err.message : "Failed to load project membership");
            })
            .finally(() => {
                if (!mounted) return;
                setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [projectId]);

    const hasPermission = (
        resource: "project" | "file" | "folder",
        action: "read" | "write" | "delete" | "manage_members"
    ): boolean => {
        if (!membership || !membership.permissions) return false;
        
        // Owner has all permissions
        if (membership.role === "Owner") return true;

        const resPerms = membership.permissions[resource];
        if (!resPerms) return false;

        return resPerms.includes(action as any);
    };

    return (
        <ProjectMembershipContext.Provider
            value={{
                membership,
                role: membership?.role || null,
                permissions: membership?.permissions || null,
                hasPermission,
                isLoading,
                error,
            }}
        >
            {children}
        </ProjectMembershipContext.Provider>
    );
}

export function useProjectMembership() {
    return useContext(ProjectMembershipContext);
}
