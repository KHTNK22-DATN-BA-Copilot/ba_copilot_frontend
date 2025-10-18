"use client";
import { createContext, useContext, useState } from "react";

type diagramOptionsProps = {
    id: string;
    label: string;
    value: string;
    isCheck: boolean; // Changed from Boolean to boolean
};
type ProjectOverviewProps = {
    projectName?: string;
    version?: string;
    description?: string;
};
type RequirementsProps = {
    id: string;
    name: string;
    type: "functional" | "non-functional";
};
type FileProps = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'uploading' | 'completed' | 'error';
}

type actionType = {
    actionState: "add" | "update",
    data: RequirementsProps
} | {
    actionState: "delete",
    id: string
};
type DataStoreType = {
    projectOverview: ProjectOverviewProps;
    handleProjectOverview: (data: ProjectOverviewProps) => void;
    
    requirements: RequirementsProps[];
    handleRequirements: (action: actionType) => void;
    
    diagrams: diagramOptionsProps[];
    handleDiagrams: (id: string) => void;
    
    constrain: string;
    handleConstrain: (value: string) => void;

    files: FileProps[];
    handleFiles: (files: FileList | File[]) => void
    removeFile: (id: string) => void
 };


const SrsDataStoreContext = createContext<DataStoreType | null>(null);
export function SrsDataStoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [projectOverview, setProjectOverview] =
        useState<ProjectOverviewProps>({
            projectName: "SRS Generator",
            version: "1.0",
            description:
                "This project is about generating Software Requirement Specification (SRS) documents based on user inputs and predefined templates.",
        });
    const handleProjectOverview: DataStoreType["handleProjectOverview"] = (data) => {
        setProjectOverview((prev) => ({ ...prev, ...data }));
    };

    const [requirements, setRequirements] = useState<RequirementsProps[]>([]);
    const handleRequirements: DataStoreType["handleRequirements"] = (action) => {
        switch (action.actionState) {
            case "add":
                setRequirements((prev) => [...prev, action.data]);
                break;
            case "update":
                setRequirements((prev) =>
                    prev.map((req) => (req.id === action.data.id ? action.data : req))
                );
                break;
            case "delete":
                setRequirements((prev) =>
                    prev.filter((req) => req.id !== action.id)
                );
                break;
        }
    };

    const [constrain, setConstrain] = useState<string>("");
    const handleConstrain: DataStoreType["handleConstrain"] = (value) => {
        setConstrain(value);
    }

    const [diagrams, setDiagrams] = useState<diagramOptionsProps[]>([
        {
            id: "sequence-diagram",
            label: "Sequence Diagram - Shows interaction flow between components",
            isCheck: false,
            value: "sequence"
        },
        {
            id: "architecture-diagram",
            label: "Architecture Diagram - System architecture and components overview",
            isCheck: false,
            value: "architecture"
        },
        {
            id: "use-case-diagram",
            label: "Use Case Diagram - User interactions and system functionalities",
            isCheck: false,
            value: "use_case"
        },
    ]);
    const handleDiagrams: DataStoreType["handleDiagrams"] = (id) => {
        setDiagrams((prev) =>
            prev.map((diagram) =>
                diagram.id === id ? { ...diagram, isCheck: !diagram.isCheck } : diagram
            )
        );
    }

    const [files, setFiles] = useState<FileProps[]>([]);

    const handleFiles: DataStoreType["handleFiles"] = (input) => {
        const fileArray = Array.from(input instanceof FileList ? input : input);
        const newFiles = fileArray.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploading' as const,
        }));
        setFiles((prev) => [...prev, ...newFiles]);

        // mock upload completion per file (keeps parity with previous local behavior)
        newFiles.forEach((nf) => {
            setTimeout(() => {
                setFiles((prev) =>
                    prev.map((f) => (f.id === nf.id ? { ...f, status: 'completed' } : f))
                );
            }, 2000);
        });
    };

    const removeFile: DataStoreType["removeFile"] = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <SrsDataStoreContext.Provider
            value={{
                projectOverview,
                handleProjectOverview,
                requirements,
                handleRequirements,
                diagrams,
                handleDiagrams,
                constrain,
                handleConstrain,
                files,
                handleFiles,
                removeFile
            }}
        >
            {children}
        </SrsDataStoreContext.Provider>
    );
}
export const useSRSGeneratorDataStore = () => {
    const context = useContext(SrsDataStoreContext);
    if (!context)
        throw new Error(
            "useSRSGeneratorDataStore must be used within DataStoreProvider"
        );
    return context;
};
