import { Metadata } from "next";
import WireframeGeneratorMain from "./_component/WireframeGeneratorMain";
import RecentWireframes from "./_component/RecentWireframes";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Wireframe Generator - BA Copilot",
    description:
        "Create professional wireframes and mockups for your applications and websites using AI-powered generation and intuitive design tools.",
};

export default async function WireframeGeneratorPage({
    searchParams,
    params,
}: {
    searchParams: { tabs?: string };
    params: { id: string };
}) {
    const { tabs } = await searchParams;
    const { id } = await params;

    return (
        <>
            <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                <Link
                    href={`/dashboard/project/${id}/wireframegenerator`}
                    className={`p-2 rounded-2xl font-semibold text-sm ${tabs === undefined
                            ? "bg-white dark:bg-gray-800 dark:text-white"
                            : "dark:text-gray-300"
                        }`}
                >
                    Create new
                </Link>
                <Link
                    href={`/dashboard/project/${id}/wireframegenerator?tabs=recent-wireframes`}
                    className={`p-2 rounded-2xl font-semibold text-sm ${tabs === "recent-wireframes"
                            ? "bg-white dark:bg-gray-800 dark:text-white"
                            : "dark:text-gray-300"
                        }`}
                >
                    Recent Wireframes
                </Link>
            </div>
            {tabs === "recent-wireframes" ? (
                <RecentWireframes />
            ) : (
                <WireframeGeneratorMain />
            )}
        </>
    );
}
