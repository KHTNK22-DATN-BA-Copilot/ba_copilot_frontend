import {
    Folder,
    FolderOpen,
    FolderPlus,
    FilePlus,
    FolderMinus,
} from "lucide-react";
import { FileItem, FileNode } from "./type";
import { Button } from "../ui/button";
import { FileLeaf } from "./FileLeaf";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

type FolderCompositeProps = {
    folder: FileNode;
    expanded?: boolean;
    expandedFolders: Set<number>;
    toggle: (id: number) => void;
    onUpload: (folderId: number) => void;
    onDelete: (folderId: number, fileId: number) => void;
    onDownload?: (file: FileNode) => void;
    onSelect?: (file: FileItem) => void;
    onCreateFolder?: (parentId: number, name: string) => void;
    onRemoveFolder: (folderId: number) => void;
};

function CalTotalFiles(folder: FileNode): number {
    if(folder.type === "file") return 1;
    return folder.children.reduce((total, child) => total + CalTotalFiles(child), 0);
}

export const FolderComposite = ({
    folder,
    expanded,
    expandedFolders,
    toggle,
    onUpload,
    onDelete,
    onDownload,
    onSelect,
    onCreateFolder,
    onRemoveFolder
}: FolderCompositeProps) => {
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (creating) {
            if (!expandedFolders.has(folder.id as number)) {
                toggle(folder.id as number);
            }
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [creating]);

    const handleCreateConfirm = () => {
        const name = (newName ?? "").trim();
        if (!name) {
            setCreating(false);
            setNewName("");
            return;
        }
        onCreateFolder?.(folder.id as number, name);
        setCreating(false);
        setNewName("");
        // ensure parent expanded
        if (!expandedFolders.has(folder.id as number)) {
            toggle(folder.id as number);
        }
    };

    const handleCreateCancel = () => {
        setCreating(false);
        setNewName("");
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(folder.type !== "folder") return;
        const hasChildren = Array.isArray(folder.children) && folder.children.length > 0;
        if (hasChildren) {
            const ok = window.confirm(
                `Folder "${folder.name}" is not empty. Deleting will remove all nested files and folders. Confirm delete?`
            );
            if (!ok) return;
        }
        onRemoveFolder?.(folder.id as number);
    };

    const handleDownload = (file: FileNode) => {
        onDownload?.(file);
    }

    return (
        <div className="border rounded-lg w-full overflow-hidden">
            <div
                className={`flex bg-blue-100 items-center justify-between p-4 cursor-pointer hover:bg-blue-200 transition-colors border-b`}
                onClick={() => toggle(folder.id as number)}
            >
                <div className="flex items-center gap-3">
                    {expanded ? (
                        <FolderOpen className={`w-5 h-5 text-blue-500`} />
                    ) : (
                        <Folder className={`w-5 h-5 text-blue-500`} />
                    )}
                    <div>
                        <p>{folder.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {folder.type == "folder" && CalTotalFiles(folder)}{" "}
                            {folder.type == "folder" &&
                            CalTotalFiles(folder) === 1
                                ? "file"
                                : "files"}
                        </p>
                    </div>
                </div>

                <div className="flex items-baseline gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpload(folder.id as number);
                                }}
                            >
                                <FilePlus className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add New file</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // open inline create folder input
                                    setCreating(true);
                                }}
                            >
                                <FolderPlus className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add New folder</p>
                        </TooltipContent>
                    </Tooltip>

                    {folder.type === "folder" && !folder.systemFileType && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    // open inline create folder input
                                    handleRemoveClick(e);
                                }}>
                                    <FolderMinus className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Remove folder</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            {expanded && (
                <div className="p-4">
                    {folder.type == "folder" &&
                    folder.children.length === 0 &&
                    !creating ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No files in this folder</p>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => onUpload(folder.id as number)}
                                className="mt-2"
                            >
                                Upload your first file
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {creating && (
                                <div className="p-2 rounded border bg-muted/5">
                                    <input
                                        ref={inputRef}
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        onBlur={() => handleCreateConfirm()}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleCreateConfirm();
                                            } else if (e.key === "Escape") {
                                                handleCreateCancel();
                                            }
                                        }}
                                        placeholder="New folder name"
                                        className="w-full px-2 py-1 rounded border"
                                    />
                                </div>
                            )}

                            {folder.type == "folder" &&
                                folder.children.map((file, index) =>
                                    file.type === "file" ? (
                                        <FileLeaf
                                            key={file.id}
                                            file={file}
                                            onDelete={(fileId) =>
                                                onDelete(
                                                    folder.id as number,
                                                    fileId
                                                )
                                            }
                                            onDownload={onDownload}
                                            onSelect={onSelect}
                                        />
                                    ) : (
                                        <FolderComposite
                                            key={file.id}
                                            folder={file}
                                            toggle={toggle}
                                            onUpload={onUpload}
                                            expanded={expandedFolders.has(
                                                file.id as number
                                            )}
                                            expandedFolders={expandedFolders}
                                            onDelete={onDelete}
                                            onDownload={onDownload}
                                            onSelect={onSelect}
                                            onCreateFolder={onCreateFolder} 
                                            onRemoveFolder={onRemoveFolder}
                                        />
                                    )
                                )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
