import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressSectionProps {
    generatedDocuments: number;
    totalSupportedDocuments: number;
}

export default function ProgressSection({
    generatedDocuments,
    totalSupportedDocuments,
}: ProgressSectionProps) {
    const progressPercentage =
        totalSupportedDocuments > 0
            ? Math.round((generatedDocuments / totalSupportedDocuments) * 100)
            : 0;

    const remainingDocuments = Math.max(totalSupportedDocuments - generatedDocuments, 0);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                Overall Progress
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {generatedDocuments}/{totalSupportedDocuments}
                        </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{generatedDocuments} of {totalSupportedDocuments} supported documents generated</span>
                        <span>{remainingDocuments} remaining</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
