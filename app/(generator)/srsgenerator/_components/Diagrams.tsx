'use client'
import { Checkbox } from "@/components/ui/checkbox";
import { useSRSGeneratorDataStore } from "@/context/SRSGeneratorContext";

export default function Diagrams() {
    const { diagrams, handleDiagrams } = useSRSGeneratorDataStore();

    
    const handleCheckChange = (id: string) => {
        handleDiagrams(id);
    };

    return (
        <>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Include Diagrams
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Select which diagrams to generate in your SRS document
            </p>

            <div className="space-y-4">
                {diagrams.map((option) => {
                    return (
                        <div className="flex items-center space-x-3" key={option.id}>
                            <Checkbox 
                                id={option.id} 
                                checked={option.isCheck} 
                                onCheckedChange={(checked) => 
                                    handleCheckChange(option.id)
                                }
                            />
                            <label
                                htmlFor={option.id}
                                className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                                {option.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
