export interface Project {
    id: string | string[];
    name: string;
    description: string;
    status: string;
    progress: number;
    created_at: string;
    dueDate: string;
    teamMembers: number;
    completedTasks: number;
    totalTasks: number;
    priority?: 'low' | 'medium' | 'high';
    updated_at?: string;
    team_size?: number;
}

export interface Activity {
    id: number;
    type: 'srs' | 'wireframe' | 'diagram' | 'conversation' | 'oneclick';
    title: string;
    description: string;
    link: string;
}

export interface RecentFile {
    id: string;
    name: string;
    extension?: string;
    updated_at?: string;
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
