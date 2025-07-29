import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Network,
  GitBranch,
  FileText,
  Download,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import mermaid from 'mermaid';

interface FileNode {
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: number;
  language?: string;
}

interface CodeElement {
  name: string;
  type: 'function' | 'class' | 'interface' | 'variable';
  line: number;
  dependencies?: string[];
  parameters?: string[];
  returnType?: string;
}

interface Dependency {
  name: string;
  version?: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  source: string;
}

interface DiagramGeneratorProps {
  fileTree?: FileNode[];
  codeElements?: CodeElement[];
  dependencies?: Dependency[];
  selectedFile?: string;
  onDiagramGenerated?: (diagram: string, type: string) => void;
}

const DiagramGenerator: React.FC<DiagramGeneratorProps> = ({
  fileTree = [],
  codeElements = [],
  dependencies = [],
  selectedFile,
  onDiagramGenerated
}) => {
  const [activeTab, setActiveTab] = useState('filetree');
  const [diagramType, setDiagramType] = useState('graph');
  const [currentDiagram, setCurrentDiagram] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(100);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramId, setDiagramId] = useState(0);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace',
      fontSize: 12,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      gitGraph: {
        theme: 'base',
        themeVariables: {
          primaryColor: '#ff0000'
        }
      }
    });
  }, []);

  const generateFileTreeDiagram = (nodes: FileNode[], prefix = ''): string => {
    let diagram = '';
    
    if (diagramType === 'graph') {
      diagram = 'graph TD\n';
      
      const processNode = (node: FileNode, parentId?: string) => {
        const nodeId = node.path.replace(/[^a-zA-Z0-9]/g, '_');
        const isFile = node.type === 'file';
        const icon = isFile ? '📄' : '📁';
        const label = `${icon} ${node.path.split('/').pop()}`;
        
        diagram += `    ${nodeId}["${label}"]\n`;
        
        if (parentId) {
          diagram += `    ${parentId} --> ${nodeId}\n`;
        }
        
        // Add styling
        if (isFile) {
          const ext = node.path.split('.').pop()?.toLowerCase();
          switch (ext) {
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
              diagram += `    ${nodeId} --> ${nodeId}_js["JavaScript/TypeScript"]\n`;
              diagram += `    class ${nodeId}_js jsFile\n`;
              break;
            case 'py':
              diagram += `    ${nodeId} --> ${nodeId}_py["Python"]\n`;
              diagram += `    class ${nodeId}_py pyFile\n`;
              break;
            case 'css':
            case 'scss':
              diagram += `    ${nodeId} --> ${nodeId}_css["Stylesheet"]\n`;
              diagram += `    class ${nodeId}_css cssFile\n`;
              break;
          }
        }
        
        if (node.children) {
          node.children.forEach(child => processNode(child, nodeId));
        }
      };
      
      nodes.forEach(node => processNode(node));
      
      // Add styling classes
      diagram += `\n    classDef jsFile fill:#f9f,stroke:#333,stroke-width:2px\n`;
      diagram += `    classDef pyFile fill:#9f9,stroke:#333,stroke-width:2px\n`;
      diagram += `    classDef cssFile fill:#99f,stroke:#333,stroke-width:2px\n`;
    } else {
      // Tree diagram
      diagram = 'graph TD\n';
      const processTreeNode = (node: FileNode, level = 0) => {
        const indent = '  '.repeat(level);
        const nodeId = node.path.replace(/[^a-zA-Z0-9]/g, '_');
        const icon = node.type === 'file' ? '📄' : '📁';
        diagram += `${indent}${nodeId}["${icon} ${node.path.split('/').pop()}"]\n`;
        
        if (node.children) {
          node.children.forEach(child => {
            const childId = child.path.replace(/[^a-zA-Z0-9]/g, '_');
            diagram += `${indent}${nodeId} --> ${childId}\n`;
            processTreeNode(child, level + 1);
          });
        }
      };
      
      nodes.forEach(node => processTreeNode(node));
    }
    
    return diagram;
  };

  const generateClassDiagram = (elements: CodeElement[]): string => {
    let diagram = 'classDiagram\n';
    
    const classes = elements.filter(el => el.type === 'class');
    const functions = elements.filter(el => el.type === 'function');
    const interfaces = elements.filter(el => el.type === 'interface');
    
    // Add classes
    classes.forEach(cls => {
      diagram += `    class ${cls.name} {\n`;
      
      // Add methods that belong to this class
      const classMethods = functions.filter(fn => 
        fn.dependencies?.includes(cls.name) || fn.name.startsWith(cls.name)
      );
      
      classMethods.forEach(method => {
        const params = method.parameters?.join(', ') || '';
        const returnType = method.returnType || 'void';
        diagram += `        +${method.name}(${params}) ${returnType}\n`;
      });
      
      diagram += `    }\n`;
    });
    
    // Add interfaces
    interfaces.forEach(iface => {
      diagram += `    class ${iface.name} {\n`;
      diagram += `        <<interface>>\n`;
      diagram += `    }\n`;
    });
    
    // Add relationships
    elements.forEach(element => {
      if (element.dependencies) {
        element.dependencies.forEach(dep => {
          const depElement = elements.find(el => el.name === dep);
          if (depElement) {
            diagram += `    ${element.name} --> ${dep}\n`;
          }
        });
      }
    });
    
    return diagram;
  };

  const generateDependencyDiagram = (deps: Dependency[]): string => {
    let diagram = 'graph LR\n';
    
    // Group dependencies by type
    const prodDeps = deps.filter(d => d.type === 'dependency');
    const devDeps = deps.filter(d => d.type === 'devDependency');
    const peerDeps = deps.filter(d => d.type === 'peerDependency');
    
    diagram += `    Project["📦 Project"]\n`;
    
    // Add production dependencies
    if (prodDeps.length > 0) {
      diagram += `    ProdDeps["🔧 Production"]\n`;
      diagram += `    Project --> ProdDeps\n`;
      
      prodDeps.forEach(dep => {
        const depId = dep.name.replace(/[^a-zA-Z0-9]/g, '_');
        const version = dep.version ? ` v${dep.version}` : '';
        diagram += `    ${depId}["${dep.name}${version}"]\n`;
        diagram += `    ProdDeps --> ${depId}\n`;
      });
    }
    
    // Add dev dependencies
    if (devDeps.length > 0) {
      diagram += `    DevDeps["🛠️ Development"]\n`;
      diagram += `    Project --> DevDeps\n`;
      
      devDeps.forEach(dep => {
        const depId = dep.name.replace(/[^a-zA-Z0-9]/g, '_');
        const version = dep.version ? ` v${dep.version}` : '';
        diagram += `    ${depId}["${dep.name}${version}"]\n`;
        diagram += `    DevDeps --> ${depId}\n`;
      });
    }
    
    // Add peer dependencies
    if (peerDeps.length > 0) {
      diagram += `    PeerDeps["🤝 Peer"]\n`;
      diagram += `    Project --> PeerDeps\n`;
      
      peerDeps.forEach(dep => {
        const depId = dep.name.replace(/[^a-zA-Z0-9]/g, '_');
        const version = dep.version ? ` v${dep.version}` : '';
        diagram += `    ${depId}["${dep.name}${version}"]\n`;
        diagram += `    PeerDeps --> ${depId}\n`;
      });
    }
    
    // Add styling
    diagram += `\n    classDef prodClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n`;
    diagram += `    classDef devClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px\n`;
    diagram += `    classDef peerClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px\n`;
    
    return diagram;
  };

  const generateCallGraph = (elements: CodeElement[]): string => {
    let diagram = 'graph TD\n';
    
    elements.forEach(element => {
      const elementId = element.name.replace(/[^a-zA-Z0-9]/g, '_');
      const icon = element.type === 'function' ? '⚡' : element.type === 'class' ? '🏗️' : '📋';
      
      diagram += `    ${elementId}["${icon} ${element.name}"]\n`;
      
      if (element.dependencies) {
        element.dependencies.forEach(dep => {
          const depId = dep.replace(/[^a-zA-Z0-9]/g, '_');
          diagram += `    ${elementId} --> ${depId}\n`;
        });
      }
    });
    
    // Add styling based on element type
    elements.forEach(element => {
      const elementId = element.name.replace(/[^a-zA-Z0-9]/g, '_');
      switch (element.type) {
        case 'function':
          diagram += `    class ${elementId} functionClass\n`;
          break;
        case 'class':
          diagram += `    class ${elementId} classClass\n`;
          break;
        case 'interface':
          diagram += `    class ${elementId} interfaceClass\n`;
          break;
      }
    });
    
    diagram += `\n    classDef functionClass fill:#fff2cc,stroke:#d6b656,stroke-width:2px\n`;
    diagram += `    classDef classClass fill:#d5e8d4,stroke:#82b366,stroke-width:2px\n`;
    diagram += `    classDef interfaceClass fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px\n`;
    
    return diagram;
  };

  const generateDiagram = async () => {
    setIsGenerating(true);
    
    try {
      let diagram = '';
      
      switch (activeTab) {
        case 'filetree':
          diagram = generateFileTreeDiagram(fileTree);
          break;
        case 'classes':
          diagram = generateClassDiagram(codeElements);
          break;
        case 'dependencies':
          diagram = generateDependencyDiagram(dependencies);
          break;
        case 'callgraph':
          diagram = generateCallGraph(codeElements);
          break;
      }
      
      setCurrentDiagram(diagram);
      
      if (onDiagramGenerated) {
        onDiagramGenerated(diagram, activeTab);
      }
      
      // Render the diagram
      if (diagramRef.current && diagram) {
        const newId = `diagram-${Date.now()}`;
        setDiagramId(prev => prev + 1);
        
        diagramRef.current.innerHTML = `<div id="${newId}"></div>`;
        
        await mermaid.render(newId, diagram);
        const svgElement = document.getElementById(newId);
        if (svgElement) {
          diagramRef.current.innerHTML = svgElement.innerHTML;
        }
      }
    } catch (error) {
      console.error('Diagram generation failed:', error);
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `
          <div class="text-center text-red-500 py-8">
            <p>Failed to generate diagram</p>
            <p class="text-sm text-muted-foreground">${error}</p>
          </div>
        `;
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDiagram = () => {
    if (currentDiagram) {
      const blob = new Blob([currentDiagram], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}-diagram.mmd`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    switch (direction) {
      case 'in':
        setZoom(prev => Math.min(prev + 25, 200));
        break;
      case 'out':
        setZoom(prev => Math.max(prev - 25, 50));
        break;
      case 'reset':
        setZoom(100);
        break;
    }
  };

  useEffect(() => {
    generateDiagram();
  }, [activeTab, diagramType, fileTree, codeElements, dependencies]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Code Visualization</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Select value={diagramType} onValueChange={setDiagramType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="graph">Graph</SelectItem>
                <SelectItem value="tree">Tree</SelectItem>
                <SelectItem value="flowchart">Flowchart</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={generateDiagram} disabled={isGenerating} size="sm">
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            
            <Button onClick={downloadDiagram} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="filetree" className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>File Tree</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-1">
              <GitBranch className="h-4 w-4" />
              <span>Classes</span>
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="flex items-center space-x-1">
              <Network className="h-4 w-4" />
              <span>Dependencies</span>
            </TabsTrigger>
            <TabsTrigger value="callgraph" className="flex items-center space-x-1">
              <Network className="h-4 w-4" />
              <span>Call Graph</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handleZoom('out')} 
                  variant="outline" 
                  size="sm"
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <Badge variant="outline" className="px-3">
                  {zoom}%
                </Badge>
                
                <Button 
                  onClick={() => handleZoom('in')} 
                  variant="outline" 
                  size="sm"
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => handleZoom('reset')} 
                  variant="outline" 
                  size="sm"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {activeTab === 'filetree' && `${fileTree.length} nodes`}
                {activeTab === 'classes' && `${codeElements.filter(e => e.type === 'class').length} classes`}
                {activeTab === 'dependencies' && `${dependencies.length} dependencies`}
                {activeTab === 'callgraph' && `${codeElements.length} elements`}
              </div>
            </div>
            
            {/* Diagram Container */}
            <div className="border rounded-lg overflow-hidden">
              <ScrollArea className="h-96">
                <div 
                  ref={diagramRef}
                  className="p-4 min-h-full flex items-center justify-center"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                >
                  {isGenerating ? (
                    <div className="text-center text-muted-foreground">
                      <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p>Generating diagram...</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Diagram will appear here</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DiagramGenerator;
export type { FileNode, CodeElement, Dependency };