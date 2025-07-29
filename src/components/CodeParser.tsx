import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  Code2,
  FileText,
  GitBranch,
  Layers,
  Search,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ASTNode {
  type: string;
  name?: string;
  line?: number;
  column?: number;
  children?: ASTNode[];
  metadata?: Record<string, any>;
}

interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  functions: number;
  classes: number;
  imports: number;
  exports: number;
}

interface Dependency {
  name: string;
  type: 'import' | 'require' | 'dynamic';
  source: string;
  line: number;
}

interface CodeParserProps {
  fileContent: string;
  fileName: string;
  language: string;
  onAnalysisComplete?: (analysis: any) => void;
}

const CodeParser: React.FC<CodeParserProps> = ({
  fileContent,
  fileName,
  language,
  onAnalysisComplete
}) => {
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Language-specific parsers
  const parseJavaScript = (content: string): { ast: ASTNode; metrics: CodeMetrics; dependencies: Dependency[] } => {
    const lines = content.split('\n');
    const ast: ASTNode = {
      type: 'Program',
      children: []
    };
    
    const metrics: CodeMetrics = {
      linesOfCode: lines.filter(line => line.trim() && !line.trim().startsWith('//')).length,
      complexity: 1,
      functions: 0,
      classes: 0,
      imports: 0,
      exports: 0
    };
    
    const dependencies: Dependency[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse imports
      if (trimmed.startsWith('import ')) {
        metrics.imports++;
        const match = trimmed.match(/from ['"]([^'"]+)['"]/); 
        if (match) {
          dependencies.push({
            name: match[1],
            type: 'import',
            source: trimmed,
            line: index + 1
          });
        }
      }
      
      // Parse exports
      if (trimmed.startsWith('export ')) {
        metrics.exports++;
      }
      
      // Parse functions
      if (trimmed.includes('function ') || trimmed.includes('=> ')) {
        metrics.functions++;
        const funcMatch = trimmed.match(/(?:function\s+)?(\w+)\s*\(/); 
        if (funcMatch) {
          ast.children?.push({
            type: 'FunctionDeclaration',
            name: funcMatch[1],
            line: index + 1
          });
        }
      }
      
      // Parse classes
      if (trimmed.startsWith('class ')) {
        metrics.classes++;
        const classMatch = trimmed.match(/class\s+(\w+)/);
        if (classMatch) {
          ast.children?.push({
            type: 'ClassDeclaration',
            name: classMatch[1],
            line: index + 1
          });
        }
      }
      
      // Calculate complexity (simplified)
      if (trimmed.includes('if ') || trimmed.includes('for ') || trimmed.includes('while ') || 
          trimmed.includes('switch ') || trimmed.includes('catch ')) {
        metrics.complexity++;
      }
    });
    
    return { ast, metrics, dependencies };
  };
  
  const parsePython = (content: string): { ast: ASTNode; metrics: CodeMetrics; dependencies: Dependency[] } => {
    const lines = content.split('\n');
    const ast: ASTNode = {
      type: 'Module',
      children: []
    };
    
    const metrics: CodeMetrics = {
      linesOfCode: lines.filter(line => line.trim() && !line.trim().startsWith('#')).length,
      complexity: 1,
      functions: 0,
      classes: 0,
      imports: 0,
      exports: 0
    };
    
    const dependencies: Dependency[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse imports
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        metrics.imports++;
        const match = trimmed.match(/(?:import|from)\s+(\w+)/);
        if (match) {
          dependencies.push({
            name: match[1],
            type: 'import',
            source: trimmed,
            line: index + 1
          });
        }
      }
      
      // Parse functions
      if (trimmed.startsWith('def ')) {
        metrics.functions++;
        const funcMatch = trimmed.match(/def\s+(\w+)\s*\(/);
        if (funcMatch) {
          ast.children?.push({
            type: 'FunctionDef',
            name: funcMatch[1],
            line: index + 1
          });
        }
      }
      
      // Parse classes
      if (trimmed.startsWith('class ')) {
        metrics.classes++;
        const classMatch = trimmed.match(/class\s+(\w+)/);
        if (classMatch) {
          ast.children?.push({
            type: 'ClassDef',
            name: classMatch[1],
            line: index + 1
          });
        }
      }
      
      // Calculate complexity
      if (trimmed.startsWith('if ') || trimmed.startsWith('for ') || trimmed.startsWith('while ') || 
          trimmed.startsWith('try:') || trimmed.startsWith('except ')) {
        metrics.complexity++;
      }
    });
    
    return { ast, metrics, dependencies };
  };
  
  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    try {
      let result;
      
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
        case 'jsx':
        case 'tsx':
          result = parseJavaScript(fileContent);
          break;
        case 'python':
          result = parsePython(fileContent);
          break;
        default:
          // Generic parser for unknown languages
          result = {
            ast: { type: 'Unknown', children: [] },
            metrics: {
              linesOfCode: fileContent.split('\n').length,
              complexity: 1,
              functions: 0,
              classes: 0,
              imports: 0,
              exports: 0
            },
            dependencies: []
          };
      }
      
      setAst(result.ast);
      setMetrics(result.metrics);
      setDependencies(result.dependencies);
      
      if (onAnalysisComplete) {
        onAnalysisComplete({
          ast: result.ast,
          metrics: result.metrics,
          dependencies: result.dependencies,
          fileName,
          language
        });
      }
    } catch (error) {
      console.error('Code analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  useEffect(() => {
    if (fileContent) {
      analyzeCode();
    }
  }, [fileContent, language]);
  
  const renderASTNode = (node: ASTNode, depth = 0) => {
    const indent = depth * 20;
    
    return (
      <div key={`${node.type}-${node.name}-${depth}`} className="mb-2">
        <div 
          className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
          style={{ marginLeft: `${indent}px` }}
        >
          <Code2 className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{node.type}</span>
          {node.name && (
            <Badge variant="outline" className="text-xs">
              {node.name}
            </Badge>
          )}
          {node.line && (
            <span className="text-xs text-muted-foreground">Line {node.line}</span>
          )}
        </div>
        {node.children && node.children.map(child => renderASTNode(child, depth + 1))}
      </div>
    );
  };
  
  const getComplexityColor = (complexity: number) => {
    if (complexity <= 5) return 'text-green-500';
    if (complexity <= 10) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getComplexityIcon = (complexity: number) => {
    if (complexity <= 5) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (complexity <= 10) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Code2 className="h-5 w-5" />
            <span>Code Analysis</span>
          </CardTitle>
          <Button 
            onClick={analyzeCode} 
            disabled={isAnalyzing}
            size="sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {fileName} ({language})
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            {metrics && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Lines of Code</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{metrics.linesOfCode}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      {getComplexityIcon(metrics.complexity)}
                      <span className="text-sm font-medium">Complexity</span>
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${getComplexityColor(metrics.complexity)}`}>
                      {metrics.complexity}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Functions</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{metrics.functions}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Classes</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">{metrics.classes}</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="structure" className="mt-4">
            <ScrollArea className="h-96">
              {ast ? (
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Code2 className="h-4 w-4" />
                    <span>Abstract Syntax Tree</span>
                  </h4>
                  {renderASTNode(ast)}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No structure analysis available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="dependencies" className="mt-4">
            <ScrollArea className="h-96">
              {dependencies.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Dependencies ({dependencies.length})</span>
                  </h4>
                  {dependencies.map((dep, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={dep.type === 'import' ? 'default' : 'secondary'}>
                          {dep.type}
                        </Badge>
                        <span className="font-medium">{dep.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Line {dep.line}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No dependencies found</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-4">
            {metrics && (
              <div className="space-y-4">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Code Metrics</span>
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Lines of Code</span>
                    <Badge variant="outline">{metrics.linesOfCode}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Cyclomatic Complexity</span>
                    <Badge variant={metrics.complexity > 10 ? 'destructive' : metrics.complexity > 5 ? 'secondary' : 'default'}>
                      {metrics.complexity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Functions</span>
                    <Badge variant="outline">{metrics.functions}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Classes</span>
                    <Badge variant="outline">{metrics.classes}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Imports</span>
                    <Badge variant="outline">{metrics.imports}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Exports</span>
                    <Badge variant="outline">{metrics.exports}</Badge>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Code Quality Assessment</p>
                      <p className="text-muted-foreground">
                        {metrics.complexity <= 5 
                          ? 'Low complexity - Easy to maintain and test'
                          : metrics.complexity <= 10
                          ? 'Moderate complexity - Consider refactoring complex functions'
                          : 'High complexity - Refactoring recommended for better maintainability'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeParser;
export type { ASTNode, CodeMetrics, Dependency };