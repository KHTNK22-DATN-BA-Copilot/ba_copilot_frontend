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

export default function SRSGeneratorPage() {
    const { diagrams, requirements, projectOverview, constrain } =
        useSRSGeneratorDataStore();
    const params = useParams();
    const projectId = params.id;
    const GenerateDocument = async () => {
        const response = await fetch("/api/srs-generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                projectOverview,
                requirements,
                diagrams,
                constrain,
            }),
        });
        const data = await response.json();
        console.log("Generated SRS Document: ", data);
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

            <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                    <Diagrams />
                </div>
            </div>

            <div className="col-span-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Generate SRS Document
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        AI will create a comprehensive SRS based on your inputs
                    </p>

                    <Button
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-white text-sm font-medium rounded-lg transition-colors duration-200 dark:text-black"
                        onClick={GenerateDocument}
                    >
                        <FcDocument className="text-white" />
                        Generate Document
                    </Button>
                </div>
            </div>
        </div>
    );
}
