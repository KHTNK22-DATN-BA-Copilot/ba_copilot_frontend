import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    id: "ai-conversations",
    name: "AI Conversations",
    description: "Chat with AI assistant",
  },
  {
    id: "srs-generator",
    name: "SRS Generator",
    description: "Generate requirements",
  },
  {
    id: "wireframe-generator",
    name: "Wireframe Generator",
    description: "Design wireframes",
  },
  {
    id: "diagram-generator",
    name: "Diagram Generator",
    description: "Create diagrams",
  },
];

export default function ProjectFeatures() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Enable Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature) => (
            <label
              key={feature.id}
              className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {feature.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
