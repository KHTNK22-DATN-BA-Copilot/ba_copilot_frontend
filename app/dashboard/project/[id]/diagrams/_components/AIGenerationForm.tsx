// AIGenerationForm.tsx
import { Label } from "@/components/ui/label";

interface AIGenerationFormProps {
  description: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function AIGenerationForm({ description, onChange, onSubmit }: AIGenerationFormProps) {
  return (
    <div className="col-span-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate with AI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Describe what you want to visualize and let AI create it
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                Diagram Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="E.g., Create a flowchart showing the user registration process with email verification..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
