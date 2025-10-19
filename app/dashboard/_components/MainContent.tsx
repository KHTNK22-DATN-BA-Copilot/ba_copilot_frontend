'use client';
import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';
import { useState } from 'react';

export default function MainContent({projects}: {projects: any[]}) {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Most Recent');
  
  return (
    <div className="grid grid-cols-12 gap-6">
      <OverviewSection totalProjects={projects.length}/>
      <ProjectsSection
        isOpenFilter={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        projects={projects}
      />
    </div>
  );
}
