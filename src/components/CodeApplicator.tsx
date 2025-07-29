import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  Check,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Eye,
  Code,
  FileText,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import DiffViewer from './DiffViewer';

interface CodeChange {
  id: string;
  type: 'addition' | 'deletion' | 'modification' | 'move' | 'rename';
  filePath: string;
  description: string;
  originalContent?: string;
  newContent?: string;
  lineStart?: number;
  lineEnd?: number;
  confidence: number;
  dependencies?: string[];
  conflicts?: string[];
  preview?: string;
  applied?: boolean;
  error?: string;
}

interface ApplySession {
  id: string;
  name: string;
  changes: CodeChange[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  createdAt: Date;
  appliedAt?: Date;
}

interface CodeApplicatorProps {
  changes: CodeChange[];
  onApplyChange?: (change: CodeChange) => Promise<boolean>;
  onApplyAll?: (changes: CodeChange[]) => Promise<boolean>;
  onPreviewChange?: (change: CodeChange) => Promise<string>;
  onValidateChange?: (change: CodeChange) => Promise<{ valid: boolean; errors: string[] }>;
  autoApply?: boolean;
  batchSize?: number;
}

const CodeApplicator: React.FC<CodeApplicatorProps> = ({
  changes: initialChanges,
  onApplyChange,
  onApplyAll,
  onPreviewChange,
  onValidateChange,
  autoApply = false,
  batchSize = 5
}) => {
  const [changes, setChanges] = useState<CodeChange[]>(initialChanges);
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(new Set());
  const [currentSession, setCurrentSession] = useState<ApplySession | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [previewChange, setPreviewChange] = useState<CodeChange | null>(null);
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'type' | 'file'>('confidence');
  const [showConflicts, setShowConflicts] = useState(true);

  // Filter and sort changes
  const filteredChanges = useMemo(() => {
    let filtered = changes;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(change => change.type === filterType);
    }
    
    if (!showConflicts) {
      filtered = filtered.filter(change => !change.conflicts || change.conflicts.length === 0);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'file':
          return a.filePath.localeCompare(b.filePath);
        default:
          return 0;
      }
    });
  }, [changes, filterType, sortBy, showConflicts]);

  // Statistics
  const stats = useMemo(() => {
    const total = changes.length;
    const applied = changes.filter(c => c.applied).length;
    const pending = total - applied;
    const conflicts = changes.filter(c => c.conflicts && c.conflicts.length > 0).length;
    const highConfidence = changes.filter(c => c.confidence >= 0.8).length;
    
    return { total, applied, pending, conflicts, highConfidence };
  }, [changes]);

  const toggleChangeSelection = (changeId: string) => {
    const newSelected = new Set(selectedChanges);
    if (newSelected.has(changeId)) {
      newSelected.delete(changeId);
    } else {
      newSelected.add(changeId);
    }
    setSelectedChanges(newSelected);
  };

  const selectAllChanges = () => {
    if (selectedChanges.size === filteredChanges.length) {
      setSelectedChanges(new Set());
    } else {
      setSelectedChanges(new Set(filteredChanges.map(c => c.id)));
    }
  };

  const toggleExpandChange = (changeId: string) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(changeId)) {
      newExpanded.delete(changeId);
    } else {
      newExpanded.add(changeId);
    }
    setExpandedChanges(newExpanded);
  };

  const previewChangeHandler = async (change: CodeChange) => {
    if (onPreviewChange) {
      try {
        const preview = await onPreviewChange(change);
        setPreviewChange({ ...change, preview });
      } catch (error) {
        toast.error(`Failed to preview change: ${error}`);
      }
    } else {
      setPreviewChange(change);
    }
  };

  const applyChange = async (change: CodeChange) => {
    if (!onApplyChange) return;
    
    try {
      const success = await onApplyChange(change);
      
      setChanges(prev => prev.map(c => 
        c.id === change.id 
          ? { ...c, applied: success, error: success ? undefined : 'Application failed' }
          : c
      ));
      
      if (success) {
        toast.success(`Applied change: ${change.description}`);
      } else {
        toast.error(`Failed to apply change: ${change.description}`);
      }
    } catch (error) {
      toast.error(`Error applying change: ${error}`);
      setChanges(prev => prev.map(c => 
        c.id === change.id 
          ? { ...c, error: String(error) }
          : c
      ));
    }
  };

  const applySelectedChanges = async () => {
    const changesToApply = changes.filter(c => selectedChanges.has(c.id) && !c.applied);
    
    if (changesToApply.length === 0) {
      toast.warning('No changes selected for application');
      return;
    }

    setIsApplying(true);
    
    const session: ApplySession = {
      id: Date.now().toString(),
      name: `Apply ${changesToApply.length} changes`,
      changes: changesToApply,
      status: 'running',
      progress: 0,
      createdAt: new Date()
    };
    
    setCurrentSession(session);
    
    try {
      if (onApplyAll) {
        const success = await onApplyAll(changesToApply);
        
        setChanges(prev => prev.map(c => 
          selectedChanges.has(c.id) 
            ? { ...c, applied: success }
            : c
        ));
        
        setCurrentSession(prev => prev ? {
          ...prev,
          status: success ? 'completed' : 'failed',
          progress: 100,
          appliedAt: new Date()
        } : null);
        
        if (success) {
          toast.success(`Applied ${changesToApply.length} changes successfully`);
        } else {
          toast.error('Failed to apply some changes');
        }
      } else {
        // Apply changes one by one
        for (let i = 0; i < changesToApply.length; i++) {
          if (isPaused) break;
          
          const change = changesToApply[i];
          await applyChange(change);
          
          const progress = ((i + 1) / changesToApply.length) * 100;
          setCurrentSession(prev => prev ? { ...prev, progress } : null);
          
          // Batch processing delay
          if ((i + 1) % batchSize === 0 && i < changesToApply.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        setCurrentSession(prev => prev ? {
          ...prev,
          status: 'completed',
          progress: 100,
          appliedAt: new Date()
        } : null);
      }
    } catch (error) {
      toast.error(`Error during batch application: ${error}`);
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'failed'
      } : null);
    } finally {
      setIsApplying(false);
      setIsPaused(false);
    }
  };

  const pauseApplication = () => {
    setIsPaused(true);
    setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null);
  };

  const resumeApplication = () => {
    setIsPaused(false);
    setCurrentSession(prev => prev ? { ...prev, status: 'running' } : null);
  };

  const stopApplication = () => {
    setIsApplying(false);
    setIsPaused(false);
    setCurrentSession(prev => prev ? { ...prev, status: 'failed' } : null);
  };

  const exportSession = () => {
    if (!currentSession) return;
    
    const sessionData = {
      session: currentSession,
      changes: changes
    };
    
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-changes-${currentSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'addition': return <span className="text-green-600">+</span>;
      case 'deletion': return <span className="text-red-600">-</span>;
      case 'modification': return <span className="text-blue-600">~</span>;
      case 'move': return <span className="text-purple-600">→</span>;
      case 'rename': return <span className="text-orange-600">✎</span>;
      default: return <span className="text-gray-600">?</span>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    setChanges(initialChanges);
  }, [initialChanges]);

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Code Applicator</span>
            </CardTitle>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline">{stats.total} total</Badge>
                <Badge variant="outline" className="text-green-600">{stats.applied} applied</Badge>
                <Badge variant="outline" className="text-blue-600">{stats.pending} pending</Badge>
                {stats.conflicts > 0 && (
                  <Badge variant="outline" className="text-red-600">{stats.conflicts} conflicts</Badge>
                )}
              </div>
              
              <Button onClick={exportSession} variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {currentSession && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{currentSession.name}</span>
                <span>{Math.round(currentSession.progress)}%</span>
              </div>
              <Progress value={currentSession.progress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedChanges.size === filteredChanges.length && filteredChanges.length > 0}
                  onCheckedChange={selectAllChanges}
                />
                <Label>Select All ({selectedChanges.size} selected)</Label>
              </div>
              
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Types</option>
                <option value="addition">Additions</option>
                <option value="deletion">Deletions</option>
                <option value="modification">Modifications</option>
                <option value="move">Moves</option>
                <option value="rename">Renames</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'confidence' | 'type' | 'file')}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="confidence">Sort by Confidence</option>
                <option value="type">Sort by Type</option>
                <option value="file">Sort by File</option>
              </select>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={showConflicts}
                  onCheckedChange={setShowConflicts}
                />
                <Label>Show Conflicts</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isApplying ? (
                <>
                  {isPaused ? (
                    <Button onClick={resumeApplication} size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={pauseApplication} variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button onClick={stopApplication} variant="destructive" size="sm">
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={applySelectedChanges} 
                  disabled={selectedChanges.size === 0}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Apply Selected ({selectedChanges.size})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {filteredChanges.map((change) => (
                <div key={change.id} className="border-b last:border-b-0">
                  <div className="flex items-center space-x-3 p-4 hover:bg-muted/50">
                    <Checkbox
                      checked={selectedChanges.has(change.id)}
                      onCheckedChange={() => toggleChangeSelection(change.id)}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpandChange(change.id)}
                      className="p-0 h-auto"
                    >
                      {expandedChanges.has(change.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getChangeIcon(change.type)}
                        <span className="font-medium truncate">{change.description}</span>
                        <Badge variant="outline" className={getConfidenceColor(change.confidence)}>
                          {Math.round(change.confidence * 100)}%
                        </Badge>
                        {change.applied && (
                          <Badge variant="outline" className="text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                        {change.error && (
                          <Badge variant="outline" className="text-red-600">
                            <X className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                        {change.conflicts && change.conflicts.length > 0 && (
                          <Badge variant="outline" className="text-orange-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Conflicts
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {change.filePath}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => previewChangeHandler(change)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!change.applied && (
                        <Button
                          onClick={() => applyChange(change)}
                          size="sm"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedChanges.has(change.id) && (
                    <div className="px-4 pb-4 space-y-3 bg-muted/30">
                      {change.lineStart && change.lineEnd && (
                        <div className="text-sm text-muted-foreground">
                          Lines {change.lineStart}-{change.lineEnd}
                        </div>
                      )}
                      
                      {change.dependencies && change.dependencies.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Dependencies:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {change.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {change.conflicts && change.conflicts.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-red-600">Conflicts:</Label>
                          <div className="space-y-1 mt-1">
                            {change.conflicts.map((conflict, index) => (
                              <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                {conflict}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {change.error && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          <strong>Error:</strong> {change.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Preview Change</h3>
              <Button onClick={() => setPreviewChange(null)} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 p-4">
              <DiffViewer
                originalContent={previewChange.originalContent || ''}
                modifiedContent={previewChange.newContent || previewChange.preview || ''}
                fileName={previewChange.filePath}
                language="typescript"
                onAcceptChange={() => applyChange(previewChange)}
                onRejectChange={() => setPreviewChange(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeApplicator;
export type { CodeChange, ApplySession };