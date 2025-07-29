import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  GitCompare,
  Copy,
  Download,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Split,
  Maximize2
} from 'lucide-react';
import { diffLines, diffWords, diffChars, Change } from 'diff';

interface DiffViewerProps {
  originalContent: string;
  modifiedContent: string;
  fileName?: string;
  language?: string;
  onAcceptChange?: (change: Change, index: number) => void;
  onRejectChange?: (change: Change, index: number) => void;
  onApplyAll?: () => void;
  showLineNumbers?: boolean;
  viewMode?: 'side-by-side' | 'unified' | 'split';
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  content: string;
  lineNumber?: number;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  originalContent,
  modifiedContent,
  fileName = 'file.txt',
  language = 'text',
  onAcceptChange,
  onRejectChange,
  onApplyAll,
  showLineNumbers = true,
  viewMode = 'side-by-side'
}) => {
  const [diffMode, setDiffMode] = useState<'lines' | 'words' | 'chars'>('lines');
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(new Set());
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  // Generate diff based on mode
  const diff = useMemo(() => {
    switch (diffMode) {
      case 'words':
        return diffWords(originalContent, modifiedContent);
      case 'chars':
        return diffChars(originalContent, modifiedContent);
      default:
        return diffLines(originalContent, modifiedContent);
    }
  }, [originalContent, modifiedContent, diffMode, showWhitespace]);

  // Process diff into structured lines
  const processedDiff = useMemo(() => {
    const lines: DiffLine[] = [];
    let originalLineNum = 1;
    let modifiedLineNum = 1;

    diff.forEach((change, index) => {
      const content = change.value;
      const contentLines = content.split('\n');
      
      if (change.added) {
        contentLines.forEach((line, lineIndex) => {
          if (lineIndex < contentLines.length - 1 || line.length > 0) {
            lines.push({
              type: 'added',
              content: line,
              modifiedLineNumber: modifiedLineNum++,
              lineNumber: index
            });
          }
        });
      } else if (change.removed) {
        contentLines.forEach((line, lineIndex) => {
          if (lineIndex < contentLines.length - 1 || line.length > 0) {
            lines.push({
              type: 'removed',
              content: line,
              originalLineNumber: originalLineNum++,
              lineNumber: index
            });
          }
        });
      } else {
        contentLines.forEach((line, lineIndex) => {
          if (lineIndex < contentLines.length - 1 || line.length > 0) {
            lines.push({
              type: 'unchanged',
              content: line,
              originalLineNumber: originalLineNum++,
              modifiedLineNumber: modifiedLineNum++,
              lineNumber: index
            });
          }
        });
      }
    });

    return lines;
  }, [diff]);

  // Group consecutive unchanged lines for collapsing
  const groupedLines = useMemo(() => {
    const groups: Array<{ type: 'change' | 'unchanged'; lines: DiffLine[]; startIndex: number }> = [];
    let currentGroup: DiffLine[] = [];
    let currentType: 'change' | 'unchanged' | null = null;
    let startIndex = 0;

    processedDiff.forEach((line, index) => {
      const lineType = line.type === 'unchanged' ? 'unchanged' : 'change';
      
      if (lineType !== currentType) {
        if (currentGroup.length > 0) {
          groups.push({ type: currentType!, lines: currentGroup, startIndex });
        }
        currentGroup = [line];
        currentType = lineType;
        startIndex = index;
      } else {
        currentGroup.push(line);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ type: currentType!, lines: currentGroup, startIndex });
    }

    return groups;
  }, [processedDiff]);

  const getLanguageClass = (lang: string) => {
    const langMap: Record<string, string> = {
      javascript: 'language-javascript',
      typescript: 'language-typescript',
      python: 'language-python',
      css: 'language-css',
      html: 'language-html',
      json: 'language-json',
      markdown: 'language-markdown'
    };
    return langMap[lang] || 'language-text';
  };

  const toggleSection = (index: number) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedSections(newCollapsed);
  };

  const toggleChangeSelection = (index: number) => {
    const newSelected = new Set(selectedChanges);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedChanges(newSelected);
  };

  const acceptChange = (change: Change, index: number) => {
    if (onAcceptChange) {
      onAcceptChange(change, index);
    }
    setSelectedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const rejectChange = (change: Change, index: number) => {
    if (onRejectChange) {
      onRejectChange(change, index);
    }
    setSelectedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const copyDiff = () => {
    const diffText = diff.map(change => {
      const prefix = change.added ? '+' : change.removed ? '-' : ' ';
      return change.value.split('\n').map(line => `${prefix} ${line}`).join('\n');
    }).join('\n');
    
    navigator.clipboard.writeText(diffText);
  };

  const downloadDiff = () => {
    const diffText = diff.map(change => {
      const prefix = change.added ? '+' : change.removed ? '-' : ' ';
      return change.value.split('\n').map(line => `${prefix} ${line}`).join('\n');
    }).join('\n');
    
    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.diff`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const added = diff.filter(change => change.added).reduce((acc, change) => acc + change.value.split('\n').length - 1, 0);
    const removed = diff.filter(change => change.removed).reduce((acc, change) => acc + change.value.split('\n').length - 1, 0);
    const unchanged = diff.filter(change => !change.added && !change.removed).reduce((acc, change) => acc + change.value.split('\n').length - 1, 0);
    
    return { added, removed, unchanged, total: added + removed + unchanged };
  }, [diff]);

  const renderSideBySide = () => {
    const originalLines = originalContent.split('\n');
    const modifiedLines = modifiedContent.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Original */}
        <div className="border rounded-lg">
          <div className="bg-muted px-3 py-2 border-b">
            <span className="text-sm font-medium">Original</span>
          </div>
          <ScrollArea className="h-96">
            <div className="font-mono text-sm">
              {originalLines.map((line, index) => (
                <div key={index} className="flex hover:bg-muted/50">
                  {showLineNumbers && (
                    <div className="w-12 px-2 py-1 text-muted-foreground text-right border-r">
                      {index + 1}
                    </div>
                  )}
                  <div className="flex-1 px-3 py-1">
                    <code className={getLanguageClass(language)}>{line || ' '}</code>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Modified */}
        <div className="border rounded-lg">
          <div className="bg-muted px-3 py-2 border-b">
            <span className="text-sm font-medium">Modified</span>
          </div>
          <ScrollArea className="h-96">
            <div className="font-mono text-sm">
              {modifiedLines.map((line, index) => (
                <div key={index} className="flex hover:bg-muted/50">
                  {showLineNumbers && (
                    <div className="w-12 px-2 py-1 text-muted-foreground text-right border-r">
                      {index + 1}
                    </div>
                  )}
                  <div className="flex-1 px-3 py-1">
                    <code className={getLanguageClass(language)}>{line || ' '}</code>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  const renderUnified = () => {
    return (
      <div className="border rounded-lg">
        <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
          <span className="text-sm font-medium">Unified Diff</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              +{stats.added}
            </Badge>
            <Badge variant="outline" className="text-red-600">
              -{stats.removed}
            </Badge>
          </div>
        </div>
        <ScrollArea className="h-96">
          <div className="font-mono text-sm">
            {groupedLines.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.type === 'unchanged' && group.lines.length > 6 ? (
                  <div>
                    {/* Show first 3 lines */}
                    {group.lines.slice(0, 3).map((line, lineIndex) => (
                      <div key={`${groupIndex}-${lineIndex}`} className="flex hover:bg-muted/50">
                        {showLineNumbers && (
                          <div className="w-16 px-2 py-1 text-muted-foreground text-right border-r">
                            {line.originalLineNumber}
                          </div>
                        )}
                        <div className="flex-1 px-3 py-1">
                          <code className={getLanguageClass(language)}>{line.content || ' '}</code>
                        </div>
                      </div>
                    ))}
                    
                    {/* Collapsible section */}
                    <div className="border-y bg-muted/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(groupIndex)}
                        className="w-full justify-start text-muted-foreground"
                      >
                        {collapsedSections.has(groupIndex) ? (
                          <ChevronRight className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {collapsedSections.has(groupIndex)
                          ? `Show ${group.lines.length - 6} unchanged lines`
                          : `Hide ${group.lines.length - 6} unchanged lines`
                        }
                      </Button>
                    </div>
                    
                    {/* Show middle lines if expanded */}
                    {!collapsedSections.has(groupIndex) &&
                      group.lines.slice(3, -3).map((line, lineIndex) => (
                        <div key={`${groupIndex}-mid-${lineIndex}`} className="flex hover:bg-muted/50">
                          {showLineNumbers && (
                            <div className="w-16 px-2 py-1 text-muted-foreground text-right border-r">
                              {line.originalLineNumber}
                            </div>
                          )}
                          <div className="flex-1 px-3 py-1">
                            <code className={getLanguageClass(language)}>{line.content || ' '}</code>
                          </div>
                        </div>
                      ))
                    }
                    
                    {/* Show last 3 lines */}
                    {group.lines.slice(-3).map((line, lineIndex) => (
                      <div key={`${groupIndex}-end-${lineIndex}`} className="flex hover:bg-muted/50">
                        {showLineNumbers && (
                          <div className="w-16 px-2 py-1 text-muted-foreground text-right border-r">
                            {line.originalLineNumber}
                          </div>
                        )}
                        <div className="flex-1 px-3 py-1">
                          <code className={getLanguageClass(language)}>{line.content || ' '}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show all lines for small unchanged sections or change sections
                  group.lines.map((line, lineIndex) => {
                    const isChange = line.type !== 'unchanged';
                    const bgColor = line.type === 'added' 
                      ? 'bg-green-50 border-l-4 border-green-500' 
                      : line.type === 'removed' 
                      ? 'bg-red-50 border-l-4 border-red-500' 
                      : '';
                    
                    return (
                      <div key={`${groupIndex}-${lineIndex}`} className={`flex hover:bg-muted/50 ${bgColor}`}>
                        {showLineNumbers && (
                          <div className="w-16 px-2 py-1 text-muted-foreground text-right border-r">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                            {line.originalLineNumber || line.modifiedLineNumber}
                          </div>
                        )}
                        <div className="flex-1 px-3 py-1 flex items-center justify-between group">
                          <code className={getLanguageClass(language)}>{line.content || ' '}</code>
                          {isChange && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => acceptChange(diff[line.lineNumber!], line.lineNumber!)}
                                className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => rejectChange(diff[line.lineNumber!], line.lineNumber!)}
                                className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GitCompare className="h-5 w-5" />
            <span>Diff Viewer</span>
            <Badge variant="outline">{fileName}</Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={diffMode} onValueChange={(value: 'lines' | 'words' | 'chars') => setDiffMode(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="chars">Chars</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={currentViewMode} onValueChange={(value: 'side-by-side' | 'unified') => setCurrentViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-by-side">Side by Side</SelectItem>
                <SelectItem value="unified">Unified</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => setShowWhitespace(!showWhitespace)}
              variant={showWhitespace ? "default" : "outline"}
              size="sm"
            >
              {showWhitespace ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            
            <Button onClick={copyDiff} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button onClick={downloadDiff} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            
            {onApplyAll && (
              <Button onClick={onApplyAll} size="sm">
                Apply All
              </Button>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>+{stats.added} additions</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>-{stats.removed} deletions</span>
          </span>
          <span>{stats.total} total lines</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentViewMode === 'side-by-side' ? renderSideBySide() : renderUnified()}
      </CardContent>
    </Card>
  );
};

export default DiffViewer;
export type { DiffLine };