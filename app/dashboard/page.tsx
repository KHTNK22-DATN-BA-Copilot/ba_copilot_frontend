import MainContent from './_components/MainContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard - BA Copilot',
    description: 'Dashboard page for BA Copilot application',
}

export default function DashboardPage() {

    return (
        <MainContent />
    );
}