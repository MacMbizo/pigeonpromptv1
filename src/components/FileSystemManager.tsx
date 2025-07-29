import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  Folder,
  FolderOpen,
  File,
  FileText,
  Code,
  Image,
  Settings,
  Database,
  Package,
  GitBranch,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';

// Types for File System Access API
interface ProjectConnection {
  id: string;
  name: string;
  directoryHandle: FileSystemDirectoryHandle;
  lastAccessed: Date;
  gitRemoteUrl?: string;
  settings: {
    showIgnored: boolean;
    customIgnoreRules: string[];
  };
}

interface FileTreeNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  gitStatus?: 'modified' | 'new' | 'staged' | 'ignored';
  tokenEstimate: number;
  selected: boolean;
  expanded?: boolean;
  children?: FileTreeNode[];
  size?: number;
  lastModified?: Date;
}

interface FileSystemManagerProps {
  onFilesSelected?: (files: FileTreeNode[]) => void;
  onProjectConnected?: (project: ProjectConnection) => void;
}

const FileSystemManager: React.FC<FileSystemManagerProps> = ({
  onFilesSelected,
  onProjectConnected
}) => {
  const [projects, setProjects] = useState<ProjectConnection[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectConnection | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showIgnored, setShowIgnored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gitIgnoreRules, setGitIgnoreRules] = useState<string[]>([]);

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = 'showDirectoryPicker' in window;

  // Load projects from IndexedDB on component mount
  useEffect(() => {
    loadStoredProjects();
  }, []);

  // Load stored projects from IndexedDB
  const loadStoredProjects = async () => {
    try {
      const db = await openProjectDB();
      const transaction = db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const storedProjects = request.result.map((p: any) => ({
          ...p,
          lastAccessed: new Date(p.lastAccessed)
        }));
        setProjects(storedProjects);
      };
    } catch (error) {
      console.error('Failed to load stored projects:', error);
    }
  };

  // Open IndexedDB for project storage
  const openProjectDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FileSystemProjects', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      };
    });
  };

  // Connect to a local project directory
  const connectProject = async () => {
    if (!isFileSystemAccessSupported) {
      toast.error('File System Access API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Request directory access
      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      // Create project connection
      const project: ProjectConnection = {
        id: crypto.randomUUID(),
        name: directoryHandle.name,
        directoryHandle,
        lastAccessed: new Date(),
        settings: {
          showIgnored: false,
          customIgnoreRules: []
        }
      };

      // Store project in IndexedDB
      await storeProject(project);
      
      // Update state
      setProjects(prev => [project, ...prev]);
      setCurrentProject(project);
      
      // Load file tree
      await loadFileTree(project);
      
      toast.success(`Connected to project: ${project.name}`);
      onProjectConnected?.(project);
      
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Failed to connect project:', error);
        toast.error('Failed to connect to project directory');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Store project in IndexedDB
  const storeProject = async (project: ProjectConnection) => {
    try {
      const db = await openProjectDB();
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      await store.put(project);
    } catch (error) {
      console.error('Failed to store project:', error);
    }
  };

  // Load file tree from directory handle
  const loadFileTree = async (project: ProjectConnection) => {
    try {
      setIsLoading(true);
      
      // Load .gitignore rules
      const ignoreRules = await loadGitIgnoreRules(project.directoryHandle);
      setGitIgnoreRules(ignoreRules);
      
      // Build file tree
      const tree = await buildFileTree(project.directoryHandle, '', ignoreRules);
      setFileTree(tree);
      
    } catch (error) {
      console.error('Failed to load file tree:', error);
      toast.error('Failed to load project files');
    } finally {
      setIsLoading(false);
    }
  };

  // Load .gitignore rules
  const loadGitIgnoreRules = async (directoryHandle: FileSystemDirectoryHandle): Promise<string[]> => {
    const rules: string[] = [];
    
    try {
      const gitignoreHandle = await directoryHandle.getFileHandle('.gitignore');
      const file = await gitignoreHandle.getFile();
      const content = await file.text();
      
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
      
      rules.push(...lines);
    } catch (error) {
      // .gitignore doesn't exist, which is fine
    }
    
    // Add default ignore patterns
    rules.push(
      'node_modules',
      '.git',
      '.DS_Store',
      'Thumbs.db',
      '*.log',
      '.env',
      '.env.local',
      'dist',
      'build'
    );
    
    return rules;
  };

  // Check if file should be ignored
  const shouldIgnoreFile = (path: string, rules: string[]): boolean => {
    return rules.some(rule => {
      if (rule.includes('*')) {
        const regex = new RegExp(rule.replace(/\*/g, '.*'));
        return regex.test(path);
      }
      return path.includes(rule);
    });
  };

  // Build file tree recursively
  const buildFileTree = async (
    directoryHandle: FileSystemDirectoryHandle,
    currentPath: string,
    ignoreRules: string[],
    depth: number = 0
  ): Promise<FileTreeNode[]> => {
    const nodes: FileTreeNode[] = [];
    
    // Limit recursion depth to prevent infinite loops
    if (depth > 10) return nodes;
    
    try {
      for await (const [name, handle] of directoryHandle.entries()) {
        const fullPath = currentPath ? `${currentPath}/${name}` : name;
        const isIgnored = shouldIgnoreFile(fullPath, ignoreRules);
        
        if (isIgnored && !showIgnored) continue;
        
        const node: FileTreeNode = {
          path: fullPath,
          name,
          type: handle.kind,
          handle,
          gitStatus: isIgnored ? 'ignored' : undefined,
          tokenEstimate: 0,
          selected: false,
          expanded: false
        };
        
        if (handle.kind === 'file') {
          try {
            const file = await (handle as FileSystemFileHandle).getFile();
            node.size = file.size;
            node.lastModified = new Date(file.lastModified);
            node.tokenEstimate = estimateTokens(file.size);
          } catch (error) {
            // File might be locked or inaccessible
          }
        } else if (handle.kind === 'directory' && depth < 3) {
          // Load first few levels by default
          node.children = await buildFileTree(
            handle as FileSystemDirectoryHandle,
            fullPath,
            ignoreRules,
            depth + 1
          );
          node.expanded = depth < 2;
        }
        
        nodes.push(node);
      }
    } catch (error) {
      console.error('Error reading directory:', error);
    }
    
    return nodes.sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Estimate token count based on file size
  const estimateTokens = (sizeInBytes: number): number => {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(sizeInBytes / 4);
  };

  // Get file icon based on extension
  const getFileIcon = (fileName: string, isDirectory: boolean) => {
    if (isDirectory) {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'vue':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'cs':
      case 'php':
      case 'rb':
      case 'go':
      case 'rs':
        return <Code className="h-4 w-4 text-green-500" />;
      case 'json':
      case 'xml':
      case 'yaml':
      case 'yml':
      case 'toml':
        return <Settings className="h-4 w-4 text-orange-500" />;
      case 'md':
      case 'txt':
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        return <Image className="h-4 w-4 text-purple-500" />;
      case 'sql':
      case 'db':
      case 'sqlite':
        return <Database className="h-4 w-4 text-yellow-500" />;
      case 'package':
      case 'lock':
        return <Package className="h-4 w-4 text-red-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  // Toggle file selection
  const toggleFileSelection = (path: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedFiles(newSelected);
    
    // Get selected file nodes
    const selectedNodes = getSelectedFileNodes(fileTree, newSelected);
    onFilesSelected?.(selectedNodes);
  };

  // Get selected file nodes
  const getSelectedFileNodes = (nodes: FileTreeNode[], selected: Set<string>): FileTreeNode[] => {
    const result: FileTreeNode[] = [];
    
    for (const node of nodes) {
      if (selected.has(node.path)) {
        result.push(node);
      }
      if (node.children) {
        result.push(...getSelectedFileNodes(node.children, selected));
      }
    }
    
    return result;
  };

  // Toggle directory expansion
  const toggleDirectoryExpansion = async (node: FileTreeNode) => {
    if (node.type !== 'directory') return;
    
    const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
      return nodes.map(n => {
        if (n.path === node.path) {
          return { ...n, expanded: !n.expanded };
        }
        if (n.children) {
          return { ...n, children: updateTree(n.children) };
        }
        return n;
      });
    };
    
    setFileTree(updateTree(fileTree));
    
    // Load children if not already loaded
    if (!node.children && currentProject) {
      try {
        const children = await buildFileTree(
          node.handle as FileSystemDirectoryHandle,
          node.path,
          gitIgnoreRules
        );
        
        const updateTreeWithChildren = (nodes: FileTreeNode[]): FileTreeNode[] => {
          return nodes.map(n => {
            if (n.path === node.path) {
              return { ...n, children, expanded: true };
            }
            if (n.children) {
              return { ...n, children: updateTreeWithChildren(n.children) };
            }
            return n;
          });
        };
        
        setFileTree(updateTreeWithChildren(fileTree));
      } catch (error) {
        console.error('Failed to load directory children:', error);
      }
    }
  };

  // Render file tree node
  const renderFileTreeNode = (node: FileTreeNode, depth: number = 0) => {
    const isSelected = selectedFiles.has(node.path);
    const isIgnored = node.gitStatus === 'ignored';
    
    // Filter by search term
    if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }
    
    return (
      <div key={node.path} className={`${isIgnored ? 'opacity-50' : ''}`}>
        <div
          className={`flex items-center space-x-2 py-1 px-2 hover:bg-muted rounded-sm cursor-pointer ${
            isSelected ? 'bg-primary/10' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === 'directory' && (
            <button
              onClick={() => toggleDirectoryExpansion(node)}
              className="p-0 h-4 w-4 flex items-center justify-center"
            >
              {node.expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {node.type === 'file' && (
            <div className="w-4" /> // Spacer for alignment
          )}
          
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleFileSelection(node.path)}
            className="h-3 w-3"
          />
          
          {getFileIcon(node.name, node.type === 'directory')}
          
          <span className="text-sm flex-1 truncate">{node.name}</span>
          
          {node.type === 'file' && node.tokenEstimate > 0 && (
            <Badge variant="outline" className="text-xs">
              {node.tokenEstimate} tokens
            </Badge>
          )}
          
          {node.gitStatus && (
            <Badge
              variant={node.gitStatus === 'ignored' ? 'secondary' : 'default'}
              className="text-xs"
            >
              {node.gitStatus}
            </Badge>
          )}
        </div>
        
        {node.expanded && node.children && (
          <div>
            {node.children.map(child => renderFileTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Remove project
  const removeProject = async (projectId: string) => {
    try {
      const db = await openProjectDB();
      const transaction = db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      await store.delete(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setFileTree([]);
        setSelectedFiles(new Set());
      }
      
      toast.success('Project removed');
    } catch (error) {
      console.error('Failed to remove project:', error);
      toast.error('Failed to remove project');
    }
  };

  if (!isFileSystemAccessSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File System Access Not Supported</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your browser doesn't support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser to access local files.
          </p>
          <p className="text-sm text-muted-foreground">
            As an alternative, you can copy and paste code snippets directly into the prompt editor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Files</h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={connectProject}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Connect Project
          </Button>
        </div>
      </div>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted ${
                    currentProject?.id === project.id ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => {
                    setCurrentProject(project);
                    loadFileTree(project);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Last accessed: {project.lastAccessed.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(project.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Explorer */}
      {currentProject && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center space-x-2">
                <FolderOpen className="h-4 w-4" />
                <span>{currentProject.name}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIgnored(!showIgnored)}
                >
                  {showIgnored ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadFileTree(currentProject)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Selection Summary */}
            {selectedFiles.size > 0 && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium">
                  {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                </div>
                <div className="text-xs text-muted-foreground">
                  Total tokens: {getSelectedFileNodes(fileTree, selectedFiles)
                    .reduce((sum, node) => sum + node.tokenEstimate, 0)}
                </div>
              </div>
            )}
            
            {/* File Tree */}
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading files...</span>
                </div>
              ) : fileTree.length > 0 ? (
                <div className="space-y-1">
                  {fileTree.map(node => renderFileTreeNode(node))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No files found
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileSystemManager;