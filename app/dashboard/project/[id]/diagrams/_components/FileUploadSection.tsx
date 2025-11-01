import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

export function FileUploadSection() {
    return (
        <div className="col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8 transition-colors duration-300">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Reference Files</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload files to help generate your diagram</p>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm mb-2 text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, TXT (Max 10MB)</p>
                        <Input type="file" className="hidden" id="diagram-file-upload" accept=".pdf,.docx,.txt" />
                    </div>
                </div>
            </div>
        </div>
    );
}
