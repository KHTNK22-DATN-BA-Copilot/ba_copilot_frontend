"use client";
import { createContext, useContext, useState } from "react";
import { useFileDataStore } from "./FileContext";

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
    
    requirements: string;
    handleRequirements: (value: string) => void;
    
    diagrams: diagramOptionsProps[];
    handleDiagrams: (id: string) => void;
    
    constrain: string;
    handleConstrain: (value: string) => void;

 };


const SrsDataStoreContext = createContext<DataStoreType | null>(null);
export function SrsDataStoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    //-----------------------------Project Overview State---------------------------------
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

    //-----------------------------Requirements State---------------------------------
    const [requirements, setRequirements] = useState<string>("");
    const handleRequirements: DataStoreType["handleRequirements"] = (value) => {
        setRequirements(value);
    };
    const [constrain, setConstrain] = useState<string>("");
    const handleConstrain: DataStoreType["handleConstrain"] = (value) => {
        setConstrain(value);
    }
    
    //-----------------------------Diagrams State---------------------------------
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
