"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "./_components/PageHeader";
import { CreateNewDiagramSection } from "./_components/creatediagram/CreateNewDiagramSection";
import { DiagramDetail } from "./_components/diagramoverview/DiagramDetail";
import { RecentDiagramsList } from "./_components/diagramoverview/RecentDiagramsList";
import { useDiagramManager } from "./_lib/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RecentDiagramsFilter from "./_components/diagramoverview/RecentDiagramsFilter";
import { GeneratingDialog } from "./_components/creatediagram/GeneratingDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFileDataStore } from "@/context/FileContext";
import {
    Diagram,
    OverviewType,
} from "@/app/dashboard/project/[id]/diagrams/_lib/constants";
import { getAllDiagrams } from "@/lib/projects";
import { DIAGRAM_TYPES } from "@/app/dashboard/project/[id]/diagrams/_lib/constants";

export default function ProjectDiagramsPage() {
    //Parameters
    const params = useParams();
    const projectId = params.id;
    const searchParams = useSearchParams();

    //State
    const [loading, setLoading] = useState(false);
    const [showGeneratingDialog, setShowGeneratingDialog] = useState(false);
    const [overview, setOverview] = useState<OverviewType>({
        title: "",
        description: "",
    });
    const [activeTab, setActiveTab] = useState("main-page");

    //Check tab
    const isRecentTab = searchParams.get("tabs") === "recent";

    //section hooks
    const {
        diagrams,
        selectedDiagram,
        selectDiagram,
        deselectDiagram,
        setDiagrams,
        diagramTypes,
        setDiagaramTypes,
    } = useDiagramManager();
    const { files } = useFileDataStore();

    useEffect(() => {
        async function fetchData() {
            try {
                const data: Diagram[] = await getAllDiagrams(
                    projectId as string
                );
                setDiagrams(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [projectId]);

    const handleGenerateDiagram = async () => {
        try {
            // Show loading state and dialog
            setLoading(true);
            setShowGeneratingDialog(true);

            //filter lai loai diagram
            const diagramTypesChoose = DIAGRAM_TYPES.filter(
                (type) => type.id === diagramTypes
            )[0].id as string;

            const formData = new FormData();

            formData.append("project_id", projectId as string);
            formData.append("description", overview.description);
            formData.append("title", overview.title);
            formData.append("diagram_type", diagramTypesChoose);

            files.forEach((f) => {
                formData.append("files", f.file);
            });

            const res = await fetch("/api/diagram", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to generate diagram");
            }

            const data = await res.json();
            console.log("Diagram generation response:", data);

            // Hide dialog and redirect
            setShowGeneratingDialog(false);
            setLoading(false);
            redirect(
                `/dashboard/project/${projectId}/diagrams?tabs=recent-documents&doc=${data}`
            );
        } catch (error) {
            console.error("Error generating diagram:", error);
            setShowGeneratingDialog(false);
            setLoading(false);
            // TODO: Show error toast/notification
        }
    };

    return (
        <main className="flex-1 overflow-auto">
            {/* Generating Dialog */}
            <GeneratingDialog open={showGeneratingDialog} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <PageHeader projectId={projectId} />

                {!selectedDiagram ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="main-page">
                                Create New
                            </TabsTrigger>
                            <TabsTrigger value="recent">
                                Recent Diagrams
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="main-page">
                            <CreateNewDiagramSection
                                overview={overview}
                                setOverview={setOverview}
                                diagramTypes={diagramTypes}
                                setDiagramTypes={setDiagaramTypes}
                            />
                            {/* Generate Button - Only shows on Create New tab */}
                            <div className="w-full flex justify-center mt-8">
                                <Button
                                    className="mx-auto cursor-pointer sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                                    onClick={handleGenerateDiagram}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-white dark:border-gray-700 border-t-transparent rounded-full"></div>
                                    ) : (
                                        <>
                                            <Plus className="text-white dark:text-black" />
                                            Generate Diagram
                                        </>
                                    )}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="recent">
                            <RecentDiagramsFilter />
                            <RecentDiagramsList
                                diagrams={diagrams}
                                onSelectDiagram={(id) => {
                                    selectDiagram(id);
                                    setActiveTab("recent");
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <DiagramDetail
                        diagram={selectedDiagram}
                        projectId={projectId as string}
                        onBack={() => {
                            deselectDiagram();
                            setActiveTab("recent");
                        }}
                    />
                )}
            </div>
        </main>
    );
}
