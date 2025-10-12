"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";

export default function ProjectOverview() {
    const { projectOverview, handleProjectOverview } = useSRSGeneratorDataStore();

    return (
        <>
            <h1>Project information</h1>
            <h1 className="text-sm text-gray-500">
                Provide basic details about your project
            </h1>
            <section className="flex flex-col sm:flex-row sm:gap-5 w-full mt-5">
                <div className="w-full">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                        id="project-name"
                        type="text"
                        placeholder="E.g., Online Bookstore"
                        className="mt-2 mb-4 w-full max-w-md"
                        value={projectOverview.projectName}
                        onChange={(e) =>
                            handleProjectOverview({
                                ...projectOverview,
                                projectName: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="w-full">
                    <Label htmlFor="version">Version</Label>
                    <Input
                        id="version"
                        type="text"
                        placeholder="1.0"
                        className="mt-2 mb-4 w-full max-w-md"
                        value={projectOverview.version}
                        onChange={(e) =>
                            handleProjectOverview({
                                ...projectOverview,
                                version: e.target.value,
                            })
                        }
                    />
                </div>
            </section>
            <section>
                <Label htmlFor="overview">Project Description</Label>
                <Textarea
                    id="overview"
                    placeholder="E.g., This project is about..."
                    className="mt-2 mb-4 w-full"
                    value={projectOverview.description}
                    onChange={(e) =>
                        handleProjectOverview({
                            ...projectOverview,
                            description: e.target.value,
                        })
                    }
                />
            </section>
        </>
    );
}
