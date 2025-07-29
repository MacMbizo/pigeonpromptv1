import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  ShoppingCart,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Bell,
  FileDown,
  FileUp,
  FolderPlus
} from "lucide-react";
import { toast } from "sonner";
import CollaborationPanel from "../components/CollaborationPanel";
import CommunityFeatures from "../components/CommunityFeatures";
import MarketplaceFeatures from "../components/MarketplaceFeatures";
import TeamCollaboration from "../components/TeamCollaboration";
import { exportPrompts, importPrompts, ExportablePrompt } from "../utils/importExport";
import { usePrompts } from "../hooks/usePrompts";

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
  const [showFilters, setShowFilters] = useState(false);
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPromptToShare, setSelectedPromptToShare] = useState<any>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'json' | 'csv' | 'txt'>('json');
  const [selectedFolderForImport, setSelectedFolderForImport] = useState<string>('');
  const { prompts: userPrompts } = usePrompts();
  const [newPromptData, setNewPromptData] = useState({
    name: '',
    description: '',
    content: '',
    tags: '',
    category: 'general',
    isPublic: false
  });
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    difficulty: 'all',
    tags: '',
    author: '',
    dateRange: 'all'
  });

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
    setSelectedPromptToShare(prompt);
    setShowSharePrompt(true);
  };
  
  const handleCreatePrompt = () => {
    if (!newPromptData.name.trim()) {
      toast.error('Please enter a prompt name');
      return;
    }
    
    // Save to localStorage (mock backend)
    const prompts = JSON.parse(localStorage.getItem('pigeonprompt_prompts') || '[]');
    const newPrompt = {
      id: Date.now(),
      name: newPromptData.name,
      description: newPromptData.description,
      content: newPromptData.content,
      tags: newPromptData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: newPromptData.category,
      isPublic: newPromptData.isPublic,
      author: 'You',
      createdAt: new Date().toISOString(),
      status: 'draft',
      stars: 0,
      downloads: 0,
      likes: 0,
      comments: 0
    };
    
    prompts.push(newPrompt);
    localStorage.setItem('pigeonprompt_prompts', JSON.stringify(prompts));
    
    toast.success(`Prompt "${newPromptData.name}" created successfully!`);
    setShowNewPrompt(false);
    setNewPromptData({
      name: '',
      description: '',
      content: '',
      tags: '',
      category: 'general',
      isPublic: false
    });
  };
  
  const handleApplyFilters = () => {
    toast.success('Filters applied successfully!');
    setShowFilters(false);
  };
  
  const handleShareViaLink = () => {
    navigator.clipboard.writeText(`https://pigeonprompt.com/prompts/${selectedPromptToShare?.id}`);
    toast.success('Share link copied to clipboard!');
    setShowSharePrompt(false);
  };
  
  const handleShareViaEmail = () => {
    const subject = `Check out this prompt: ${selectedPromptToShare?.name}`;
    const body = `I found this great prompt on PigeonPrompt: ${selectedPromptToShare?.description}\n\nView it here: https://pigeonprompt.com/prompts/${selectedPromptToShare?.id}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShowSharePrompt(false);
  };

  const handleExportPrompts = () => {
    const promptsToExport: ExportablePrompt[] = filteredPrompts.map(prompt => ({
      id: prompt.id.toString(),
      title: prompt.name,
      content: prompt.description, // Using description as content for demo
      description: prompt.description,
      tags: prompt.tags,
      category: prompt.folder,
      author: prompt.author,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: prompt.isPublic
    }));

    if (promptsToExport.length === 0) {
      toast.error('No prompts to export');
      return;
    }

    exportPrompts(promptsToExport, selectedExportFormat);
    setShowExportDialog(false);
  };

  const handleImportPrompts = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    const result = await importPrompts(importFile, selectedFolderForImport);
    
    if (result.success) {
      toast.success(`Successfully imported ${result.imported} prompts to PromptHub`);
      // Stay on PromptHub page and refresh the view
      setSelectedTab('my-prompts');
      setSelectedWorkspace('personal');
    }
    
    if (result.errors.length > 0) {
      console.warn('Import errors:', result.errors);
    }

    setShowImportDialog(false);
    setImportFile(null);
    setSelectedFolderForImport('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['.json', '.csv', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setImportFile(file);
      } else {
        toast.error('Please select a JSON, CSV, or TXT file');
        event.target.value = '';
      }
    }
  };
  
  // Mock notifications for hub
  const hubNotifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Community Prompt',
      message: 'Sarah shared a new "Email Marketing" prompt',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Prompt Approved',
      message: 'Your "Customer Support" prompt was approved for the marketplace',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Team Invitation',
      message: 'You were added to "Marketing Team" workspace',
      time: '2 hours ago',
      read: true
    }
  ];
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
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
              <Dialog open={showFilters} onOpenChange={setShowFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                    <DialogDescription>
                      Refine your search with advanced filtering options.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <select 
                        id="category" 
                        value={filterOptions.category}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="all">All Categories</option>
                        <option value="customer-support">Customer Support</option>
                        <option value="content-generation">Content Generation</option>
                        <option value="code-review">Code Review</option>
                        <option value="marketing">Marketing</option>
                        <option value="data-analysis">Data Analysis</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="difficulty" className="text-right">
                        Difficulty
                      </Label>
                      <select 
                        id="difficulty" 
                        value={filterOptions.difficulty}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={filterOptions.tags}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Enter tags separated by commas"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="author" className="text-right">
                        Author
                      </Label>
                      <Input
                        id="author"
                        value={filterOptions.author}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Filter by author name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dateRange" className="text-right">
                        Date Range
                      </Label>
                      <select 
                        id="dateRange" 
                        value={filterOptions.dateRange}
                        onChange={(e) => setFilterOptions(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowFilters(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Import Dialog */}
              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileUp className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Import Prompts</DialogTitle>
                    <DialogDescription>
                      Import prompts from JSON, CSV, or TXT files. The system will automatically format them for compatibility.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="importFile" className="text-right">
                        File
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="importFile"
                          type="file"
                          accept=".json,.csv,.txt"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: JSON, CSV, TXT
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="targetFolder" className="text-right">
                        Target Folder
                      </Label>
                      <select 
                        id="targetFolder" 
                        value={selectedFolderForImport}
                        onChange={(e) => setSelectedFolderForImport(e.target.value)}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="">Default Folder</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.name}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {importFile && (
                      <div className="col-span-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Selected File:</p>
                        <p className="text-sm text-muted-foreground">{importFile.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {(importFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setShowImportDialog(false);
                      setImportFile(null);
                      setSelectedFolderForImport('');
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleImportPrompts} disabled={!importFile}>
                      Import Prompts
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Export Dialog */}
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Export Prompts</DialogTitle>
                    <DialogDescription>
                      Export your prompts in different formats. Choose the format that best suits your needs.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="exportFormat" className="text-right">
                        Format
                      </Label>
                      <select 
                        id="exportFormat" 
                        value={selectedExportFormat}
                        onChange={(e) => setSelectedExportFormat(e.target.value as 'json' | 'csv' | 'txt')}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="json">JSON - Structured data format</option>
                        <option value="csv">CSV - Spreadsheet compatible</option>
                        <option value="txt">TXT - Plain text format</option>
                      </select>
                    </div>
                    <div className="col-span-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Export Summary:</p>
                      <p className="text-sm text-muted-foreground">
                        {filteredPrompts.length} prompts will be exported
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedExportFormat === 'json' && 'JSON format preserves all metadata and is ideal for re-importing.'}
                        {selectedExportFormat === 'csv' && 'CSV format is compatible with spreadsheet applications like Excel.'}
                        {selectedExportFormat === 'txt' && 'TXT format provides a human-readable plain text export.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExportPrompts} disabled={filteredPrompts.length === 0}>
                      Export {filteredPrompts.length} Prompts
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showNewPrompt} onOpenChange={setShowNewPrompt}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Prompt
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Prompt</DialogTitle>
                    <DialogDescription>
                      Create a new prompt template for your workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="promptName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="promptName"
                        value={newPromptData.name}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Awesome Prompt"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="promptDescription" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="promptDescription"
                        value={newPromptData.description}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this prompt does..."
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="promptContent" className="text-right">
                        Content
                      </Label>
                      <Textarea
                        id="promptContent"
                        value={newPromptData.content}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter your prompt template here..."
                        className="col-span-3 min-h-[100px]"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="promptTags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="promptTags"
                        value={newPromptData.tags}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="tag1, tag2, tag3"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="promptCategory" className="text-right">
                        Category
                      </Label>
                      <select 
                        id="promptCategory" 
                        value={newPromptData.category}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, category: e.target.value }))}
                        className="col-span-3 p-2 border border-border rounded"
                      >
                        <option value="general">General</option>
                        <option value="customer-support">Customer Support</option>
                        <option value="content-generation">Content Generation</option>
                        <option value="code-review">Code Review</option>
                        <option value="marketing">Marketing</option>
                        <option value="data-analysis">Data Analysis</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isPublic" className="text-right">
                        Make Public
                      </Label>
                      <input 
                        type="checkbox" 
                        id="isPublic" 
                        checked={newPromptData.isPublic}
                        onChange={(e) => setNewPromptData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="col-span-3" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewPrompt(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePrompt}>
                      Create Prompt
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              {/* Filter Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={selectedFilter === "trending" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("trending")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </Button>
                  <Button
                    variant={selectedFilter === "featured" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("featured")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Featured
                  </Button>
                  <Button
                    variant={selectedFilter === "new" ? "default" : "outline"}
                    onClick={() => setSelectedFilter("new")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Discover Filters</DialogTitle>
                      <DialogDescription>
                        Filter prompts by category, difficulty, and more.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discoverCategory" className="text-right">
                          Category
                        </Label>
                        <select 
                          id="discoverCategory" 
                          value={filterOptions.category}
                          onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                          className="col-span-3 p-2 border border-border rounded"
                        >
                          <option value="all">All Categories</option>
                          <option value="customer-support">Customer Support</option>
                          <option value="content-generation">Content Generation</option>
                          <option value="code-review">Code Review</option>
                          <option value="marketing">Marketing</option>
                          <option value="data-analysis">Data Analysis</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discoverDifficulty" className="text-right">
                          Difficulty
                        </Label>
                        <select 
                          id="discoverDifficulty" 
                          value={filterOptions.difficulty}
                          onChange={(e) => setFilterOptions(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="col-span-3 p-2 border border-border rounded"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discoverTags" className="text-right">
                          Tags
                        </Label>
                        <Input
                          id="discoverTags"
                          value={filterOptions.tags}
                          onChange={(e) => setFilterOptions(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="Enter tags separated by commas"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discoverAuthor" className="text-right">
                          Author
                        </Label>
                        <Input
                          id="discoverAuthor"
                          value={filterOptions.author}
                          onChange={(e) => setFilterOptions(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Filter by author name"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowFilters(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleApplyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
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
          
          {selectedTab === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Team Collaboration</h3>
                <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Team Notifications</DialogTitle>
                      <DialogDescription>
                        Stay updated with your team's activity and collaboration.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                      {hubNotifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-border ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {!notification.read && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => {
                        toast.success('All notifications marked as read');
                        setShowNotifications(false);
                      }}>
                        Mark All Read
                      </Button>
                      <Button onClick={() => setShowNotifications(false)}>
                        Close
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Active Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Sarah Chen", role: "Lead Prompt Engineer", status: "online" },
                        { name: "Mike Johnson", role: "AI Researcher", status: "away" },
                        { name: "Emily Davis", role: "Content Strategist", status: "online" },
                        { name: "Alex Kim", role: "Developer", status: "offline" }
                      ].map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            member.status === 'online' ? 'bg-green-500' :
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { user: "Sarah", action: "shared", item: "Customer Support Template", time: "2 hours ago" },
                        { user: "Mike", action: "updated", item: "Code Review Prompt", time: "4 hours ago" },
                        { user: "Emily", action: "created", item: "Marketing Copy Generator", time: "1 day ago" },
                        { user: "Alex", action: "commented on", item: "API Documentation Helper", time: "2 days ago" }
                      ].map((activity, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-muted-foreground"> {activity.action} </span>
                          <span className="font-medium">{activity.item}</span>
                          <span className="text-muted-foreground"> • {activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Prompts</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Dialog open={showFilters} onOpenChange={setShowFilters}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Team Prompt Filters</DialogTitle>
                            <DialogDescription>
                              Filter team prompts by various criteria.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamCategory" className="text-right">
                                Category
                              </Label>
                              <select 
                                id="teamCategory" 
                                value={filterOptions.category}
                                onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                                className="col-span-3 p-2 border border-border rounded"
                              >
                                <option value="all">All Categories</option>
                                <option value="customer-support">Customer Support</option>
                                <option value="content-generation">Content Generation</option>
                                <option value="code-review">Code Review</option>
                                <option value="marketing">Marketing</option>
                                <option value="data-analysis">Data Analysis</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamAuthor" className="text-right">
                                Team Member
                              </Label>
                              <Input
                                id="teamAuthor"
                                value={filterOptions.author}
                                onChange={(e) => setFilterOptions(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="Filter by team member"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamDateRange" className="text-right">
                                Date Range
                              </Label>
                              <select 
                                id="teamDateRange" 
                                value={filterOptions.dateRange}
                                onChange={(e) => setFilterOptions(prev => ({ ...prev, dateRange: e.target.value }))}
                                className="col-span-3 p-2 border border-border rounded"
                              >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowFilters(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleApplyFilters}>
                              Apply Filters
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showNewPrompt} onOpenChange={setShowNewPrompt}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New Prompt
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Create Team Prompt</DialogTitle>
                            <DialogDescription>
                              Create a new prompt for your team workspace.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamPromptName" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="teamPromptName"
                                value={newPromptData.name}
                                onChange={(e) => setNewPromptData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Team Prompt Name"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamPromptDescription" className="text-right">
                                Description
                              </Label>
                              <Textarea
                                id="teamPromptDescription"
                                value={newPromptData.description}
                                onChange={(e) => setNewPromptData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe this team prompt..."
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamPromptContent" className="text-right">
                                Content
                              </Label>
                              <Textarea
                                id="teamPromptContent"
                                value={newPromptData.content}
                                onChange={(e) => setNewPromptData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Enter your team prompt template here..."
                                className="col-span-3 min-h-[100px]"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="teamPromptTags" className="text-right">
                                Tags
                              </Label>
                              <Input
                                id="teamPromptTags"
                                value={newPromptData.tags}
                                onChange={(e) => setNewPromptData(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="tag1, tag2, tag3"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowNewPrompt(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreatePrompt}>
                              Create Team Prompt
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prompts.slice(0, 6).map((prompt) => (
                      <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm">{prompt.name}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {prompt.author}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-xs text-muted-foreground mb-3">
                            {prompt.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1" />
                                {prompt.stars}
                              </span>
                              <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {prompt.downloads}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
                          <Dialog open={showSharePrompt && selectedPromptToShare?.id === prompt.id} onOpenChange={(open) => {
                            if (!open) {
                              setShowSharePrompt(false);
                              setSelectedPromptToShare(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 h-8 w-8"
                                onClick={() => handleSharePrompt(prompt)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Share Prompt</DialogTitle>
                                <DialogDescription>
                                  Share "{selectedPromptToShare?.name}" with others.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-4">
                                  <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">Share via Link</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Copy the link to share this prompt with anyone.
                                    </p>
                                    <Button onClick={handleShareViaLink} className="w-full">
                                      <Share2 className="h-4 w-4 mr-2" />
                                      Copy Share Link
                                    </Button>
                                  </div>
                                  
                                  <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">Share via Email</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Send this prompt via email to colleagues.
                                    </p>
                                    <Button onClick={handleShareViaEmail} variant="outline" className="w-full">
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      Share via Email
                                    </Button>
                                  </div>
                                  
                                  <div className="p-4 border border-border rounded-lg">
                                    <h4 className="font-medium mb-2">Export Options</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Download or export this prompt in different formats.
                                    </p>
                                    <div className="flex space-x-2">
                                      <Button onClick={() => {
                                        toast.success('Prompt exported as JSON');
                                        setShowSharePrompt(false);
                                      }} variant="outline" size="sm">
                                        Export JSON
                                      </Button>
                                      <Button onClick={() => {
                                        toast.success('Prompt exported as Markdown');
                                        setShowSharePrompt(false);
                                      }} variant="outline" size="sm">
                                        Export MD
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => {
                                  setShowSharePrompt(false);
                                  setSelectedPromptToShare(null);
                                }}>
                                  Close
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
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