import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface ProjectDetailsFormProps {
  projectName: string;
  setProjectName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
}

export default function ProjectDetailsForm({
  projectName,
  setProjectName,
  description,
  setDescription,
  dueDate,
  setDueDate,
}: ProjectDetailsFormProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Project Details
          </h3>
        </div>

        <div className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-gray-900 dark:text-gray-100">
              Project Name *
            </Label>
            <Input
              id="project-name"
              placeholder="Enter your project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
              Project Description
            </Label>
            <textarea
              id="description"
              className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your project objectives, scope, and key deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Due Date and Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due-date" className="text-gray-900 dark:text-gray-100">
                Due Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="due-date"
                  type="date"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-size" className="text-gray-900 dark:text-gray-100">
                Estimated Team Size
              </Label>
              <Select defaultValue="small">
                <SelectTrigger id="team-size">
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

          {/* Project Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-900 dark:text-gray-100">
              Project Priority
            </Label>
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
  );
}