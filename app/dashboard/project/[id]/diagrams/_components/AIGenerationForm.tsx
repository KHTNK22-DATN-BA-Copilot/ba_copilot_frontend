import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPLEXITY_OPTIONS, STYLE_OPTIONS } from '../_lib/constants';

export function AIGenerationForm() {
    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate with AI</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Describe what you want to visualize and let AI create it</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">Diagram Description</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="E.g., Create a flowchart showing the user registration process with email verification and profile setup steps..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="complexity" className="text-gray-900 dark:text-gray-100">Complexity</Label>
                                <Select defaultValue="medium">
                                    <SelectTrigger id="complexity" className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMPLEXITY_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style" className="text-gray-900 dark:text-gray-100">Style</Label>
                                <Select defaultValue="modern">
                                    <SelectTrigger id="style" className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STYLE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                            Generate Diagram
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
