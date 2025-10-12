import { Metadata } from "next";
import { SrsDataStoreProvider } from "@/context/SRSGeneratorContext";
import MainPage from "@/app/dashboard/project/[id]/srsgenerator/_component/MainPage";
import RecentDocument from "./_component/RecentDocment";
import Link from "next/link";
import Template from "./_component/Template";

export const metadata: Metadata = {
    title: "SRS Generator - BA Copilot",
    description:
        "Generate comprehensive Software Requirements Specification (SRS) documents automatically based on your project requirements and business rules.",
};

export default async function SRSGeneratorPage({
    searchParams,
    params,
}: {
    searchParams: { tabs?: string };
    params: { id: string };
}) {
    const tabs = (await searchParams).tabs;
    const { id } = await params;
    return (
        <>
            <SrsDataStoreProvider>
                <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                    <Link
                        href={`/dashboard/project/${id}/srsgenerator`}
                        className={`p-2 rounded-2xl font-semibold text-sm ${
                            tabs === undefined ? 'bg-white dark:bg-gray-800 dark:text-white' : 'dark:text-gray-300'
                        }`}
                    >
                        Create new
                    </Link>
                    <Link
                        href={`/dashboard/project/${id}/srsgenerator?tabs=template`}
                        className={`p-2 rounded-2xl font-semibold text-sm ${
                            tabs === 'template' ? 'bg-white dark:bg-gray-800 dark:text-white' : 'dark:text-gray-300'
                        }`}
                    >
                        Template
                    </Link>
                    <Link
                        href={`/dashboard/project/${id}/srsgenerator?tabs=recent-documents`}
                        className={`p-2 rounded-2xl font-semibold text-sm ${
                            tabs === 'recent-documents' ? 'bg-white dark:bg-gray-800 dark:text-white' : 'dark:text-gray-300'
                        }`}
                    >
                        Recent Document
                    </Link>
                </div>
                {tabs === "recent-documents" ? (
                    <RecentDocument />
                ) : tabs === "template" ? (
                    <Template />
                ) : (
                    <MainPage />
                )}
            </SrsDataStoreProvider>
        </>
    );
}
