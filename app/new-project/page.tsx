'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProjectHeader from './_components/ProjectHeader';
import ProjectDetailsForm from './_components/ProjectDetailsForm';
import ProjectFeatures from './_components/ProjectFeatures';
import ProjectActions from './_components/ProjectActions';
import { useDarkMode } from './_components/useDarkMode';

export default function NewProjectPage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    try {
      // TODO: Add your API call here to create the project
      console.log('Creating project:', {
        name: projectName,
        description,
        dueDate,
      });

      // After successful creation, navigate to dashboard or the new project
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
            <ProjectHeader onClose={handleClose} />

            <ProjectDetailsForm
              projectName={projectName}
              setProjectName={setProjectName}
              description={description}
              setDescription={setDescription}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />

            <ProjectFeatures />

            <ProjectActions
              onCancel={handleClose}
              onCreate={handleCreate}
              isDisabled={!projectName.trim()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
