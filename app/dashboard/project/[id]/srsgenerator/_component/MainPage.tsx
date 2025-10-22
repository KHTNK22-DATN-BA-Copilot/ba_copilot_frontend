"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import FileUpload from "./FileUpload";
import ProjectOverview from "./ProjectOverview";
import Requirements from "./Requirements";
import Diagrams from "./Diagrams";

import { FcDocument } from "react-icons/fc";
import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function SRSGeneratorPage() {
    const { diagrams, requirements, projectOverview, constrain, files } =
        useSRSGeneratorDataStore();
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const projectId = params.id;
    const GenerateDocument = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("project_id", projectId as string);
        formData.append("project_name", projectOverview.projectName as string);

        //update this description variable, know that in requirements is an array of object, each object include id name and type, I want to fill the name field
        const requirementNames = requirements.map((req) => req.name).join("\n");
        const description = `${projectOverview.description}\n\nRequirements:\n${requirementNames}\n\n`;
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
    };

    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                <FileUpload />
            </div>

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
