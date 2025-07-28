import { Outlet, Link, useLocation } from "react-router-dom";
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
  Command
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Prompt IDE", href: "/ide", icon: Code2 },
  { name: "Prompt Hub", href: "/hub", icon: FolderOpen },
  { name: "PromptFlow", href: "/flow", icon: Workflow },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PromptOps</span>
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
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

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
  );
}