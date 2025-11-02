import { DiagramTypeSelector } from './DiagramTypeSelector';
import { FileUploadSection } from './FileUploadSection';
import { AIGenerationForm } from './AIGenerationForm';
import { useState } from 'react';

export function CreateNewDiagramSection() {
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        console.log("Submit AI generation for:", description);
        // gọi API, update state, v.v.
    };
    return (
        <div className="space-y-6">
            <DiagramTypeSelector />
            <FileUploadSection />
            <AIGenerationForm
                description={description}
                onChange={setDescription}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
