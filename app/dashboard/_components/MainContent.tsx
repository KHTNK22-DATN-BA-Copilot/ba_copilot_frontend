import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';
import Search from './Search';

import { useState } from 'react';

export default function MainContent() {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Most Recent');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-12 gap-6">
      <Search
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
      />
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
