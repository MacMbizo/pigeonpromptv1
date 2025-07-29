import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Code2,
  FolderOpen,
  Workflow,
  Settings,
  User,
  Bell,
  Search,
  Command,
  BarChart3,
  Key,
  Shield,
  CreditCard,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Prompt IDE", href: "/ide", icon: Code2 },
  { name: "Prompt Hub", href: "/hub", icon: FolderOpen },
  { name: "PromptFlow", href: "/flow", icon: Workflow },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "API Management", href: "/api", icon: Key },
  { name: "User Management", href: "/users", icon: Shield },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Workflow Completed',
      message: 'Your "Customer Support" workflow finished successfully',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Template Available',
      message: 'Check out the new "Email Marketing" template',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'API Limit Warning',
      message: 'You\'ve used 80% of your monthly API quota',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Team Invitation',
      message: 'Sarah invited you to join "Marketing Team" workspace',
      time: '1 day ago',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const markAsRead = (id: number) => {
    toast.success('Notification marked as read');
  };
  
  const markAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">PigeonPrompt</span>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search prompts, flows, or press Cmd+K"
                  className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs bg-background border border-border rounded">
                    <Command className="h-3 w-3 inline mr-1" />
                    K
                  </kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </div>
              <button 
                onClick={() => setShowProfile(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>
      
      {/* Notifications Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            </div>
            <DialogDescription>
              Stay updated with your latest activities and system updates.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</h3>
                 <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                 <Badge variant="secondary">Free Plan</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(false);
                  navigate('/settings?tab=profile');
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(false);
                  navigate('/settings?tab=profile');
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(false);
                  navigate('/settings?tab=billing');
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Billing & Subscription
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setShowProfile(false);
                  navigate('/settings?tab=security');
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy & Security
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <Button 
                variant="ghost" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={async () => {
                   try {
                     await signOut();
                     setShowProfile(false);
                     navigate('/login');
                   } catch (error) {
                     toast.error('Failed to sign out');
                   }
                 }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)]">
          <div className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Workspace Selector */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Workspace
              </h3>
              <select className="w-full p-2 bg-muted border border-border rounded-lg text-sm">
                <option>Personal Workspace</option>
                <option>Team Alpha</option>
                <option>Enterprise Org</option>
              </select>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
}