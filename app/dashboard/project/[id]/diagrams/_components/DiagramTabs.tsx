import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, FileText, Workflow } from 'lucide-react';
import { Diagram } from '../_lib/constants';

interface DiagramTabsProps {
    diagram: Diagram;
}

export function DiagramTabs({ diagram }: DiagramTabsProps) {
    return (
        <Tabs defaultValue="preview">
            <div className="flex w-full flex-col sm:flex-row sm:w-fit p-1 rounded-2xl bg-gray-300 dark:bg-gray-700 justify-between mb-7">
                <TabsList className="bg-transparent">
                    <TabsTrigger
                        value="preview"
                        className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                    >
                        Preview
                    </TabsTrigger>
                    <TabsTrigger
                        value="edit"
                        className="p-2 rounded-2xl font-semibold text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:dark:text-white dark:text-gray-300"
                    >
                        Edit
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="preview" className="mt-6">
                <div className="col-span-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 min-h-96 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Diagram Preview</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">Visual representation would appear here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-6">
                <div className="col-span-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Markdown Source</h3>
                                <Button variant="outline" size="sm">Save Changes</Button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-96 font-mono text-sm">
                                <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{diagram.markdown}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
