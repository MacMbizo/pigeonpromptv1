import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  TrendingUp,
  Users,
  Zap,
  Clock,
  DollarSign,
  Activity,
  Code2,
  FolderOpen,
  Workflow
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Prompts",
    value: "24",
    change: "+12%",
    icon: Code2,
    color: "text-blue-600"
  },
  {
    title: "Active Flows",
    value: "8",
    change: "+4%",
    icon: Workflow,
    color: "text-green-600"
  },
  {
    title: "API Calls Today",
    value: "1,247",
    change: "+23%",
    icon: Activity,
    color: "text-purple-600"
  },
  {
    title: "Cost This Month",
    value: "$42.50",
    change: "-8%",
    icon: DollarSign,
    color: "text-orange-600"
  }
];

const recentPrompts = [
  {
    id: 1,
    name: "Customer Support Assistant",
    description: "AI assistant for handling customer inquiries",
    lastModified: "2 hours ago",
    status: "deployed"
  },
  {
    id: 2,
    name: "Code Review Helper",
    description: "Automated code review and suggestions",
    lastModified: "1 day ago",
    status: "testing"
  },
  {
    id: 3,
    name: "Content Generator",
    description: "Generate marketing content variations",
    lastModified: "3 days ago",
    status: "draft"
  }
];

const quickActions = [
  {
    title: "Create New Prompt",
    description: "Start building a new AI prompt",
    icon: Code2,
    href: "/ide",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    title: "Browse Hub",
    description: "Explore community prompts",
    icon: FolderOpen,
    href: "/hub",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    title: "Build Flow",
    description: "Create a prompt workflow",
    icon: Workflow,
    href: "/flow",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your prompts.
          </p>
        </div>
        <Button asChild>
          <Link to="/ide">
            <Plus className="h-4 w-4 mr-2" />
            New Prompt
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className={`flex items-center p-3 rounded-lg border transition-colors hover:bg-muted ${action.color}`}
              >
                <action.icon className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm opacity-70">{action.description}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Prompts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Prompts</CardTitle>
            <CardDescription>
              Your recently modified prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrompts.map((prompt) => (
                <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{prompt.name}</h3>
                    <p className="text-sm text-muted-foreground">{prompt.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {prompt.lastModified}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      prompt.status === 'deployed' ? 'bg-green-100 text-green-800' :
                      prompt.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {prompt.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}