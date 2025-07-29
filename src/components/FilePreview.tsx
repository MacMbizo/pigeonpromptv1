import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  Copy,
  Download,
  Eye,
  FileText,
  Code,
  Maximize2,
  Minimize2,
  Plus,
  Minus
} from 'lucide-react';

// Monaco Editor (we'll use a simple syntax highlighter for now)
interface FilePreviewProps {
  file: {
    name: string;
    handle: FileSystemFileHandle;
    path: string;
    size?: number;
  } | null;
  onSnippetSelected?: (snippet: {
    content: string;
    startLine: number;
    endLine: number;
    fileName: string;
    tokenCount: number;
  }) => void;
}

interface LineSelection {
  start: number;
  end: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onSnippetSelected }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<LineSelection | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load file content when file changes
  useEffect(() => {
    if (file) {
      loadFileContent();
    } else {
      setContent('');
      setSelection(null);
    }
  }, [file]);

  // Load file content
  const loadFileContent = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      
      // Check file size limit (10MB)
      if (file.size && file.size > 10 * 1024 * 1024) {
        toast.error('File is too large to preview (>10MB)');
        return;
      }

      const fileObj = await file.handle.getFile();
      const text = await fileObj.text();
      setContent(text);
      
    } catch (error) {
      console.error('Failed to load file content:', error);
      toast.error('Failed to load file content');
      setContent('Error loading file content');
    } finally {
      setIsLoading(false);
    }
  };

  // Get file language for syntax highlighting
  const getLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'cc': case 'cxx': return 'cpp';
      case 'c': return 'c';
      case 'cs': return 'csharp';
      case 'php': return 'php';
      case 'rb': return 'ruby';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'scss': case 'sass': return 'scss';
      case 'json': return 'json';
      case 'xml': return 'xml';
      case 'yaml': case 'yml': return 'yaml';
      case 'md': return 'markdown';
      case 'sql': return 'sql';
      case 'sh': case 'bash': return 'bash';
      case 'ps1': return 'powershell';
      case 'dockerfile': return 'dockerfile';
      case 'vue': return 'vue';
      default: return 'text';
    }
  };

  // Simple syntax highlighting (basic implementation)
  const highlightSyntax = (code: string, language: string): string => {
    if (language === 'text') return code;
    
    // Basic keyword highlighting for demonstration
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except'],
      java: ['public', 'private', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'import', 'package'],
    };
    
    let highlighted = code;
    const langKeywords = keywords[language as keyof typeof keywords] || [];
    
    // Highlight keywords
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-blue-600 font-semibold">${keyword}</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="text-green-600">$&</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');
    highlighted = highlighted.replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    
    return highlighted;
  };

  // Handle line selection
  const handleLineClick = (lineNumber: number, event: React.MouseEvent) => {
    if (event.shiftKey && selection) {
      // Extend selection
      const start = Math.min(selection.start, lineNumber);
      const end = Math.max(selection.end, lineNumber);
      setSelection({ start, end });
    } else {
      // Start new selection
      setSelection({ start: lineNumber, end: lineNumber });
    }
  };

  // Get selected content
  const getSelectedContent = (): string => {
    if (!selection || !content) return '';
    
    const lines = content.split('\n');
    return lines.slice(selection.start - 1, selection.end).join('\n');
  };

  // Estimate token count
  const estimateTokens = (text: string): number => {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  };

  // Add snippet to context
  const addSnippetToContext = () => {
    if (!selection || !file) return;
    
    const selectedContent = getSelectedContent();
    const tokenCount = estimateTokens(selectedContent);
    
    onSnippetSelected?.({
      content: selectedContent,
      startLine: selection.start,
      endLine: selection.end,
      fileName: file.name,
      tokenCount
    });
    
    toast.success(`Added ${tokenCount} tokens to context`);
  };

  // Copy selected content
  const copySelectedContent = async () => {
    const selectedContent = getSelectedContent();
    if (!selectedContent) return;
    
    try {
      await navigator.clipboard.writeText(selectedContent);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Download file
  const downloadFile = () => {
    if (!file || !content) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render line numbers and content
  const renderContent = () => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const language = file ? getLanguage(file.name) : 'text';
    
    return (
      <div className="flex font-mono text-sm">
        {/* Line Numbers */}
        {lineNumbers && (
          <div className="select-none border-r border-border pr-4 mr-4 text-muted-foreground">
            {lines.map((_, index) => {
              const lineNumber = index + 1;
              const isSelected = selection && lineNumber >= selection.start && lineNumber <= selection.end;
              
              return (
                <div
                  key={lineNumber}
                  className={`text-right cursor-pointer hover:bg-muted px-2 ${
                    isSelected ? 'bg-primary/20' : ''
                  }`}
                  onClick={(e) => handleLineClick(lineNumber, e)}
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                >
                  {lineNumber}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-x-auto">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isSelected = selection && lineNumber >= selection.start && lineNumber <= selection.end;
            const highlightedLine = highlightSyntax(line || ' ', language);
            
            return (
              <div
                key={lineNumber}
                className={`cursor-pointer hover:bg-muted px-2 ${
                  isSelected ? 'bg-primary/20' : ''
                }`}
                onClick={(e) => handleLineClick(lineNumber, e)}
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
                dangerouslySetInnerHTML={{ __html: highlightedLine }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (!file) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a file to preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{file.name}</span>
            <Badge variant="outline" className="text-xs">
              {getLanguage(file.name)}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs px-2">{fontSize}px</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Line Numbers Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLineNumbers(!lineNumbers)}
            >
              <Code className="h-4 w-4" />
            </Button>
            
            {/* Download */}
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadFile}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Selection Info */}
        {selection && (
          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">
                Lines {selection.start}-{selection.end} selected
              </span>
              <span className="text-muted-foreground ml-2">
                ({estimateTokens(getSelectedContent())} tokens)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copySelectedContent}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                onClick={addSnippetToContext}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add to Context
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading file content...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className={isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'}>
            <div ref={previewRef} className="min-h-full">
              {renderContent()}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FilePreview;