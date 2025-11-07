"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";

export default function Requirements() {
    const { requirements, handleRequirements, constrain, handleConstrain } =
        useSRSGeneratorDataStore();
    
    return (
        <>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Requirements Details
            </h1>

            {/* Functional Requirements */}
            <div className="mb-8">

                <Textarea
                    placeholder="Any specific functional requirements..."
                    className="w-full min-h-[120px] resize-none"
                    value={requirements}
                    onChange={(e) => handleRequirements(e.target.value)}
                />
            </div>

            

            {/* Constraints & Assumptions */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
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
