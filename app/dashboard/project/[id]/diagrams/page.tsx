'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Database, Workflow, Network, Upload, Download, Share2, ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";

export default function ProjectDiagramsPage() {
    const params = useParams();
    const projectId = params.id;
    const [selectedDiagram, setSelectedDiagram] = useState<number | null>(null);

    const diagramTypes = [
        { id: "usecase", name: "Usecase Diagram", icon: Workflow },
        { id: "class", name: "Class Diagram", icon: Database },
        { id: "activity", name: "Activity Diagram", icon: GitBranch },
    ];

    const recentDiagrams = [
        {
            id: 1,
            name: "User Authentication Flow",
            type: "Usecase Diagram",
            date: "2 days ago",
            preview: "diagram-preview-url",
            markdown: "# User Authentication Flow\n\n## Actors\n- User\n- System\n- Email Service\n\n## Use Cases\n1. Login\n2. Register\n3. Reset Password"
        },
        {
            id: 2,
            name: "Database Schema",
            type: "Class Diagram",
            date: "3 days ago",
            preview: "diagram-preview-url",
            markdown: "# Database Schema\n\n## Classes\n\n### User\n- id: integer\n- username: string\n- email: string\n\n### Project\n- id: integer\n- name: string\n- description: text"
        },
        {
            id: 3,
            name: "API Sequence",
            type: "Activity Diagram",
            date: "1 week ago",
            preview: "diagram-preview-url",
            markdown: "# API Activity Diagram\n\n## Activities\n1. User initiates request\n2. System validates input\n3. Process data\n4. Return response"
        },
    ];

    // Get selected diagram data
    const selectedDiagramData = recentDiagrams.find(d => d.id === selectedDiagram);

    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="col-span-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/dashboard/project/${projectId}`}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 xl:hidden"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Diagrams
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Create visual diagrams for your projects
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="create" className="space-y-6">
                    <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                        <TabsList className="bg-transparent">
                            <TabsTrigger
                                value="create"
                                className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                            >
                                Create New
                            </TabsTrigger>
                            <TabsTrigger
                                value="recent"
                                className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                            >
                                Recent Diagrams
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="create" className="space-y-6">
                        {/* Diagram Type Selection */}
                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Select Diagram Type</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose the type of diagram you want to create</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {diagramTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
                                                >
                                                    <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                                                    <p className="text-sm text-center text-gray-900 dark:text-gray-100">{type.name}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Reference Files</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload files to help generate your diagram</p>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-sm mb-2 text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, TXT (Max 10MB)</p>
                                        <Input type="file" className="hidden" id="diagram-file-upload" accept=".pdf,.docx,.txt" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Generation Form */}
                        <div className="col-span-12">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate with AI</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Describe what you want to visualize and let AI create it</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">Diagram Description</Label>
                                            <textarea
                                                id="description"
                                                className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="E.g., Create a flowchart showing the user registration process with email verification and profile setup steps..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="complexity" className="text-gray-900 dark:text-gray-100">Complexity</Label>
                                                <Select defaultValue="medium">
                                                    <SelectTrigger id="complexity" className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="simple">Simple</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="complex">Complex</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="style" className="text-gray-900 dark:text-gray-100">Style</Label>
                                                <Select defaultValue="modern">
                                                    <SelectTrigger id="style" className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="modern">Modern</SelectItem>
                                                        <SelectItem value="classic">Classic</SelectItem>
                                                        <SelectItem value="minimal">Minimal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                            Generate Diagram
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="recent">
                        {selectedDiagram ? (
                            // Detailed Diagram View
                            <div className="space-y-6">
                                {/* Back Button */}
                                <Button
                                    variant="ghost"
                                    className="gap-2"
                                    onClick={() => setSelectedDiagram(null)}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Recent Diagrams
                                </Button>

                                {/* Diagram Header */}
                                <div className="col-span-12">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                                        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <Workflow className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{selectedDiagramData?.name}</h2>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {selectedDiagramData?.type} • Created {selectedDiagramData?.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Share2 className="w-4 h-4" />
                                                    Share
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Diagram Tabs */}
                                <Tabs defaultValue="preview">
                                    <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                                        <TabsList className="bg-transparent">
                                            <TabsTrigger
                                                value="preview"
                                                className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                                            >
                                                Preview
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="edit"
                                                className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                                            >
                                                Edit
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="preview" className="mt-6">
                                        <div className="col-span-12">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 min-h-96 flex items-center justify-center">
                                                    <div className="text-center space-y-4">
                                                        <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
                                                        <div>
                                                            <p className="text-gray-600 dark:text-gray-400">Diagram Preview</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-500">Visual representation would appear here</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="edit" className="mt-6">
                                        <div className="col-span-12">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Markdown Source</h3>
                                                        <Button variant="outline" size="sm">Save Changes</Button>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-96 font-mono text-sm">
                                                        <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{selectedDiagramData?.markdown}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            // List of Recent Diagrams
                            <div className="col-span-12">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                                    <div className="space-y-4">
                                        {recentDiagrams.map((diagram) => (
                                            <div
                                                key={diagram.id}
                                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-600"
                                                onClick={() => setSelectedDiagram(diagram.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                        <Workflow className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">{diagram.name}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{diagram.type} • {diagram.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
