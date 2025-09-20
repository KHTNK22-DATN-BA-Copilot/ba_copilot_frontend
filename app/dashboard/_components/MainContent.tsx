import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';

import { useState } from 'react';

export default function MainContent() {
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  return (
    <div className="grid grid-cols-12 gap-6">
      <OverviewSection />
      <ProjectsSection isOpenFilter={isOpenFilter} setIsOpenFilter={setIsOpenFilter} />
    </div>
  );
}
