import { DownloadIcon, FileIcon, Trash2 } from "lucide-react";
import { FileNode } from "./type";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type FileLeafProps = {
    file: FileNode;
    isUploading?: Set<string | number>;
    onDelete: (fileId: number) => void;
    onDownload?: (file: FileNode) => void;
    onSelect?: (file: FileNode) => void;
};

export const FileLeaf: React.FC<FileLeafProps> = ({ file, isUploading, onDelete, onDownload, onSelect }) => {
    if(isUploading && isUploading.has(file.id)) {
        //create a loading spinner here
        return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-muted rounded animate-pulse">
                        <FileIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-1/3 animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

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
                    {file.type === "file" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>{file.uploadedDate}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {file.type === "file" && (
                    <Badge variant={file.type === "file" ? (file.status === "error" ? "destructive" : "default") : "default"} 
                    className={`${file.status === "error" ? "bg-red-100 text-red-800" : (file.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800") } uppercase text-xs font-medium`}>
                        {file.status}
                    </Badge>
                )}
                
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