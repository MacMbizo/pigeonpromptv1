import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Plus,
  Minus,
  RotateCcw,
  Upload,
  Download,
  RefreshCw,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';

interface GitFile {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

interface GitBranch {
  name: string;
  current: boolean;
  remote?: string;
  ahead?: number;
  behind?: number;
}

interface GitIntegrationProps {
  projectPath?: string;
  onFileStatusChange?: (files: GitFile[]) => void;
}

const GitIntegration: React.FC<GitIntegrationProps> = ({ 
  projectPath, 
  onFileStatusChange 
}) => {
  const [isGitRepo, setIsGitRepo] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [files, setFiles] = useState<GitFile[]>([]);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);

  // Initialize Git status when project path changes
  useEffect(() => {
    if (projectPath) {
      initializeGitStatus();
    }
  }, [projectPath]);

  // Mock Git operations (in real implementation, these would use Git commands)
  const initializeGitStatus = async () => {
    setIsLoading(true);
    
    try {
      // Simulate checking if directory is a Git repository
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in real implementation, this would check for .git directory
      setIsGitRepo(true);
      
      // Load mock data
      loadBranches();
      loadFiles();
      loadCommits();
      
    } catch (error) {
      console.error('Failed to initialize Git status:', error);
      setIsGitRepo(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBranches = () => {
    // Mock branches data
    const mockBranches: GitBranch[] = [
      { name: 'main', current: true, remote: 'origin/main', ahead: 2, behind: 0 },
      { name: 'feature/auth', current: false, remote: 'origin/feature/auth' },
      { name: 'develop', current: false, remote: 'origin/develop', ahead: 0, behind: 3 },
      { name: 'hotfix/bug-123', current: false }
    ];
    
    setBranches(mockBranches);
    setCurrentBranch(mockBranches.find(b => b.current)?.name || 'main');
  };

  const loadFiles = () => {
    // Mock changed files
    const mockFiles: GitFile[] = [
      { path: 'src/components/PromptIDE.tsx', status: 'modified', staged: false },
      { path: 'src/hooks/useAuth.ts', status: 'modified', staged: true },
      { path: 'src/components/NewComponent.tsx', status: 'added', staged: false },
      { path: 'README.md', status: 'modified', staged: true },
      { path: 'package.json', status: 'modified', staged: false },
      { path: 'src/utils/deleted-file.ts', status: 'deleted', staged: false },
      { path: 'temp-file.txt', status: 'untracked', staged: false }
    ];
    
    setFiles(mockFiles);
    onFileStatusChange?.(mockFiles);
  };

  const loadCommits = () => {
    // Mock commit history
    const mockCommits: GitCommit[] = [
      {
        hash: 'a1b2c3d',
        message: 'Add file preview functionality with syntax highlighting',
        author: 'John Doe',
        date: '2024-01-15 14:30',
        files: ['src/components/FilePreview.tsx', 'src/utils/syntax.ts']
      },
      {
        hash: 'e4f5g6h',
        message: 'Implement File System Access API integration',
        author: 'Jane Smith',
        date: '2024-01-15 10:15',
        files: ['src/components/FileSystemManager.tsx', 'src/hooks/useFileSystem.ts']
      },
      {
        hash: 'i7j8k9l',
        message: 'Update authentication flow and add social login',
        author: 'John Doe',
        date: '2024-01-14 16:45',
        files: ['src/components/Login.tsx', 'src/hooks/useAuth.ts']
      },
      {
        hash: 'm0n1o2p',
        message: 'Initial project setup with Vite and Tailwind',
        author: 'Jane Smith',
        date: '2024-01-14 09:00',
        files: ['package.json', 'vite.config.ts', 'tailwind.config.js']
      }
    ];
    
    setCommits(mockCommits);
  };

  // Get status icon for file
  const getStatusIcon = (status: GitFile['status']) => {
    switch (status) {
      case 'modified':
        return <Circle className="h-3 w-3 text-yellow-500" />;
      case 'added':
        return <Plus className="h-3 w-3 text-green-500" />;
      case 'deleted':
        return <Minus className="h-3 w-3 text-red-500" />;
      case 'untracked':
        return <AlertCircle className="h-3 w-3 text-blue-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: GitFile['status']) => {
    switch (status) {
      case 'modified': return 'text-yellow-600';
      case 'added': return 'text-green-600';
      case 'deleted': return 'text-red-600';
      case 'untracked': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Stage/unstage file
  const toggleFileStaging = (filePath: string) => {
    setFiles(prev => prev.map(file => 
      file.path === filePath 
        ? { ...file, staged: !file.staged }
        : file
    ));
    
    toast.success(`File ${files.find(f => f.path === filePath)?.staged ? 'unstaged' : 'staged'}`);
  };

  // Stage all files
  const stageAllFiles = () => {
    setFiles(prev => prev.map(file => ({ ...file, staged: true })));
    toast.success('All files staged');
  };

  // Unstage all files
  const unstageAllFiles = () => {
    setFiles(prev => prev.map(file => ({ ...file, staged: false })));
    toast.success('All files unstaged');
  };

  // Commit changes
  const commitChanges = async () => {
    if (!commitMessage.trim()) {
      toast.error('Please enter a commit message');
      return;
    }
    
    const stagedFiles = files.filter(f => f.staged);
    if (stagedFiles.length === 0) {
      toast.error('No files staged for commit');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate commit operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new commit to history
      const newCommit: GitCommit = {
        hash: Math.random().toString(36).substr(2, 7),
        message: commitMessage,
        author: 'Current User',
        date: new Date().toLocaleString(),
        files: stagedFiles.map(f => f.path)
      };
      
      setCommits(prev => [newCommit, ...prev]);
      
      // Remove committed files from changes
      setFiles(prev => prev.filter(f => !f.staged));
      
      setCommitMessage('');
      toast.success('Changes committed successfully');
      
    } catch (error) {
      toast.error('Failed to commit changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch branch
  const switchBranch = async (branchName: string) => {
    if (branchName === currentBranch) return;
    
    setIsLoading(true);
    
    try {
      // Simulate branch switch
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBranches(prev => prev.map(branch => ({
        ...branch,
        current: branch.name === branchName
      })));
      
      setCurrentBranch(branchName);
      toast.success(`Switched to branch: ${branchName}`);
      
    } catch (error) {
      toast.error('Failed to switch branch');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new branch
  const createBranch = async () => {
    if (!newBranchName.trim()) {
      toast.error('Please enter a branch name');
      return;
    }
    
    if (branches.some(b => b.name === newBranchName)) {
      toast.error('Branch already exists');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate branch creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBranch: GitBranch = {
        name: newBranchName,
        current: false
      };
      
      setBranches(prev => [...prev, newBranch]);
      setNewBranchName('');
      setShowNewBranch(false);
      toast.success(`Branch created: ${newBranchName}`);
      
    } catch (error) {
      toast.error('Failed to create branch');
    } finally {
      setIsLoading(false);
    }
  };

  // Pull changes
  const pullChanges = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pulled latest changes');
      loadCommits(); // Refresh commits
    } catch (error) {
      toast.error('Failed to pull changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Push changes
  const pushChanges = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Pushed changes to remote');
    } catch (error) {
      toast.error('Failed to push changes');
    } finally {
      setIsLoading(false);
    }
  };

  if (!projectPath) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a project to view Git status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isGitRepo) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-muted-foreground mb-4">This directory is not a Git repository</p>
            <Button onClick={() => toast.info('Git initialization would happen here')}>
              <GitBranch className="h-4 w-4 mr-2" />
              Initialize Git Repository
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Branch Management */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span>Branches</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={pullChanges}
                disabled={isLoading}
              >
                <Download className="h-3 w-3 mr-1" />
                Pull
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={pushChanges}
                disabled={isLoading}
              >
                <Upload className="h-3 w-3 mr-1" />
                Push
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewBranch(!showNewBranch)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {showNewBranch && (
            <div className="flex items-center space-x-2 mt-3">
              <Input
                placeholder="Branch name"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createBranch()}
              />
              <Button size="sm" onClick={createBranch}>
                Create
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                  branch.current ? 'bg-primary/10' : ''
                }`}
                onClick={() => switchBranch(branch.name)}
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className={`h-3 w-3 ${
                    branch.current ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <span className={`text-sm ${
                    branch.current ? 'font-medium' : ''
                  }`}>
                    {branch.name}
                  </span>
                  {branch.current && (
                    <Badge variant="outline" className="text-xs">
                      current
                    </Badge>
                  )}
                </div>
                
                {branch.remote && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {branch.ahead && branch.ahead > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{branch.ahead}
                      </Badge>
                    )}
                    {branch.behind && branch.behind > 0 && (
                      <Badge variant="outline" className="text-xs">
                        -{branch.behind}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Changes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Changes ({files.length})</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={stageAllFiles}
                disabled={files.length === 0}
              >
                <Plus className="h-3 w-3 mr-1" />
                Stage All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={unstageAllFiles}
                disabled={files.filter(f => f.staged).length === 0}
              >
                <Minus className="h-3 w-3 mr-1" />
                Unstage All
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No changes detected</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleFileStaging(file.path)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {getStatusIcon(file.status)}
                      <span className="text-sm font-mono truncate">
                        {file.path}
                      </span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(file.status)}`}>
                        {file.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.staged && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          {files.filter(f => f.staged).length > 0 && (
            <div className="mt-4 space-y-3">
              <Separator />
              <div>
                <Textarea
                  placeholder="Commit message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  className="mt-2 w-full"
                  onClick={commitChanges}
                  disabled={!commitMessage.trim() || isLoading}
                >
                  <GitCommit className="h-4 w-4 mr-2" />
                  Commit Changes ({files.filter(f => f.staged).length} files)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commit History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recent Commits</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {commits.map((commit) => (
                <div key={commit.hash} className="border-l-2 border-muted pl-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {commit.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{commit.author}</span>
                        </span>
                        <span>{commit.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {commit.hash}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {commit.files.length} file(s) changed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default GitIntegration;