import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentFile } from './types';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface RecentActivitySectionProps {
    files: RecentFile[];
    projectId: string;
}

function formatUpdatedAt(date?: string) {
    if (!date) return 'Updated recently';

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Updated recently';

    return `Updated ${parsed.toLocaleString()}`;
}

export default function RecentActivitySection({ files, projectId }: RecentActivitySectionProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/project/${projectId}/files`}>View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {files.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
                    ) : (
                        files.map((file) => (
                            <Link
                                href={`/dashboard/project/${projectId}/files`}
                                key={file.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.extension ? `${file.name}${file.extension}` : file.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {formatUpdatedAt(file.updated_at)}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
