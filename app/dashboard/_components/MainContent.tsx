import OverviewSection from './OverviewSection';
import ProjectsSection from './ProjectsSection';

export default function MainContent() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <OverviewSection />
      <ProjectsSection />
    </div>
  );
}
