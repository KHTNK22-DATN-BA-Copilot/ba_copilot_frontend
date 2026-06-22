import "github-markdown-css/github-markdown.css";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";

import { DownloadIcon, Eye, FileIcon, Trash2 } from "lucide-react";
import { FileNode } from "./type";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useProjectMembership } from "@/context/ProjectMembershipContext";
import { useState } from "react";
import { getFileContentAction } from "@/actions/file.action";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import mammoth from "mammoth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type FileLeafProps = {
    file: FileNode;
    isUploading?: Set<string | number>;
    onDelete: (fileId: number | string) => void;
    onDownload?: (file: FileNode) => void;
    onSelect?: (file: FileNode) => void;
};

export const FileLeaf: React.FC<FileLeafProps> = ({
    file,
    isUploading,
    onDelete,
    onDownload,
    onSelect,
}) => {
    const { hasPermission } = useProjectMembership();
    const canDeleteFile = hasPermission("file", "delete");
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
    const [isViewing, setIsViewing] = useState(false);
    const [mdContent, setMdContent] = useState("");
    const [wordHtml, setWordHtml] = useState("");

    if (isUploading && isUploading.has(file.id)) {
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
        );
    }
    const viewFileContent = async (fileId: string | number) => {
        setIsViewing(true);
        const projectId = localStorage.getItem("projectId");
        const response = await getFileContentAction(
            projectId as string,
            fileId,
        );

        if (file.type == "file" && file.extension === ".md") {
            response.text().then((text) => {
                setMdContent(text);
            });
            return;
        }

        if (file.type == "file" && file.extension === ".docx") {
            response.arrayBuffer().then((buffer) => {
                mammoth
                    .convertToHtml({ arrayBuffer: buffer })
                    .then((result) => {
                        setWordHtml(result.value);
                    })
                    .catch((err) => {
                        console.error("Lỗi đọc file Word:", err);
                        setWordHtml(
                            "<p>Error happen when reading word file.</p>",
                        );
                    });
            });
            return;
        }

        const fileUrl = URL.createObjectURL(response);
        setFileUrl(fileUrl);
    };

    return (
        <>
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
                        <Badge
                            variant={
                                file.type === "file"
                                    ? file.status === "error"
                                        ? "destructive"
                                        : "default"
                                    : "default"
                            }
                            className={`${file.status === "error" ? "bg-red-100 text-red-800" : file.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"} uppercase text-xs font-medium`}
                        >
                            {file.status}
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewFileContent(file.id)}
                        aria-label={`Download ${file.name}`}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload?.(file)}
                        aria-label={`Download ${file.name}`}
                    >
                        <DownloadIcon className="w-4 h-4" />
                    </Button>
                    {canDeleteFile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(file.id)}
                            aria-label={`Delete ${file.name}`}
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                    )}
                </div>
            </div>
            <Dialog open={isViewing} onOpenChange={setIsViewing}>
                <DialogContent
                    className="p-0 gap-0 overflow-hidden border-0"
                    style={{
                        maxWidth: "96vw",
                        width: "96vw",
                        height: "96vh",
                        maxHeight: "96vh",
                    }}
                >
                    <DialogTitle className="p-4 border-b">
                        {file.type == "file" && file.name + file.extension}
                    </DialogTitle>
                    {file.type == "file" &&
                        (file.extension == ".txt" ||
                        file.extension == ".pdf" ? (
                            <iframe
                                src={fileUrl}
                                width="100%"
                                height="600px"
                                title="PDF Viewer"
                            />
                        ) : file.extension === ".md" ? (
                            <div
                                className={
                                    "p-5 border rounded-xl overflow-scroll markdown-body"
                                }
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {mdContent}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div
                                className="p-5 border rounded-xl overflow-scroll"
                                dangerouslySetInnerHTML={{ __html: wordHtml }}
                            />
                        ))}
                </DialogContent>
            </Dialog>
        </>
    );
};
