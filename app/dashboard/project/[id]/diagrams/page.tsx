"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "./_components/PageHeader";
import { CreateNewDiagramSection } from "./_components/CreateNewDiagramSection";
import { DiagramDetail } from "./_components/DiagramDetail";
import { RecentDiagramsList } from "./_components/RecentDiagramsList";
import { useDiagramManager } from "./_lib/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RecentDiagramsFilter from "./_components/RecentDiagramsFilter";

import { useFileDataStore } from "@/context/FileContext";
import { Diagram, OverviewType } from "@/app/dashboard/project/[id]/diagrams/_lib/constants";
import { getAllDiagrams } from "@/lib/projects";

export default function ProjectDiagramsPage() {
    const [loading, setLoading] = useState(false);
    const [overview, setOverview] = useState<OverviewType>({ title: "", description: "" });
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id;
    const isRecentTab = searchParams.get("tabs") === "recent";

    const { diagrams, selectedDiagram, selectDiagram, deselectDiagram, setDiagrams } =
        useDiagramManager();
    const { files } = useFileDataStore();

    useEffect(() => {
        async function fetchData() {
            try {
                const data: Diagram[] = await getAllDiagrams(projectId);
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
        // Logic to generate a new diagram
        console.log("Generate Diagram button clicked");
        const formData = new FormData();

        formData.append("project_id", projectId as string);
        formData.append("style", "modern");
        formData.append("description", overview.description);
        formData.append("title", overview.title);

        files.forEach((f) => {
            formData.append("files", f.file);
        });
        const res = await fetch('/api/diagram', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        console.log("Diagram generation response:", data)
    };

    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <PageHeader projectId={projectId} />

                {/* Tab Navigation - Hidden when diagram is selected */}
                {!selectedDiagram && (
                    <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                        <Link
                            href={`/dashboard/project/${projectId}/diagrams`}
                            className={`p-2 rounded-2xl font-semibold text-sm ${
                                !isRecentTab
                                    ? "bg-white dark:bg-gray-800 dark:text-white"
                                    : "dark:text-gray-300"
                            }`}
                        >
                            Create New
                        </Link>
                        <Link
                            href={`/dashboard/project/${projectId}/diagrams?tabs=recent`}
                            className={`p-2 rounded-2xl font-semibold text-sm ${
                                isRecentTab
                                    ? "bg-white dark:bg-gray-800 dark:text-white"
                                    : "dark:text-gray-300"
                            }`}
                        >
                            Recent Diagrams
                        </Link>
                    </div>
                )}

                {/* Content */}
                {selectedDiagram ? (
                    <DiagramDetail
                        diagram={selectedDiagram}
                        onBack={deselectDiagram}
                    />
                ) : isRecentTab ? (
                    <div className="mb-12">
                        <RecentDiagramsFilter />
                        <RecentDiagramsList
                            diagrams={diagrams}
                            onSelectDiagram={selectDiagram}
                        />
                    </div>
                ) : (
                    <div>
                        <CreateNewDiagramSection overview={overview} setOverview={setOverview} />
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
                    </div>
                )}
            </div>
        </main>
    );
}
