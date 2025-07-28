import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Save,
  Copy,
  Download,
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  GitBranch,
  History,
  Settings2
} from "lucide-react";
import { toast } from "sonner";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSave: () => void;
  isRunning: boolean;
  promptName: string;
  onPromptNameChange: (name: string) => void;
}

interface LintIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  suggestion?: string;
}

export default function PromptEditor({
  value,
  onChange,
  onRun,
  onSave,
  isRunning,
  promptName,
  onPromptNameChange
}: PromptEditorProps) {
  const [lintIssues, setLintIssues] = useState<LintIssue[]>([]);
  const [showLinter, setShowLinter] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // AI-powered linting
  useEffect(() => {
    const lintPrompt = () => {
      const issues: LintIssue[] = [];
      const lines = value.split('\n');

      lines.forEach((line, index) => {
        // Check for potential bias
        const biasWords = ['he', 'she', 'guys', 'mankind'];
        biasWords.forEach(word => {
          if (line.toLowerCase().includes(word)) {
            issues.push({
              type: 'warning',
              message: `Potential bias detected: "${word}". Consider using inclusive language.`,
              line: index + 1,
              suggestion: 'Use gender-neutral alternatives like "they", "people", "humanity"'
            });
          }
        });

        // Check for unclear instructions
        if (line.includes('do something') || line.includes('handle this')) {
          issues.push({
            type: 'error',
            message: 'Vague instruction detected. Be more specific.',
            line: index + 1,
            suggestion: 'Provide clear, actionable instructions'
          });
        }

        // Check for missing context
        if (line.includes('{{') && !line.includes('}}')) {
          issues.push({
            type: 'error',
            message: 'Unclosed variable syntax',
            line: index + 1,
            suggestion: 'Ensure all variables use {{variable}} syntax'
          });
        }

        // Check for prompt injection vulnerabilities
        if (line.includes('ignore previous') || line.includes('forget everything')) {
          issues.push({
            type: 'warning',
            message: 'Potential prompt injection pattern detected',
            line: index + 1,
            suggestion: 'Review for security implications'
          });
        }
      });

      // Check overall prompt structure
      if (value.length < 10) {
        issues.push({
          type: 'info',
          message: 'Prompt seems too short. Consider adding more context.',
          line: 1,
          suggestion: 'Provide clear role, context, and instructions'
        });
      }

      if (value.length > 2000) {
        issues.push({
          type: 'warning',
          message: 'Prompt is very long. Consider breaking it down.',
          line: 1,
          suggestion: 'Long prompts may reduce model performance'
        });
      }

      setLintIssues(issues);
    };

    const debounceTimer = setTimeout(lintPrompt, 500);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Update cursor position
    const textarea = e.target;
    const lines = textarea.value.substring(0, textarea.selectionStart).split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'info': return <Info className="h-3 w-3 text-blue-500" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const applySuggestion = (issue: LintIssue) => {
    if (issue.suggestion) {
      toast.info(`Suggestion: ${issue.suggestion}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col border-r border-border">
      {/* Enhanced Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold">Prompt IDE</h1>
            <input
              type="text"
              value={promptName}
              onChange={(e) => onPromptNameChange(e.target.value)}
              className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:bg-muted px-2 py-1 rounded"
              placeholder="Untitled Prompt"
            />
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <GitBranch className="h-3 w-3" />
              <span>main</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={onRun} 
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor with Syntax Highlighting */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4">
          <div className="h-full relative">
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={value}
              onChange={handleTextareaChange}
              placeholder="Enter your prompt here... Use {{variable}} syntax for dynamic content."
              className="w-full h-[calc(100%-2rem)] p-4 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                lineHeight: '1.5',
                tabSize: 2
              }}
            />
            
            {/* Status Bar */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Ln {cursorPosition.line}, Col {cursorPosition.column} | {value.length} chars
            </div>
          </div>
        </div>

        {/* AI Linter Panel */}
        {showLinter && (
          <div className="w-80 border-l border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-500" />
                  AI Linter
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLinter(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {lintIssues.length === 0 ? (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  No issues found
                </div>
              ) : (
                lintIssues.map((issue, index) => (
                  <Card key={index} className="text-xs">
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="font-medium">Line {issue.line}</div>
                          <div className="text-muted-foreground mt-1">{issue.message}</div>
                          {issue.suggestion && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 mt-1 text-xs"
                              onClick={() => applySuggestion(issue)}
                            >
                              View suggestion
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show linter button when hidden */}
      {!showLinter && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-20 right-4 z-10"
          onClick={() => setShowLinter(true)}
        >
          <Zap className="h-4 w-4 mr-2" />
          Show Linter
        </Button>
      )}
    </div>
  );
}