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
  Code2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Crown,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import CollaborationPanel from "../components/CollaborationPanel";
import CommunityFeatures from "../components/CommunityFeatures";
import MarketplaceFeatures from "../components/MarketplaceFeatures";
import TeamCollaboration from "../components/TeamCollaboration";

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
    authorAvatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20avatar%20headshot&image_size=square",
    workspace: "personal",
    folder: "Customer Support",
    tags: ["support", "customer-service", "professional"],
    stars: 24,
    downloads: 156,
    likes: 45,
    comments: 8,
    lastModified: "2 hours ago",
    version: "v1.2",
    status: "deployed",
    isPublic: false,
    isFeatured: false,
    isBookmarked: false,
    difficulty: "Beginner",
    estimatedTime: "3-5 min"
  },
  {
    id: 2,
    name: "Blog Post Generator",
    description: "Generate engaging blog posts with SEO optimization",
    author: "Jane Smith",
    authorAvatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20avatar%20headshot&image_size=square",
    workspace: "team",
    folder: "Marketing",
    tags: ["content", "blog", "seo", "marketing"],
    stars: 89,
    downloads: 342,
    likes: 156,
    comments: 23,
    lastModified: "1 day ago",
    version: "v2.1",
    status: "testing",
    isPublic: true,
    isFeatured: true,
    isBookmarked: true,
    difficulty: "Intermediate",
    estimatedTime: "5-10 min"
  },
  {
    id: 3,
    name: "Code Review Helper",
    description: "Automated code review with best practices and suggestions",
    author: "Dev Team",
    authorAvatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20team%20avatar&image_size=square",
    workspace: "team",
    folder: "Code Review",
    tags: ["code", "review", "development", "quality"],
    stars: 67,
    downloads: 234,
    likes: 89,
    comments: 15,
    lastModified: "3 days ago",
    version: "v1.5",
    status: "draft",
    isPublic: false,
    isFeatured: false,
    isBookmarked: false,
    difficulty: "Advanced",
    estimatedTime: "10-15 min"
  },
  {
    id: 4,
    name: "Email Subject Line Optimizer",
    description: "Create compelling email subject lines that increase open rates",
    author: "Marketing Team",
    authorAvatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20marketing%20team%20avatar&image_size=square",
    workspace: "public",
    folder: "Marketing",
    tags: ["email", "marketing", "optimization", "conversion"],
    stars: 156,
    downloads: 892,
    likes: 203,
    comments: 45,
    lastModified: "1 week ago",
    version: "v3.0",
    status: "deployed",
    isPublic: true,
    isFeatured: true,
    isBookmarked: false,
    difficulty: "Intermediate",
    estimatedTime: "5-8 min"
  }
];

export default function PromptHub() {
  const [selectedWorkspace, setSelectedWorkspace] = useState("personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] = useState("discover");
  const [selectedFilter, setSelectedFilter] = useState("trending");
  const [showCollaboration, setShowCollaboration] = useState(false);

  const tabs = [
    { id: "discover", label: "Discover", icon: Globe },
    { id: "community", label: "Community", icon: Users },
    { id: "marketplace", label: "Marketplace", icon: Crown },
    { id: "team", label: "Team", icon: Users },
    { id: "my-prompts", label: "My Prompts", icon: Heart },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "trending", label: "Trending", icon: TrendingUp }
  ];

  const filters = [
    { id: "trending", label: "Trending" },
    { id: "newest", label: "Newest" },
    { id: "most-used", label: "Most Used" },
    { id: "highest-rated", label: "Highest Rated" }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesWorkspace = selectedTab === "discover" || prompt.workspace === selectedWorkspace;
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = !selectedFolder || prompt.folder === selectedFolder;
    const matchesTab = selectedTab === "discover" || 
                      (selectedTab === "my-prompts" && prompt.author === "You") ||
                      (selectedTab === "bookmarks" && prompt.isBookmarked) ||
                      (selectedTab === "trending" && prompt.isFeatured);
    
    return matchesWorkspace && matchesSearch && matchesFolder && matchesTab;
  });

  const workspaceFolders = folders.filter(folder => folder.workspace === selectedWorkspace);

  const handleImportPrompt = (prompt: any) => {
    toast.success(`Imported "${prompt.name}" to your workspace`);
  };

  const handleStarPrompt = (prompt: any) => {
    toast.success(`Starred "${prompt.name}"`);
  };

  const handleLikePrompt = (prompt: any) => {
    toast.success(`Liked "${prompt.name}"`);
  };

  const handleBookmarkPrompt = (prompt: any) => {
    toast.success(`Bookmarked "${prompt.name}"`);
  };

  const handleSharePrompt = (prompt: any) => {
    toast.success(`Shared "${prompt.name}"`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
                  setSelectedTab("my-prompts");
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedWorkspace === workspace.id && selectedTab === "my-prompts"
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
                  {selectedTab === "my-prompts" ? filteredPrompts.length : prompts.length}
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
                {selectedTab === "discover" ? "Discover community prompts" : "Manage your prompt library"}
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

          {/* Navigation Tabs */}
          <div className="mb-4">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        selectedTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts, tags, or authors..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {filters.map(filter => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedTab === "discover" && (
            <div className="space-y-6">
              {/* Featured Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Featured Prompts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPrompts.filter(p => p.isFeatured).slice(0, 2).map(prompt => (
                    <Card key={`featured-${prompt.id}`} className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={prompt.authorAvatar}
                              alt={prompt.author}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <CardTitle className="text-lg">{prompt.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">by {prompt.author}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{prompt.stars}</span>
                          </div>
                        </div>
                        <CardDescription className="text-sm">{prompt.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === "community" && <CommunityFeatures />}
          
          {selectedTab === "marketplace" && <MarketplaceFeatures />}
          
          {selectedTab === "team" && <TeamCollaboration />}

          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No prompts found</h3>
              <p className="text-muted-foreground mb-4">
                {selectedTab === "bookmarks" 
                  ? "You haven't bookmarked any prompts yet"
                  : searchQuery ? "Try adjusting your search terms" : "Create your first prompt to get started"
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Prompt
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={prompt.authorAvatar}
                          alt={prompt.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">{prompt.author}</span>
                        {!prompt.isPublic && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{prompt.stars}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {prompt.name}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {prompt.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Difficulty and Time */}
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(prompt.difficulty)}`}>
                          {prompt.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">{prompt.estimatedTime}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
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
                      
                      {/* Stats */}
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{prompt.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className={`h-3 w-3 ${prompt.isBookmarked ? 'text-red-500 fill-current' : ''}`} />
                            <span>{prompt.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{prompt.comments}</span>
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

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8"
                            onClick={() => handleLikePrompt(prompt)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8"
                            onClick={() => handleBookmarkPrompt(prompt)}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8"
                            onClick={() => handleSharePrompt(prompt)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {selectedTab === "discover" && (
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredPrompts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline">
                Load More Prompts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}