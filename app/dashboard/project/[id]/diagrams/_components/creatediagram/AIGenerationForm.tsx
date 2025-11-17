// AIGenerationForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {OverviewType} from "@/app/dashboard/project/[id]/diagrams/_lib/constants";

interface AIGenerationFormProps {
  overview: OverviewType;
  onChange: (value: OverviewType) => void;
  onSubmit: () => void;
}

export function AIGenerationForm({ overview, onChange, onSubmit }: AIGenerationFormProps) {
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
            <section className="flex flex-col sm:flex-row sm:gap-5 w-full mt-5">
                <div className="w-full">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                        id="project-name"
                        type="text"
                        placeholder="E.g., Online Bookstore"
                        className="mt-2 mb-4 w-full"
                        value={overview.title}
                        onChange={(e) => onChange({ ...overview, title: e.target.value })}
                    />
                </div>
            </section>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                Diagram Description
              </Label>
              <Textarea
                id="description"
                value={overview.description}
                onChange={(e) => onChange({ ...overview, description: e.target.value })}
                className="w-full min-h-32 p-3  rounded-lg resize-none"
                placeholder="E.g., Create a flowchart showing the user registration process with email verification..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
