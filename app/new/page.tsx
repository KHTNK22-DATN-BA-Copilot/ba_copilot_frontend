'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Button } from "@/components//ui/button";
import { Input } from "@/components//ui/input";
import { Label } from "@/components//ui/label";
import { Card, CardContent } from "@/components//ui/card";
import { X, Calendar, Users, FolderPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewProjectPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("web-app");
  const [dueDate, setDueDate] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    try {
      // TODO: Add your API call here to create the project
      console.log('Creating project:', {
        name: projectName,
        description,
        category,
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
      {/* Header */}
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content - 12 Column Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1>Create New Project</h1>
                  <p className="text-muted-foreground">Start a new business analysis project</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Card>
              <CardContent className='p-6 space-y-4'>
                <div>
                  <h3 className='mb-4'>Project Details</h3>
                </div>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='project-name'>Project Name *</Label>
                    <Input
                      id='project-name'
                      placeholder='Enter your project name'
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Project Description</Label>
                    <textarea id='description'
                      className='w-full min-h-32 p-3 border border-border rounded-lg bg-muted/30 resize-none'
                      placeholder='Description your project objectives, scope, and key deleiverables...'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='due-date'>Due Date</Label>
                      <div className='relative'>
                        <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                        <Input
                          id='due-date'
                          type='date'
                          className='pl-10'
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='team-size'>Estimated Team Size</Label>
                      <Select defaultValue='small'>
                        <SelectTrigger id='team-size'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo (1 person)</SelectItem>
                          <SelectItem value="small">Small (2-5 people)</SelectItem>
                          <SelectItem value="medium">Medium (6-15 people)</SelectItem>
                          <SelectItem value="large">Large (16+ people)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Project Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="critical">Critical Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features to Enable */}
            <Card>
              <CardContent className="p-6 ">
                <h3 className="mb-4">Enable Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="text-sm">AI Conversations</p>
                      <p className="text-xs text-muted-foreground">Chat with AI assistant</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="text-sm">SRS Generator</p>
                      <p className="text-xs text-muted-foreground">Generate requirements</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="text-sm">Wireframe Generator</p>
                      <p className="text-xs text-muted-foreground">Design wireframes</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <div>
                      <p className="text-sm">Diagram Generator</p>
                      <p className="text-xs text-muted-foreground">Create diagrams</p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
