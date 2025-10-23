"use client";
import { createContext, useContext, useState } from "react";
type FileProps = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: "uploading" | "completed" | "error";
};

type FileStoreType = {
    files: FileProps[];
    handleFiles: (files: FileList | File[]) => void;
    removeFile: (id: string) => void;
};

const FileDataStoreContext = createContext<FileStoreType | null>(null);
export function FileDataStoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [files, setFiles] = useState<FileProps[]>([]);

    const handleFiles: FileStoreType["handleFiles"] = (input) => {
        const fileArray = Array.from(input instanceof FileList ? input : input);
        const newFiles = fileArray.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "uploading" as const,
        }));
        setFiles((prev) => [...prev, ...newFiles]);

        // mock upload completion per file (keeps parity with previous local behavior)
        newFiles.forEach((nf) => {
            setTimeout(() => {
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === nf.id ? { ...f, status: "completed" } : f
                    )
                );
            }, 2000);
        });
    };

    const removeFile: FileStoreType["removeFile"] = (id) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <FileDataStoreContext.Provider value={{ files, handleFiles, removeFile }}>
            {children}
        </FileDataStoreContext.Provider>
    )
}

export const useFileDataStore = () => {
    const context = useContext(FileDataStoreContext);
    if (!context) {
        throw new Error(
            "useFileDataStore must be used within a FileDataStoreProvider"
        );
    }
    return context;
}
