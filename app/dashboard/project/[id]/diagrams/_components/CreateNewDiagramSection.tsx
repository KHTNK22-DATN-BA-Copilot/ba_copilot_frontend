import { DiagramTypeSelector } from './DiagramTypeSelector';
import { FileUploadSection } from './FileUploadSection';
import { AIGenerationForm } from './AIGenerationForm';

export function CreateNewDiagramSection() {
    return (
        <div className="space-y-6">
            <DiagramTypeSelector />
            <FileUploadSection />
            <AIGenerationForm />
        </div>
    );
}
