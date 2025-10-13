import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

interface ProjectActionsProps {
  onCancel: () => void;
  onCreate: () => void;
  isDisabled: boolean;
}

export default function ProjectActions({
  onCancel,
  onCreate,
  isDisabled,
}: ProjectActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pb-6">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onCreate}
        disabled={isDisabled}
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <FolderPlus className="w-4 h-4" />
        Create Project
      </Button>
    </div>
  );
}
