import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';

import { useState } from 'react';

export default function MainContent() {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Most Recent');
  
  return (
    <div className="grid grid-cols-12 gap-6">
      <OverviewSection />
      <ProjectsSection
        isOpenFilter={isOpenFilter}
        setIsOpenFilter={setIsOpenFilter}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
    </div>
  );
}
