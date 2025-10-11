import { Metadata } from "next";
import { SrsDataStoreProvider } from "@/context/SRSGeneratorContext";
import MainPage from "@/app/(generator)/srsgenerator/_components/MainPage"

export const metadata: Metadata = {
    title: "SRS Generator - BA Copilot",
    description:
        "Generate comprehensive Software Requirements Specification (SRS) documents automatically based on your project requirements and business rules.",
};

export default function SRSGeneratorPage() {
    return (
        <SrsDataStoreProvider>
            <MainPage />
        </SrsDataStoreProvider>
    );
}
