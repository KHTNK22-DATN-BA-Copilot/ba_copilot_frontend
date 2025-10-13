import { Card, CardContent } from "../../../components/ui/card";
import { FolderOpen, Clock, TrendingUp, Users, Activity } from "lucide-react";


export default function OverviewSection() {
  const overviewCards = [
    { id: 1, icon: FolderOpen, label: "Total Projects", value: "24", trend: "+3 this week" },
    { id: 2, icon: Clock, label: "Active Tasks", value: "18", trend: "3 overdue" },
    { id: 3, icon: TrendingUp, label: "Completed", value: "156", trend: "+12 this month" },
    { id: 4, icon: Users, label: "Team Members", value: "8", trend: "2 online" },
    { id: 5, icon: Activity, label: "Activity", value: "89%", trend: "This week" },
  ]

  return (
    <div className="col-span-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Overview</h1>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key = {card.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6 flex items-center h-full">
                <div className=" sm:flex-row items-center justify-center sm:justify-between w-full gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br ">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400"/>
                  </div>
                  <div className="space-y-1 text-center sm:text-left ">
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-2xl">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}