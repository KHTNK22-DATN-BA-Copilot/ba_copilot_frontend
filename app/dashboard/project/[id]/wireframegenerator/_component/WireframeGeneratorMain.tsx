"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Monitor, Smartphone, Tablet } from "lucide-react";
import FileUpload from "@/components/file/FileUpload";
import { useFileDataStore } from "@/context/FileContext";
import { redirect } from "next/navigation";

export default function WireframeGeneratorMain({project_id}: {project_id: string}) {
    const [selectedDevice, setSelectedDevice] = useState<
        "desktop" | "tablet" | "mobile"
    >("desktop");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const {files} = useFileDataStore();


    const handleGenerateWireframe = async () => {
        setLoading(true);
        // Add your generation logic here

        const formData = new FormData();
        formData.append("project_id", project_id);
        formData.append("device_type", selectedDevice)
        formData.append("wireframe_name", name)
        formData.append("description", description)

        files.forEach((file) => {
            formData.append(`files`, file.file);
        });

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const res = await fetch("/api/wireframe-generate", {
            method: "POST",
            body: formData,
        });
        const wireframe_id = await res.json();
        setLoading(false);
        redirect(`/dashboard/project/${project_id}/wireframegenerator?wireframe_id=${wireframe_id}`);
    };

    return (
        <div className="col-span-12 space-y-8">
            {/* Document Upload Section */}
            <FileUpload description="Upload project Document to gen wireframe" />

            {/* Device Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Select Device Type
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Choose the target device for your wireframe
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => setSelectedDevice("desktop")}
                            className={`p-6 border-2 rounded-lg transition-all group ${
                                selectedDevice === "desktop"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                            }`}
                        >
                            <Monitor
                                className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedDevice === "desktop"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                }`}
                            />
                            <p className="text-sm text-center font-medium text-gray-900 dark:text-gray-100">
                                Desktop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                                1920 × 1080
                            </p>
                        </button>
                        <button
                            onClick={() => setSelectedDevice("tablet")}
                            className={`p-6 border-2 rounded-lg transition-all group ${
                                selectedDevice === "tablet"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                            }`}
                        >
                            <Tablet
                                className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedDevice === "tablet"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                }`}
                            />
                            <p className="text-sm text-center font-medium text-gray-900 dark:text-gray-100">
                                Tablet
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                                768 × 1024
                            </p>
                        </button>
                        <button
                            onClick={() => setSelectedDevice("mobile")}
                            className={`p-6 border-2 rounded-lg transition-all group ${
                                selectedDevice === "mobile"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                            }`}
                        >
                            <Smartphone
                                className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedDevice === "mobile"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                }`}
                            />
                            <p className="text-sm text-center font-medium text-gray-900 dark:text-gray-100">
                                Mobile
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                                375 × 667
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Wireframe Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Wireframe Configuration
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Configure your wireframe settings
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wireframe-name">Wireframe Name</Label>
                        <Input
                            id="wireframe-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="E.g., Admin Dashboard"
                            className="dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                </div>
            </div>


            {/* AI Generation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Generate with AI
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Describe what you want to create
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Wireframe Description
                            </Label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 resize-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="E.g., Create a dashboard with a sidebar navigation, top header with search bar, cards showing key metrics, and a data table below..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="w-full flex justify-center">
                <Button
                    className="mx-auto cursor-pointer sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                    onClick={handleGenerateWireframe}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white dark:border-gray-700 border-t-transparent rounded-full"></div>
                    ) : (
                        <>
                            <Plus className="text-white dark:text-black" />
                            Generate Wireframe
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
