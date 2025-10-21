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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1 sm:gap-2">
            <div className="flex items-center gap-x-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </Label>
            </div>
            {(isEditMode || isErrorMode) ? (
                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                    <Input
                        type={label === "Email" ? "email" : "text"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full sm:max-w-xs"
                        aria-label={label}
                    />
                    {(isErrorMode && label === "Email") && (
                        <p className="text-red-500 text-xs sm:text-sm">{message}</p>
                    )}
                </div>
            ) : (
                <p className="truncate w-full sm:max-w-xs text-sm sm:text-base text-gray-600 dark:text-gray-300">{value}</p>
            )}
        </div>
    );
}