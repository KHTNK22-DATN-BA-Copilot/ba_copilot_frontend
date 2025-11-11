import { Metadata } from "next";
import WireframeGeneratorMain from "./_component/WireframeGeneratorMain";
import RecentWireframes from "./_component/RecentWireframes";
import { FileDataStoreProvider } from "@/context/FileContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WireframeOverview from "./_component/WireframeOverview";

export const metadata: Metadata = {
    title: "Wireframe Generator - BA Copilot",
    description:
        "Create professional wireframes and mockups for your applications and websites using AI-powered generation and intuitive design tools.",
};

export default async function WireframeGeneratorPage({
    searchParams,
    params,
}: {
    searchParams: { wireframe_id?: string };
    params: { id: string };
}) {

    const project_id = (await params).id;
    const wireframe_id = (await searchParams).wireframe_id;

    if (wireframe_id) {
        return (
            <WireframeOverview project_id={project_id} wireframe_id={wireframe_id}/>
        )
    }

    return (
        <Tabs defaultValue={"create-new"}>
            <TabsList>
                <TabsTrigger value="create-new">Create new</TabsTrigger>
                <TabsTrigger value="recent-wireframes">
                    Recent Wireframes
                </TabsTrigger>
            </TabsList>
            <TabsContent value="create-new">
                <FileDataStoreProvider>
                    <WireframeGeneratorMain project_id={project_id} />
                </FileDataStoreProvider>
            </TabsContent>
            <TabsContent value="recent-wireframes">
                <RecentWireframes project_id={project_id} />
            </TabsContent>
        </Tabs>
    );
}
