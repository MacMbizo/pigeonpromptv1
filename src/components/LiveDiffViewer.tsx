import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import {
  GitCompare,
  Copy,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  Check,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Types for diff viewer
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
  highlight?: boolean;
}

interface DiffChunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

interface DiffFile {
  oldPath: string;
  newPath: string;
  chunks: DiffChunk[];
  additions: number;
  deletions: number;
  binary?: boolean;
}

interface LiveDiffViewerProps {
  originalContent: string;
  modifiedContent: string;
  fileName?: string;
  language?: string;
  onAcceptChanges?: () => void;
  onRejectChanges?: () => void;
  showLineNumbers?: boolean;
  splitView?: boolean;
}

const LiveDiffViewer: React.FC<LiveDiffViewerProps> = ({
  originalContent,
  modifiedContent,
  fileName = 'file.txt',
  language = 'text',
  onAcceptChanges,
  onRejectChanges,
  showLineNumbers = true,
  splitView = false
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>(
    splitView ? 'split' : 'unified'
  );
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());

  // Generate diff from original and modified content
  const diffData = useMemo(() => {
    return generateDiff(originalContent, modifiedContent);
  }, [originalContent, modifiedContent]);

  // Simple diff algorithm (Myers algorithm simplified)
  function generateDiff(oldText: string, newText: string): DiffFile {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    const diff = computeDiff(oldLines, newLines);
    const chunks = groupIntoChunks(diff);
    
    const additions = chunks.reduce((sum, chunk) => 
      sum + chunk.lines.filter(line => line.type === 'added').length, 0
    );
    
    const deletions = chunks.reduce((sum, chunk) => 
      sum + chunk.lines.filter(line => line.type === 'removed').length, 0
    );
    
    return {
      oldPath: fileName,
      newPath: fileName,
      chunks,
      additions,
      deletions
    };
  }

  // Compute line-by-line diff
  function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
    const result: DiffLine[] = [];
    let oldIndex = 0;
    let newIndex = 0;
    
    // Simple LCS-based diff (simplified for demo)
    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      if (oldIndex >= oldLines.length) {
        // Only new lines remaining
        result.push({
          type: 'added',
          newLineNumber: newIndex + 1,
          content: newLines[newIndex]
        });
        newIndex++;
      } else if (newIndex >= newLines.length) {
        // Only old lines remaining
        result.push({
          type: 'removed',
          oldLineNumber: oldIndex + 1,
          content: oldLines[oldIndex]
        });
        oldIndex++;
      } else if (oldLines[oldIndex] === newLines[newIndex]) {
        // Lines are the same
        result.push({
          type: 'unchanged',
          oldLineNumber: oldIndex + 1,
          newLineNumber: newIndex + 1,
          content: oldLines[oldIndex]
        });
        oldIndex++;
        newIndex++;
      } else {
        // Lines are different - check if it's a modification or add/remove
        const similarity = calculateSimilarity(oldLines[oldIndex], newLines[newIndex]);
        
        if (similarity > 0.5) {
          // Consider it a modification
          result.push({
            type: 'removed',
            oldLineNumber: oldIndex + 1,
            content: oldLines[oldIndex]
          });
          result.push({
            type: 'added',
            newLineNumber: newIndex + 1,
            content: newLines[newIndex]
          });
          oldIndex++;
          newIndex++;
        } else {
          // Look ahead to see if we can find a match
          let foundMatch = false;
          
          // Check next few lines for a match
          for (let i = 1; i <= Math.min(3, newLines.length - newIndex); i++) {
            if (oldLines[oldIndex] === newLines[newIndex + i]) {
              // Found a match, add the intermediate lines as additions
              for (let j = 0; j < i; j++) {
                result.push({
                  type: 'added',
                  newLineNumber: newIndex + j + 1,
                  content: newLines[newIndex + j]
                });
              }
              newIndex += i;
              foundMatch = true;
              break;
            }
          }
          
          if (!foundMatch) {
            // Check if old line appears later in new lines
            for (let i = 1; i <= Math.min(3, oldLines.length - oldIndex); i++) {
              if (newLines[newIndex] === oldLines[oldIndex + i]) {
                // Found a match, add the intermediate lines as deletions
                for (let j = 0; j < i; j++) {
                  result.push({
                    type: 'removed',
                    oldLineNumber: oldIndex + j + 1,
                    content: oldLines[oldIndex + j]
                  });
                }
                oldIndex += i;
                foundMatch = true;
                break;
              }
            }
          }
          
          if (!foundMatch) {
            // No match found, treat as removal and addition
            result.push({
              type: 'removed',
              oldLineNumber: oldIndex + 1,
              content: oldLines[oldIndex]
            });
            result.push({
              type: 'added',
              newLineNumber: newIndex + 1,
              content: newLines[newIndex]
            });
            oldIndex++;
            newIndex++;
          }
        }
      }
    }
    
    return result;
  }

  // Calculate similarity between two strings
  function calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // Levenshtein distance calculation
  function levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Group diff lines into chunks
  function groupIntoChunks(diffLines: DiffLine[]): DiffChunk[] {
    const chunks: DiffChunk[] = [];
    let currentChunk: DiffLine[] = [];
    let unchangedCount = 0;
    
    for (const line of diffLines) {
      if (line.type === 'unchanged') {
        unchangedCount++;
        
        if (unchangedCount <= 3 || currentChunk.length === 0) {
          currentChunk.push(line);
        } else {
          // Start a new chunk if we have too many unchanged lines
          if (currentChunk.length > 0) {
            chunks.push(createChunk(currentChunk));
            currentChunk = [line];
          }
        }
      } else {
        unchangedCount = 0;
        currentChunk.push(line);
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(createChunk(currentChunk));
    }
    
    return chunks;
  }

  // Create a chunk from lines
  function createChunk(lines: DiffLine[]): DiffChunk {
    const oldLines = lines.filter(l => l.oldLineNumber !== undefined);
    const newLines = lines.filter(l => l.newLineNumber !== undefined);
    
    const oldStart = oldLines.length > 0 ? Math.min(...oldLines.map(l => l.oldLineNumber!)) : 0;
    const newStart = newLines.length > 0 ? Math.min(...newLines.map(l => l.newLineNumber!)) : 0;
    
    return {
      oldStart,
      oldLines: oldLines.length,
      newStart,
      newLines: newLines.length,
      lines
    };
  }

  // Get line background color
  const getLineBackground = (line: DiffLine): string => {
    switch (line.type) {
      case 'added':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'modified':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-background';
    }
  };

  // Get line text color
  const getLineTextColor = (line: DiffLine): string => {
    switch (line.type) {
      case 'added':
        return 'text-green-800';
      case 'removed':
        return 'text-red-800';
      case 'modified':
        return 'text-yellow-800';
      default:
        return 'text-foreground';
    }
  };

  // Get line prefix
  const getLinePrefix = (line: DiffLine): string => {
    switch (line.type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      default:
        return ' ';
    }
  };

  // Toggle chunk expansion
  const toggleChunk = (chunkIndex: number) => {
    const newExpanded = new Set(expandedChunks);
    if (newExpanded.has(chunkIndex)) {
      newExpanded.delete(chunkIndex);
    } else {
      newExpanded.add(chunkIndex);
    }
    setExpandedChunks(newExpanded);
  };

  // Copy diff to clipboard
  const copyDiff = async () => {
    const diffText = diffData.chunks
      .map(chunk => 
        chunk.lines
          .map(line => `${getLinePrefix(line)}${line.content}`)
          .join('\n')
      )
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(diffText);
      toast.success('Diff copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy diff');
    }
  };

  // Download diff as patch file
  const downloadDiff = () => {
    const diffText = `--- a/${diffData.oldPath}\n+++ b/${diffData.newPath}\n` +
      diffData.chunks
        .map(chunk => {
          const header = `@@ -${chunk.oldStart},${chunk.oldLines} +${chunk.newStart},${chunk.newLines} @@\n`;
          const lines = chunk.lines
            .map(line => `${getLinePrefix(line)}${line.content}`)
            .join('\n');
          return header + lines;
        })
        .join('\n');
    
    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.patch`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render unified view
  const renderUnifiedView = () => {
    return (
      <div className="font-mono text-sm">
        {diffData.chunks.map((chunk, chunkIndex) => {
          const isExpanded = expandedChunks.has(chunkIndex);
          const hasChanges = chunk.lines.some(line => line.type !== 'unchanged');
          
          if (!hasChanges && !isExpanded) {
            return (
              <div key={chunkIndex} className="flex items-center justify-center py-2 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleChunk(chunkIndex)}
                  className="text-xs"
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show {chunk.lines.length} unchanged lines
                </Button>
              </div>
            );
          }
          
          return (
            <div key={chunkIndex} className="border-b border-border">
              {!hasChanges && (
                <div className="flex items-center justify-center py-1 bg-muted">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChunk(chunkIndex)}
                    className="text-xs"
                  >
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide unchanged lines
                  </Button>
                </div>
              )}
              
              {chunk.lines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`flex hover:bg-muted/50 ${getLineBackground(line)}`}
                >
                  {showLineNumbers && (
                    <div className="flex select-none text-muted-foreground text-xs">
                      <div className="w-12 text-right pr-2 border-r border-border">
                        {line.oldLineNumber || ''}
                      </div>
                      <div className="w-12 text-right pr-2 border-r border-border">
                        {line.newLineNumber || ''}
                      </div>
                    </div>
                  )}
                  
                  <div className="w-4 text-center text-muted-foreground select-none">
                    {getLinePrefix(line)}
                  </div>
                  
                  <div className={`flex-1 px-2 py-1 ${getLineTextColor(line)}`}>
                    {showWhitespace 
                      ? line.content.replace(/ /g, '·').replace(/\t/g, '→')
                      : line.content
                    }
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // Render split view
  const renderSplitView = () => {
    return (
      <div className="grid grid-cols-2 gap-4 font-mono text-sm">
        {/* Original */}
        <div className="border-r border-border">
          <div className="bg-muted px-3 py-2 text-sm font-medium">
            Original ({diffData.oldPath})
          </div>
          <div>
            {originalContent.split('\n').map((line, index) => (
              <div key={index} className="flex hover:bg-muted/50">
                {showLineNumbers && (
                  <div className="w-12 text-right pr-2 border-r border-border text-muted-foreground text-xs select-none">
                    {index + 1}
                  </div>
                )}
                <div className="flex-1 px-2 py-1">
                  {showWhitespace 
                    ? line.replace(/ /g, '·').replace(/\t/g, '→')
                    : line
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Modified */}
        <div>
          <div className="bg-muted px-3 py-2 text-sm font-medium">
            Modified ({diffData.newPath})
          </div>
          <div>
            {modifiedContent.split('\n').map((line, index) => (
              <div key={index} className="flex hover:bg-muted/50">
                {showLineNumbers && (
                  <div className="w-12 text-right pr-2 border-r border-border text-muted-foreground text-xs select-none">
                    {index + 1}
                  </div>
                )}
                <div className="flex-1 px-2 py-1">
                  {showWhitespace 
                    ? line.replace(/ /g, '·').replace(/\t/g, '→')
                    : line
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <GitCompare className="h-4 w-4" />
            <span>{fileName}</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs text-green-600">
                +{diffData.additions}
              </Badge>
              <Badge variant="outline" className="text-xs text-red-600">
                -{diffData.deletions}
              </Badge>
            </div>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border rounded">
              <Button
                variant={viewMode === 'unified' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('unified')}
                className="rounded-r-none"
              >
                Unified
              </Button>
              <Button
                variant={viewMode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('split')}
                className="rounded-l-none"
              >
                Split
              </Button>
            </div>
            
            {/* Options */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWhitespace(!showWhitespace)}
              title="Toggle whitespace"
            >
              {showWhitespace ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyDiff}
              title="Copy diff"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadDiff}
              title="Download patch"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        {(onAcceptChanges || onRejectChanges) && (
          <div className="flex items-center space-x-2 pt-3">
            {onAcceptChanges && (
              <Button size="sm" onClick={onAcceptChanges}>
                <Check className="h-3 w-3 mr-1" />
                Accept Changes
              </Button>
            )}
            {onRejectChanges && (
              <Button variant="outline" size="sm" onClick={onRejectChanges}>
                <X className="h-3 w-3 mr-1" />
                Reject Changes
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className={isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'}>
          {viewMode === 'unified' ? renderUnifiedView() : renderSplitView()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveDiffViewer;