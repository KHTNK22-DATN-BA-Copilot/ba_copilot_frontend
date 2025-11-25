"use client";
import { Button } from "@/components/ui/button";

import FileUpload from "@/components/file/FileUpload";
import ProjectOverview from "./ProjectOverview";
import Requirements from "./Requirements";

import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";
import { redirect, useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFileDataStore } from "@/context/FileContext";

export default function SRSGeneratorPage() {
    const { diagrams, requirements, projectOverview, constrain } =
        useSRSGeneratorDataStore();
    const { files } = useFileDataStore();
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const projectId = params.id;
    const GenerateDocument = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("project_id", projectId as string);
        formData.append("project_name", projectOverview.projectName as string);

        //update this description variable, know that in requirements is an array of object, each object include id name and type, I want to fill the name field

        const description = `Project Description: ${projectOverview.description}\n\nRequirements:\n${requirements}\n\nConstraints & Assumptions:\n${constrain}`
        formData.append("description", description as string);

        files.forEach((f) => {
            formData.append("files", f.file);
        });

        const response = await fetch("/api/srs-generate", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log("Generated SRS Document: ", data);
        setLoading(false)
        redirect(`/dashboard/project/${projectId}/srsgenerator?tabs=recent-documents&doc=${data}`);
    };

    return (
        <div className="col-span-12">
                
            {/* <FileUpload description="Upload any documents related to your project for AI analysis"/> */}
            

            <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                    <ProjectOverview />
                </div>
            </div>

            <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                    <Requirements />
                </div>
            </div>

            {/* <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                    <Diagrams />
                </div>
            </div> */}

            <div className="w-full flex justify-center">
                <Button
                    className="mx-auto cursor-pointer sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                    onClick={GenerateDocument}
                    disabled={loading}
                >
                    {/** create loading spinner */}
                    {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white dark:border-gray-700 border-t-transparent rounded-full"></div>
                    ) : (
                        <>
                            <Plus className="text-white" />
                            Generate Document
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
