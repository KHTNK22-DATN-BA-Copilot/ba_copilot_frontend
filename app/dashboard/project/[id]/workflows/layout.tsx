import {Metadata} from 'next'

export const metadata: Metadata = {
    title: "Workflow",
    description: "Project workflow",
}

export default function WorkflowsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="workflows-layout">
            {children}
        </div>
    );
}
