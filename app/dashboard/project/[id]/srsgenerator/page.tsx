import { Metadata } from "next";

import MainPage from "@/app/dashboard/project/[id]/srsgenerator/_component/CreateDocument/MainPage";
import RecentDocument from "./_component/DocumentOverview/RecentDocment";
import DocumentViewer from "./_component/DocumentOverview/DocumentViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SrsDataStoreProvider } from "@/context/SRSGeneratorContext";
import { FileDataStoreProvider } from "@/context/FileContext";

export const metadata: Metadata = {
    title: "SRS Generator - BA Copilot",
    description:
        "Generate comprehensive Software Requirements Specification (SRS) documents automatically based on your project requirements and business rules.",
};

export default async function SRSGeneratorPage({
    searchParams,
    params,
}: {
    searchParams: { tabs?: string; doc?: string };
    params: { id: string };
}) {
    const tabs = (await searchParams).tabs;
    const doc = (await searchParams).doc;
    const { id } = await params;
    return (
        <FileDataStoreProvider>
            <SrsDataStoreProvider>
                {doc ? (
                    <DocumentViewer projectId={id} />
                ) : (
                    <Tabs defaultValue="main-page">
                        <TabsList>
                            <TabsTrigger value="main-page">
                                Create new
                            </TabsTrigger>
                            <TabsTrigger value="template">Template</TabsTrigger>
                            <TabsTrigger value="recent-documents">
                                Recent Documents
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="main-page">
                            <MainPage />
                        </TabsContent>
                        <TabsContent value="recent-documents">
                            <RecentDocument id={id} />
                        </TabsContent>
                    </Tabs>
                )}
            </SrsDataStoreProvider>
        </FileDataStoreProvider>
    );
}
