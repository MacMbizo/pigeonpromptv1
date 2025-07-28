import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Globe,
  Star,
  Code2,
  Workflow,
  Key,
  Shield,
  CreditCard,
  Database,
  Settings,
  DollarSign,
  FolderOpen,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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
    description: "Start building a new prompt template",
    icon: Plus,
    href: "/ide",
    color: "bg-blue-500"
  },
  {
    title: "Browse Community",
    description: "Explore prompts shared by the community",
    icon: Users,
    href: "/hub",
    color: "bg-green-500"
  },
  {
    title: "Create Workflow",
    description: "Build automated prompt workflows",
    icon: Workflow,
    href: "/flow",
    color: "bg-purple-500"
  },
  {
    title: "View Analytics",
    description: "Monitor your prompt performance",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-orange-500"
  },
  {
    title: "Manage APIs",
    description: "Configure API keys and integrations",
    icon: Key,
    href: "/api",
    color: "bg-cyan-500"
  },
  {
    title: "User Management",
    description: "Manage team members and permissions",
    icon: Shield,
    href: "/users",
    color: "bg-red-500"
  }
];

export default function Dashboard() {
  const [showSettings, setShowSettings] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('prompt');

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    // Save to localStorage (mock backend)
    const projects = JSON.parse(localStorage.getItem('promptops_projects') || '[]');
    const newProject = {
      id: Date.now(),
      name: projectName,
      description: projectDescription,
      type: projectType,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    projects.push(newProject);
    localStorage.setItem('promptops_projects', JSON.stringify(projects));
    
    toast.success(`Project "${projectName}" created successfully!`);
    setShowNewProject(false);
    setProjectName('');
    setProjectDescription('');
    setProjectType('prompt');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
    setShowSettings(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your prompts and workflows.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dashboard Settings</DialogTitle>
                <DialogDescription>
                  Configure your dashboard preferences and display options.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="theme" className="text-right">
                    Theme
                  </Label>
                  <select id="theme" className="col-span-3 p-2 border border-border rounded">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notifications" className="text-right">
                    Notifications
                  </Label>
                  <input type="checkbox" id="notifications" className="col-span-3" defaultChecked />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="autoSave" className="text-right">
                    Auto Save
                  </Label>
                  <input type="checkbox" id="autoSave" className="col-span-3" defaultChecked />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new project to organize your prompts and workflows.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectType" className="text-right">
                    Type
                  </Label>
                  <select 
                    id="projectType" 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="col-span-3 p-2 border border-border rounded"
                  >
                    <option value="prompt">Prompt Collection</option>
                    <option value="workflow">Workflow Project</option>
                    <option value="api">API Integration</option>
                    <option value="team">Team Collaboration</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectDescription" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewProject(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>
              Real-time platform performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-muted-foreground">245ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-sm text-muted-foreground">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Workflows</span>
                <span className="text-sm text-muted-foreground">12/15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Usage Analytics</span>
            </CardTitle>
            <CardDescription>
              Your platform usage this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">2.4K</div>
                <div className="text-sm text-muted-foreground">API Calls</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="text-sm text-muted-foreground">Workflows Run</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">89%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">$47</div>
                <div className="text-sm text-muted-foreground">Cost Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Platform Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest actions across your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Workflow "Customer Support" executed successfully',
                  time: '2 minutes ago',
                  status: 'success',
                  icon: CheckCircle
                },
                {
                  action: 'New prompt "Product Description" created',
                  time: '15 minutes ago',
                  status: 'info',
                  icon: Plus
                },
                {
                  action: 'API key "Production" regenerated',
                  time: '1 hour ago',
                  status: 'warning',
                  icon: Key
                },
                {
                  action: 'Team member "Sarah" added to workspace',
                  time: '3 hours ago',
                  status: 'info',
                  icon: Users
                }
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Platform Features</span>
            </CardTitle>
            <CardDescription>
              Explore advanced capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: 'Advanced Analytics',
                  description: 'Deep insights into prompt performance',
                  href: '/analytics',
                  icon: BarChart3
                },
                {
                  title: 'API Management',
                  description: 'Secure API key and integration management',
                  href: '/api',
                  icon: Key
                },
                {
                  title: 'Team Collaboration',
                  description: 'Manage users, roles, and permissions',
                  href: '/users',
                  icon: Shield
                },
                {
                  title: 'Billing & Usage',
                  description: 'Monitor costs and manage subscriptions',
                  href: '/billing',
                  icon: CreditCard
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link key={index} to={feature.href}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {feature.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}