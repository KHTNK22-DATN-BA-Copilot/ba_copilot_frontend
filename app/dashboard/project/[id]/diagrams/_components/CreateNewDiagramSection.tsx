import { DiagramTypeSelector } from './DiagramTypeSelector';
import { AIGenerationForm } from './AIGenerationForm';
import FileUpload from "@/components/file/FileUpload"
import { OverviewType } from '@/app/dashboard/project/[id]/diagrams/_lib/constants';


export function CreateNewDiagramSection({overview, setOverview}: {overview: OverviewType , setOverview: any}) {

    const handleSubmit = () => {
        console.log("Submit AI generation for:", overview);
        // gọi API, update state, v.v.
    };
    return (
        <div className="space-y-6">
            <DiagramTypeSelector />
            <FileUpload description="Upload any documents related to your project for AI analysis"/>
            <AIGenerationForm
                overview={overview}
                onChange={setOverview}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
