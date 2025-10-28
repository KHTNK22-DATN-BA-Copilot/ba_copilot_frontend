import MainContent from './_components/MainContent';
import { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';

export const metadata: Metadata = {
    title: 'Dashboard - BA Copilot',
    description: 'Dashboard page for BA Copilot application',
}

export default async function DashboardPage() {
    const projects = await getAllProjects(); 
    console.log('Fetched projects:', projects);
    return (
        <MainContent projects={projects} />
    );
}