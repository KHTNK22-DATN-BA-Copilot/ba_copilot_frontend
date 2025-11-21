import { DownloadIcon, FileIcon, Trash2 } from "lucide-react";
import { FileItem, FileNode } from "./type";
import { Button } from "../ui/button";

export const FileLeaf: React.FC<{
    file: FileNode;
    onDelete: (fileId: number) => void;
    onDownload?: (file: FileNode) => void;
    onSelect?: (file: FileItem) => void;
}> = ({ file, onDelete, onDownload, onSelect }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-muted rounded">
                    <FileIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <button
                        className="text-left w-full truncate"
                        onClick={() => onSelect?.(file)}
                    >
                        {file.name}
                    </button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{file.type == "file" && file.size}</span>
                        <span>•</span>
                        <span>{file.type == "file" && file.uploadedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload?.(file)}
                    aria-label={`Download ${file.name}`}
                >
                    <DownloadIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(file.id as number)}
                    aria-label={`Delete ${file.name}`}
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
            </div>
        </div>
    );
};