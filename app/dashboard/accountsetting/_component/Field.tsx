import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Field({
    label,
    value,
    state,
    onChange,
    message,
}: {
    label: string;
    value: string;
    state: string;
    onChange: any;
    message?: string;
}) {

    const isEditMode = state === "edit";
    const isErrorMode = state === "error";

    return (
        <div className="sm:flex sm:justify-between sm:items-center py-2">
            <div className="flex items-center gap-x-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </Label>
            </div>
            {(isEditMode || isErrorMode) ? (
                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                    <Input
                        type={label === "Email" ? "email" : "text"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="max-w-xs"
                        aria-label={label}
                    />
                    {(isErrorMode && label === "Email") && (
                        <p className="text-red-500 text-sm">{message}</p>
                    )}
                </div>
            ) : (
                <p className="truncate max-w-xs">{value}</p>
            )}
        </div>
    );
}