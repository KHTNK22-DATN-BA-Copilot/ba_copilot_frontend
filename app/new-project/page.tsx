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
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: description || null,
          status: 'active',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful creation, navigate to the new project or dashboard
        router.push(`/dashboard/project/${data.id}`);
      } else {
        setError(data.error || 'Failed to create project');
        console.error('Error creating project:', data.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
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

      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
            <ProjectHeader onClose={handleClose} />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

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
              isDisabled={!projectName.trim() || isCreating}
              isLoading={isCreating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
