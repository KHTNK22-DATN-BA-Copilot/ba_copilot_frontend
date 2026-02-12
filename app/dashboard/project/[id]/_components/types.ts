export interface Project {
    id: string | string[];
    name: string;
    description: string;
    status: string;
    progress: number;
    createdDate: string;
    dueDate: string;
    teamMembers: number;
    completedTasks: number;
    totalTasks: number;
    priority?: 'low' | 'medium' | 'high';
}

export interface Activity {
    id: number;
    type: 'srs' | 'wireframe' | 'diagram' | 'conversation' | 'oneclick';
    title: string;
    description: string;
    link: string;
}

export interface QuickStat {
    label: string;
    value: string;
    icon: any;
    color?: string;
    bgColor?: string;
}

export interface TaskOverview {
    completed: number;
    inProgress: number;
    pending: number;
}
