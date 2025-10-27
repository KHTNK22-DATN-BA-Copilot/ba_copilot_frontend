"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Monitor,
    Smartphone,
    Tablet,
    Upload,
    X,
    FileText,
} from "lucide-react";

export default function WireframeGeneratorMain() {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<
        "desktop" | "tablet" | "mobile"
    >("desktop");
    const [selectedPageType, setSelectedPageType] = useState<string>("dashboard");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");


    const pageTypes = [
        { id: "landing", name: "Landing Page" },
        { id: "dashboard", name: "Dashboard" },
        { id: "form", name: "Form Page" },
        { id: "profile", name: "Profile Page" },
        { id: "settings", name: "Settings" },
        { id: "list", name: "List View" },
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileNames = Array.from(files).map((f) => f.name);
            setUploadedFiles([...uploadedFiles, ...fileNames]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    const handleGenerateWireframe = async () => {
        setLoading(true);
        // Add your generation logic here

        const formData = new FormData();
        formData.append("device_type", selectedDevice);
        formData.append("page_type", selectedPageType);
        formData.append("name", name);
        formData.append("description", description); // You can add description here
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="col-span-12 space-y-8">
            {/* Document Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Upload Reference Documents
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Upload documents related to your wireframe for AI
                            reference
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                            type="file"
                            id="wireframe-file-upload"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.fig"
                        />
                        <label
                            htmlFor="wireframe-file-upload"
                            className="cursor-pointer"
                        >
                            <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                            <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF, DOC, DOCX, TXT, Images, Figma files (max
                                10MB)
                            </p>
                        </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {file}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
                            className={`p-6 border-2 rounded-lg transition-all group ${selectedDevice === "desktop"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                                }`}
                        >
                            <Monitor
                                className={`w-8 h-8 mx-auto mb-2 ${selectedDevice === "desktop"
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
                            className={`p-6 border-2 rounded-lg transition-all group ${selectedDevice === "tablet"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                                }`}
                        >
                            <Tablet
                                className={`w-8 h-8 mx-auto mb-2 ${selectedDevice === "tablet"
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
                            className={`p-6 border-2 rounded-lg transition-all group ${selectedDevice === "mobile"
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                                }`}
                        >
                            <Smartphone
                                className={`w-8 h-8 mx-auto mb-2 ${selectedDevice === "mobile"
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
                            <Label htmlFor="page-type">Page Type</Label>
                            <Select defaultValue="dashboard">
                                <SelectTrigger id="page-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                        >
                                            setSelectedPageType(type.id)
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    <div className="space-y-2">
                        <Label htmlFor="wireframe-name">Wireframe Name</Label>
                        <Input
                            id="wireframe-name"
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
                                className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 resize-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="E.g., Create a dashboard with a sidebar navigation, top header with search bar, cards showing key metrics, and a data table below..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="components">
                                Required Components (Optional)
                            </Label>
                            <Input
                                id="components"
                                placeholder="E.g., navigation, search, cards, table, charts"
                                className="dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color-scheme">
                                    Color Scheme
                                </Label>
                                <Select defaultValue="light">
                                    <SelectTrigger id="color-scheme">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            Light
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            Dark
                                        </SelectItem>
                                        <SelectItem value="auto">
                                            Auto
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style">Style</Label>
                                <Select defaultValue="modern">
                                    <SelectTrigger id="style">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="modern">
                                            Modern
                                        </SelectItem>
                                        <SelectItem value="minimal">
                                            Minimal
                                        </SelectItem>
                                        <SelectItem value="classic">
                                            Classic
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
