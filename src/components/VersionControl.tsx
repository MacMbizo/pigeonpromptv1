import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  History,
  Plus,
  Check,
  X,
  Eye,
  Download,
  Upload,
  Tag,
  Clock,
  User,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: Date;
  changes: {
    added: number;
    removed: number;
  };
  prompt: string;
  branch: string;
}

interface Branch {
  name: string;
  lastCommit: string;
  ahead: number;
  behind: number;
  isActive: boolean;
}

interface VersionControlProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  promptName: string;
}

export default function VersionControl({ prompt, onPromptChange, promptName }: VersionControlProps) {
  const [branches, setBranches] = useState<Branch[]>([
    { name: "main", lastCommit: "abc123", ahead: 0, behind: 0, isActive: true },
    { name: "feature/optimization", lastCommit: "def456", ahead: 2, behind: 1, isActive: false },
    { name: "experiment/new-approach", lastCommit: "ghi789", ahead: 1, behind: 3, isActive: false }
  ]);
  
  const [commits, setCommits] = useState<Commit[]>([
    {
      id: "abc123",
      message: "Initial prompt creation",
      author: "John Doe",
      timestamp: new Date(Date.now() - 86400000),
      changes: { added: 45, removed: 0 },
      prompt: "You are a helpful assistant. Please help the user with their request.",
      branch: "main"
    },
    {
      id: "def456",
      message: "Improve clarity and add context",
      author: "Jane Smith",
      timestamp: new Date(Date.now() - 43200000),
      changes: { added: 23, removed: 8 },
      prompt: "You are a helpful and knowledgeable assistant. Please provide clear, accurate responses to help the user with their specific request.",
      branch: "main"
    },
    {
      id: "ghi789",
      message: "Add role-specific instructions",
      author: "John Doe",
      timestamp: new Date(Date.now() - 21600000),
      changes: { added: 67, removed: 12 },
      prompt: "You are a helpful and knowledgeable assistant with expertise in various domains. Please provide clear, accurate, and detailed responses to help the user with their specific request. Always consider the context and ask clarifying questions if needed.",
      branch: "main"
    }
  ]);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showBranches, setShowBranches] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [showNewBranchDialog, setShowNewBranchDialog] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);

  const currentBranch = branches.find(b => b.isActive)?.name || "main";
  const branchCommits = commits.filter(c => c.branch === currentBranch);

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast.error("Please enter a commit message");
      return;
    }

    const newCommit: Commit = {
      id: Math.random().toString(36).substr(2, 6),
      message: commitMessage,
      author: "Current User",
      timestamp: new Date(),
      changes: {
        added: Math.floor(Math.random() * 50) + 10,
        removed: Math.floor(Math.random() * 20)
      },
      prompt: prompt,
      branch: currentBranch
    };

    setCommits(prev => [newCommit, ...prev]);
    setCommitMessage("");
    setShowCommitDialog(false);
    toast.success("Changes committed successfully");
  };

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) {
      toast.error("Please enter a branch name");
      return;
    }

    if (branches.some(b => b.name === newBranchName)) {
      toast.error("Branch name already exists");
      return;
    }

    const newBranch: Branch = {
      name: newBranchName,
      lastCommit: commits[0]?.id || "abc123",
      ahead: 0,
      behind: 0,
      isActive: false
    };

    setBranches(prev => [...prev, newBranch]);
    setNewBranchName("");
    setShowNewBranchDialog(false);
    toast.success(`Branch '${newBranchName}' created successfully`);
  };

  const handleSwitchBranch = (branchName: string) => {
    setBranches(prev => prev.map(b => ({ ...b, isActive: b.name === branchName })));
    
    // Load the latest commit from the branch
    const branchCommit = commits.find(c => c.branch === branchName);
    if (branchCommit) {
      onPromptChange(branchCommit.prompt);
    }
    
    toast.success(`Switched to branch '${branchName}'`);
  };

  const handleViewCommit = (commit: Commit) => {
    setSelectedCommit(commit);
  };

  const handleRestoreCommit = (commit: Commit) => {
    onPromptChange(commit.prompt);
    toast.success(`Restored prompt from commit ${commit.id}`);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="border-t border-border">
      {/* Version Control Toolbar */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span className="text-sm font-medium">{currentBranch}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {branchCommits.length} commit{branchCommits.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBranches(!showBranches)}
            >
              <GitBranch className="h-3 w-3 mr-1" />
              Branches
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowCommitDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <GitCommit className="h-3 w-3 mr-1" />
              Commit
            </Button>
          </div>
        </div>
      </div>

      {/* Branches Panel */}
      {showBranches && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Branches</h3>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowNewBranchDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Branch
            </Button>
          </div>
          
          <div className="space-y-2">
            {branches.map((branch) => (
              <div 
                key={branch.name}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  branch.isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'
                }`}
                onClick={() => !branch.isActive && handleSwitchBranch(branch.name)}
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-3 w-3" />
                  <span className="text-sm font-medium">{branch.name}</span>
                  {branch.isActive && <Check className="h-3 w-3 text-green-600" />}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {branch.ahead > 0 && <span className="text-green-600">+{branch.ahead}</span>}
                  {branch.behind > 0 && <span className="text-red-600">-{branch.behind}</span>}
                  <span>{branch.lastCommit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Commit History</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {branchCommits.map((commit) => (
              <Card key={commit.id} className="text-sm">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{commit.message}</div>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {commit.author}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(commit.timestamp)}
                        </span>
                        <span className="text-green-600">+{commit.changes.added}</span>
                        <span className="text-red-600">-{commit.changes.removed}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewCommit(commit)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRestoreCommit(commit)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Commit Dialog */}
      {showCommitDialog && (
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Commit Changes</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Commit Message</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe your changes..."
                className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCommit} className="flex-1">
                <GitCommit className="h-3 w-3 mr-1" />
                Commit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowCommitDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Branch Dialog */}
      {showNewBranchDialog && (
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Create New Branch</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Branch Name</label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder="feature/new-feature"
                className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleCreateBranch} className="flex-1">
                <GitBranch className="h-3 w-3 mr-1" />
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowNewBranchDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Commit Detail View */}
      {selectedCommit && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Commit Details</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedCommit(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Message</div>
              <div className="text-sm">{selectedCommit.message}</div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-muted-foreground">Prompt Content</div>
              <div className="text-xs bg-muted p-2 rounded font-mono max-h-32 overflow-y-auto">
                {selectedCommit.prompt}
              </div>
            </div>
            
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>Author: {selectedCommit.author}</span>
              <span>ID: {selectedCommit.id}</span>
              <span>{formatTimeAgo(selectedCommit.timestamp)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}