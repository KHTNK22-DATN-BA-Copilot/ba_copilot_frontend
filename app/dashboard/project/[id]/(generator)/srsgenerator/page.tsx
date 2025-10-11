import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "SRS Generator - BA Copilot",
    description:
        "Generate comprehensive Software Requirements Specification (SRS) documents automatically based on your project requirements and business rules.",
};

export default function SRSGeneratorPage() {
    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Page Header */}
                    <div className="col-span-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/dashboard"
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 xl:hidden"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        📋 SRS Generator
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Generate comprehensive SRS documents
                                        automatically
                                    </p>
                                </div>
                            </div>

                            <Button className="inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Generate SRS
                            </Button>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="col-span-12">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                            <h1>Upload Project Documents</h1>
                            <h1 className="text-sm text-gray-500">
                                Upload any documents related to your project for
                                AI analysis
                            </h1>
                            <div className="border-2 mt-5 cursor-pointer border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-400 dark:hover:border-gray-500 transition-colors duration-200">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-16 h-16 text-gray-400 dark:text-gray-500">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            className="w-full h-full"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            PDF, DOC, DOCX, TXT (max 10MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                        multiple
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <h1>Project information</h1>
                                <h1 className="text-sm text-gray-500">
                                    Provide basic details about your project
                                </h1>
                                <section className="flex flex-col sm:flex-row sm:gap-5 w-full mt-5">
                                    <div className="w-full">
                                        <Label htmlFor="project-name">
                                            Project Name
                                        </Label>
                                        <Input
                                            id="project-name"
                                            type="text"
                                            placeholder="E.g., Online Bookstore"
                                            className="mt-2 mb-4 w-full max-w-md"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Label htmlFor="version">Version</Label>
                                        <Input
                                            id="version"
                                            type="text"
                                            placeholder="1.0"
                                            className="mt-2 mb-4 w-full max-w-md"
                                            defaultValue={1.0}
                                        />
                                    </div>
                                </section>
                                <section>
                                    <Label htmlFor="overview">
                                        Project Description
                                    </Label>
                                    <Textarea
                                        id="overview"
                                        placeholder="E.g., This project is about..."
                                        className="mt-2 mb-4 w-full"
                                    />
                                </section>
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Requirements Details
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Add functional and non-functional
                                    requirements line by line
                                </p>

                                {/* Functional Requirements */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-md font-medium text-gray-900 dark:text-gray-100">
                                            Functional Requirements
                                        </h2>
                                        <Button variant="outline" size="sm">
                                            <Plus />
                                            <span className="hidden md:block">Add Requirement</span>
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between  dark:bg-gray-700 rounded-lg">
                                            <Input
                                                className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                                defaultValue={
                                                    "User Authenticate"
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between  dark:bg-gray-700 rounded-lg">
                                            <Input
                                                className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                                defaultValue={"Dashboard view"}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Non-Functional Requirements */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-md font-medium text-gray-900 dark:text-gray-100">
                                            Non-Functional Requirements
                                        </h2>
                                        <Button variant="outline" size="sm">
                                            <Plus />
                                            <span className="hidden md:block">Add Requirement</span>
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between  dark:bg-gray-700 rounded-lg">
                                            <Input
                                                className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                                defaultValue={
                                                    "Response time &lt; 2s"
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between  dark:bg-gray-700 rounded-lg">
                                            <Input
                                                className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                                defaultValue={"99.9% uptime"}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Constraints & Assumptions */}
                                <div>
                                    <h2 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        Constraints & Assumptions
                                    </h2>
                                    <Textarea
                                        placeholder="Any technical constraints, business rules, or assumptions..."
                                        className="w-full min-h-[120px] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Include Diagrams
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Select which diagrams to generate in your
                                    SRS document
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="sequence-diagram" />
                                        <label
                                            htmlFor="sequence-diagram"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            Sequence Diagram - Shows interaction
                                            flow between components
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="class-diagram" />
                                        <label
                                            htmlFor="architecture-diagram"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            Architecture Diagram - System
                                            architecture and components overview
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox id="use-case-diagram" />
                                        <label
                                            htmlFor="use-case-diagram"
                                            className="text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            Use Case Diagram - User interactions
                                            and system functionalities
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Generate SRS Document
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    AI will create a comprehensive SRS based on
                                    your inputs
                                </p>

                                <Button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Generate Document
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
