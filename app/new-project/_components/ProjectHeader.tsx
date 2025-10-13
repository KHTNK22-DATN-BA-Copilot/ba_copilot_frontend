import { Button } from "@/components/ui/button";
import { X, FolderPlus } from "lucide-react";

interface ProjectHeaderProps {
  onClose: () => void;
}

export default function ProjectHeader({ onClose }: ProjectHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <FolderPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start a new business analysis project
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}
