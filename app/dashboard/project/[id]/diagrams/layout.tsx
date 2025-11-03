import { FileDataStoreProvider } from "@/context/FileContext";
export default function DiagramLayout({ children }: { children: React.ReactNode }) {
    return (
        <FileDataStoreProvider>
            {children}
        </FileDataStoreProvider>
    );
}