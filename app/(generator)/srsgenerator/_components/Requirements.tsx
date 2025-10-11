"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";

export default function Requirements() {
    const { requirements, handleRequirements, constrain, handleConstrain } =
        useSRSGeneratorDataStore();
    const functionalRequirements = requirements.filter(
        (req) => req.type === "functional"
    );
    const nonFunctionalRequirements = requirements.filter(
        (req) => req.type === "non-functional"
    );

    const addNewFunctionalRequirement = () => {
        handleRequirements({
            actionState: "add",
            data: {
                id: crypto.randomUUID(),
                name: "Functional 1",
                type: "functional",
            },
        });
    };
    const addNewNonFunctionalRequirement = () => {
        handleRequirements({
            actionState: "add",
            data: {
                id: crypto.randomUUID(),
                name: "Non-Functional 1",
                type: "non-functional",
            },
        });
    };

    const handleEditRequirement = (id: string, newName: string) => {
        handleRequirements({
            actionState: "update",
            data: {
                id,
                name: newName,
                type: functionalRequirements.find((req) => req.id === id)
                    ? "functional"
                    : "non-functional",
            },
        });
    };
    const handleDeleteRequirement = (id: string) => {
        handleRequirements({
            actionState: "delete",
            id,
        });
    };

    return (
        <>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Requirements Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Add functional and non-functional requirements line by line
            </p>

            {/* Functional Requirements */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        Functional Requirements
                    </h2>
                </div>

                <div className="space-y-3">
                    {functionalRequirements.length !== 0 ? (
                        functionalRequirements.map((req) => (
                            <div
                                key={req.id}
                                className="flex items-center justify-between  dark:bg-gray-700 rounded-lg"
                            >
                                <Input
                                    className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                    value={req.name}
                                    onChange={(e) => {
                                        handleEditRequirement(
                                            req.id,
                                            e.target.value
                                        );
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() =>
                                        handleDeleteRequirement(req.id)
                                    }
                                >
                                    <Trash />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No functional requirements added yet.
                        </p>
                    )}
                    <Button
                        size="sm"
                        onClick={addNewFunctionalRequirement}
                        className="cursor-pointer"
                    >
                        <Plus />
                        Add Requirement
                    </Button>
                </div>
            </div>

            {/* Non-Functional Requirements */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        Non-Functional Requirements
                    </h2>
                </div>

                <div className="space-y-3">
                    {nonFunctionalRequirements.length !== 0 ? (
                        nonFunctionalRequirements.map((req, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between  dark:bg-gray-700 rounded-lg"
                            >
                                <Input
                                    className="text-sm text-gray-700 dark:text-gray-300 mr-2"
                                    value={req.name}
                                    onChange={(e) => {
                                        handleEditRequirement(
                                            req.id,
                                            e.target.value
                                        );
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={() =>
                                        handleDeleteRequirement(req.id)
                                    }
                                >
                                    <Trash />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No non-functional requirements added yet.
                        </p>
                    )}
                    <Button
                        size="sm"
                        onClick={addNewNonFunctionalRequirement}
                        className="cursor-pointer"
                    >
                        <Plus />
                        Add Requirement
                    </Button>
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
                    value={constrain}
                    onChange={(e) => handleConstrain(e.target.value)}
                />
            </div>
        </>
    );
}
