import { Button } from "@/components/ui/button";
import { FolderPlus, Loader2 } from "lucide-react";

interface ProjectActionsProps {
  onCancel: () => void;
  onCreate: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
}

export default function ProjectActions({
  onCancel,
  onCreate,
  isDisabled,
  isLoading = false,
}: ProjectActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pb-6">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        onClick={onCreate}
        disabled={isDisabled}
        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <FolderPlus className="w-4 h-4" />
            Create Project
          </>
        )}
      </Button>
    </div>
  );
}
