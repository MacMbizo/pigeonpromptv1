import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  GitBranch,
  Clock,
  Tag,
  Users,
  Globe,
  Lock,
  Plus,
  FolderOpen,
  Code2
} from "lucide-react";
import { toast } from "sonner";

const workspaces = [
  { id: "personal", name: "Personal", type: "private", icon: Lock },
  { id: "team", name: "Team Alpha", type: "shared", icon: Users },
  { id: "public", name: "Community", type: "public", icon: Globe },
];

const folders = [
  { id: 1, name: "Customer Support", prompts: 12, workspace: "personal" },
  { id: 2, name: "Content Generation", prompts: 8, workspace: "personal" },
  { id: 3, name: "Code Review", prompts: 5, workspace: "team" },
  { id: 4, name: "Marketing", prompts: 15, workspace: "team" },
];

const prompts = [
  {
    id: 1,
    name: "Customer Support Assistant",
    description: "Professional customer service responses with empathy and solutions",
    author: "John Doe",
    workspace: "personal",
    folder: "Customer Support",
    tags: ["support", "customer-service", "professional"],
    stars: 24,
    downloads: 156,
    lastModified: "2 hours ago",
    version: "v1.2",
    status: "deployed",
    isPublic: false
  },
  {
    id: 2,
    name: "Blog Post Generator",
    description: "Generate engaging blog posts with SEO optimization",
    author: "Jane Smith",
    workspace: "team",
    folder: "Marketing",
    tags: ["content", "blog", "seo", "marketing"],
    stars: 89,
    downloads: 342,
    lastModified: "1 day ago",
    version: "v2.1",
    status: "testing",
    isPublic: true
  },
  {
    id: 3,
    name: "Code Review Helper",
    description: "Automated code review with best practices and suggestions",
    author: "Dev Team",
    workspace: "team",
    folder: "Code Review",
    tags: ["code", "review", "development", "quality"],
    stars: 67,
    downloads: 234,
    lastModified: "3 days ago",
    version: "v1.5",
    status: "draft",
    isPublic: false
  },
  {
    id: 4,
    name: "Email Subject Line Optimizer",
    description: "Create compelling email subject lines that increase open rates",
    author: "Marketing Team",
    workspace: "public",
    folder: "Marketing",
    tags: ["email", "marketing", "optimization", "conversion"],
    stars: 156,
    downloads: 892,
    lastModified: "1 week ago",
    version: "v3.0",
    status: "deployed",
    isPublic: true
  }
];

export default function PromptHub() {
  const [selectedWorkspace, setSelectedWorkspace] = useState("personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPrompts = prompts.filter(prompt => {
    const matchesWorkspace = prompt.workspace === selectedWorkspace;
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = !selectedFolder || prompt.folder === selectedFolder;
    
    return matchesWorkspace && matchesSearch && matchesFolder;
  });

  const workspaceFolders = folders.filter(folder => folder.workspace === selectedWorkspace);

  const handleImportPrompt = (prompt: any) => {
    toast.success(`Imported "${prompt.name}" to your workspace`);
  };

  const handleStarPrompt = (prompt: any) => {
    toast.success(`Starred "${prompt.name}"`);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Sidebar - Workspaces & Folders */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workspaces</h2>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mb-6">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  setSelectedWorkspace(workspace.id);
                  setSelectedFolder(null);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedWorkspace === workspace.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <workspace.icon className="h-4 w-4" />
                <span>{workspace.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Folders</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                  !selectedFolder ? "bg-muted" : "hover:bg-muted"
                }`}
              >
                <span>All Prompts</span>
                <span className="text-xs text-muted-foreground">
                  {filteredPrompts.length}
                </span>
              </button>
              {workspaceFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                    selectedFolder === folder.name ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-3 w-3" />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {folder.prompts}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Prompt Hub</h1>
              <p className="text-muted-foreground">
                {selectedWorkspace === "public" ? "Discover community prompts" : "Manage your prompt library"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Prompt
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, tags, or descriptions..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No prompts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Create your first prompt to get started"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{prompt.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {prompt.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handleStarPrompt(prompt)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <span className="text-xs text-muted-foreground">{prompt.stars}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-full">
                          +{prompt.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{prompt.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitBranch className="h-3 w-3" />
                          <span>{prompt.version}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prompt.status === 'deployed' ? 'bg-green-100 text-green-800' :
                        prompt.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {prompt.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{prompt.lastModified}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {selectedWorkspace === "public" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleImportPrompt(prompt)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Import
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}