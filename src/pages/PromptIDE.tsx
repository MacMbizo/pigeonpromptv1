import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Layers,
  TestTube,
  GitBranch,
  BarChart3,
  Zap,
  Target,
  History,
  FolderOpen,
  FileText,
  Coins,
  GitCompare,
  PanelLeftOpen,
  PanelLeftClose,
  Network,
  Code,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import PromptEditor from "@/components/PromptEditor";
import TestingPlayground from "@/components/TestingPlayground";
import VersionControl from "@/components/VersionControl";
import FileSystemManager from "@/components/FileSystemManager";
import FilePreview from "@/components/FilePreview";
import GitIntegration from "@/components/GitIntegration";
import TokenManager from "@/components/TokenManager";
import LiveDiffViewer from "@/components/LiveDiffViewer";
import { LLMProvider } from "@/components/LLMProvider";
import { TokenProvider } from "@/components/TokenManager";
import CodeParser from "@/components/CodeParser";
import DiagramGenerator, { type FileNode, type CodeElement, type Dependency } from "@/components/DiagramGenerator";
import DiffViewer from "@/components/DiffViewer";
import CodeApplicator, { type CodeChange } from "@/components/CodeApplicator";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", cost: "$0.005/1K tokens" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", cost: "$0.015/1K tokens" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", cost: "$0.0008/1K tokens" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", cost: "$0.0025/1K tokens" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", cost: "$0.00025/1K tokens" }
];

const templates = [
  {
    name: "Customer Support",
    description: "Handle customer inquiries professionally",
    template: "You are a helpful customer support assistant. Please respond to the following inquiry with empathy and provide clear solutions:\n\n{{customer_message}}"
  },
  {
    name: "Code Review",
    description: "Review code for best practices",
    template: "Please review the following code and provide feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance improvements\n\nCode:\n```{{language}}\n{{code}}\n```"
  },
  {
    name: "Content Generation",
    description: "Generate marketing content",
    template: "Create engaging {{content_type}} for {{target_audience}} about {{topic}}. The tone should be {{tone}} and the length should be {{length}}."
  },
  {
    name: "Data Analysis",
    description: "Analyze data and provide insights",
    template: "You are a data analyst. Analyze the following data and provide key insights, trends, and recommendations:\n\n{{data}}\n\nFocus on: {{analysis_focus}}"
  },
  {
    name: "Creative Writing",
    description: "Generate creative content",
    template: "Write a {{content_type}} in the style of {{style}}. The theme should be {{theme}} and the target audience is {{audience}}. Length: {{length}}"
  }
];

export default function PromptIDE() {
  const [prompt, setPrompt] = useState("");
  const [promptName, setPromptName] = useState("Untitled Prompt");
  const [isRunning, setIsRunning] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'testing' | 'version' | 'files' | 'diff' | 'diagram' | 'parser' | 'applicator'>('editor');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'git' | 'tokens' | 'analysis'>('files');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [projectPath, setProjectPath] = useState<string>('');
  const [originalContent, setOriginalContent] = useState('');
  const [modifiedContent, setModifiedContent] = useState('');
  const [editorSettings, setEditorSettings] = useState({
    fontSize: '14',
    theme: 'light',
    autoSave: true,
    syntaxHighlighting: true,
    lineNumbers: true,
    wordWrap: true
  });
  const [parsedFiles, setParsedFiles] = useState<any[]>([]);
  const [fileNodes, setFileNodes] = useState<FileNode[]>([]);
  const [codeElements, setCodeElements] = useState<CodeElement[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [codeChanges, setCodeChanges] = useState<CodeChange[]>([]);

  const handleRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    setIsRunning(true);
    // This will be handled by the TestingPlayground component
    setTimeout(() => setIsRunning(false), 1000);
  };

  const handleSave = () => {
    // Save to localStorage (mock backend)
    const prompts = JSON.parse(localStorage.getItem('pigeonprompt_prompts') || '[]');
    const existingIndex = prompts.findIndex((p: any) => p.name === promptName);
    
    const promptData = {
      id: existingIndex >= 0 ? prompts[existingIndex].id : Date.now(),
      name: promptName,
      content: prompt,
      variables: variables,
      createdAt: existingIndex >= 0 ? prompts[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    if (existingIndex >= 0) {
      prompts[existingIndex] = promptData;
    } else {
      prompts.push(promptData);
    }
    
    localStorage.setItem('pigeonprompt_prompts', JSON.stringify(prompts));
    toast.success(`Prompt '${promptName}' saved to your workspace`);
  };
  
  const handleSaveSettings = () => {
    localStorage.setItem('pigeonprompt_editor_settings', JSON.stringify(editorSettings));
    toast.success('Editor settings saved successfully!');
    setShowSettings(false);
  };

  const loadTemplate = (template: any) => {
    setPrompt(template.template);
    setShowTemplates(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  const extractVariables = (text: string) => {
    const matches = text.match(/{\{\s*([^}]+)\s*}\}/g);
    return matches ? matches.map(match => match.replace(/[{}\s]/g, '')) : [];
  };

  const promptVariables = extractVariables(prompt);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'editor': return <Zap className="h-4 w-4" />;
      case 'testing': return <TestTube className="h-4 w-4" />;
      case 'version': return <GitBranch className="h-4 w-4" />;
      case 'files': return <FileText className="h-4 w-4" />;
      case 'diff': return <GitCompare className="h-4 w-4" />;
      case 'diagram': return <Network className="h-4 w-4" />;
      case 'parser': return <Code className="h-4 w-4" />;
      case 'applicator': return <Eye className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'editor': return 'Editor';
      case 'testing': return 'Testing';
      case 'version': return 'Version Control';
      case 'files': return 'Files';
      case 'diff': return 'Diff';
      case 'diagram': return 'Diagram';
      case 'parser': return 'Parser';
      case 'applicator': return 'Applicator';
      default: return '';
    }
  };

  return (
    <LLMProvider>
      <TokenProvider>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Main Navigation Tabs */}
          <div className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </Button>
            <div className="flex items-center space-x-1">
              {(['editor', 'testing', 'version', 'files', 'diff', 'diagram', 'parser', 'applicator'] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center space-x-2"
                >
                  {getTabIcon(tab)}
                  <span>{getTabLabel(tab)}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <Layers className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Editor Settings</DialogTitle>
                  <DialogDescription>
                    Customize your prompt editing experience.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fontSize" className="text-right">
                      Font Size
                    </Label>
                    <select 
                      id="fontSize" 
                      value={editorSettings.fontSize}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                      className="col-span-3 p-2 border border-border rounded"
                    >
                      <option value="12">12px</option>
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="theme" className="text-right">
                      Theme
                    </Label>
                    <select 
                      id="theme" 
                      value={editorSettings.theme}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, theme: e.target.value }))}
                      className="col-span-3 p-2 border border-border rounded"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="autoSave" className="text-right">
                      Auto Save
                    </Label>
                    <input 
                      type="checkbox" 
                      id="autoSave" 
                      checked={editorSettings.autoSave}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="syntaxHighlighting" className="text-right">
                      Syntax Highlighting
                    </Label>
                    <input 
                      type="checkbox" 
                      id="syntaxHighlighting" 
                      checked={editorSettings.syntaxHighlighting}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, syntaxHighlighting: e.target.checked }))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lineNumbers" className="text-right">
                      Line Numbers
                    </Label>
                    <input 
                      type="checkbox" 
                      id="lineNumbers" 
                      checked={editorSettings.lineNumbers}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, lineNumbers: e.target.checked }))}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wordWrap" className="text-right">
                      Word Wrap
                    </Label>
                    <input 
                      type="checkbox" 
                      id="wordWrap" 
                      checked={editorSettings.wordWrap}
                      onChange={(e) => setEditorSettings(prev => ({ ...prev, wordWrap: e.target.checked }))}
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="border-b border-border p-4 bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Quick Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => loadTemplate(template)}
                className="text-left p-3 border border-border rounded-lg hover:bg-background transition-colors"
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variables Panel */}
      {promptVariables.length > 0 && (
        <div className="border-b border-border p-4 bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Variables</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {promptVariables.map((variable) => (
              <div key={variable}>
                <label className="block text-xs font-medium mb-1">{variable}</label>
                <input
                  type="text"
                  value={variables[variable] || ""}
                  onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                  placeholder={`Enter ${variable}`}
                  className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r border-border flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-border">
              <Button
                variant={activeSidebarTab === 'files' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSidebarTab('files')}
                className="flex-1 rounded-none"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Files
              </Button>
              <Button
                variant={activeSidebarTab === 'git' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSidebarTab('git')}
                className="flex-1 rounded-none"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Git
              </Button>
              <Button
                variant={activeSidebarTab === 'tokens' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSidebarTab('tokens')}
                className="flex-1 rounded-none"
              >
                <Coins className="w-4 h-4 mr-2" />
                Tokens
              </Button>
              <Button
                variant={activeSidebarTab === 'analysis' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSidebarTab('analysis')}
                className="flex-1 rounded-none"
              >
                <Code className="w-4 h-4 mr-2" />
                Analysis
              </Button>
            </div>
            
            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              {activeSidebarTab === 'files' && (
                   <FileSystemManager
                     onFilesSelected={(files) => setSelectedFile(files[0])}
                     onProjectConnected={(project) => setProjectPath(project.name)}
                   />
                 )}
              {activeSidebarTab === 'git' && (
                <GitIntegration projectPath={projectPath} />
              )}
              {activeSidebarTab === 'tokens' && (
                <TokenManager />
              )}
              {activeSidebarTab === 'analysis' && (
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">Code Analysis</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Parsed Files: {parsedFiles.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Code Elements: {codeElements.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dependencies: {dependencies.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'editor' && (
            <>
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                onRun={handleRun}
                onSave={handleSave}
                isRunning={isRunning}
                promptName={promptName}
                onPromptNameChange={setPromptName}
              />
              <TestingPlayground
                prompt={prompt}
                variables={variables}
                models={models}
              />
            </>
          )}
          
          {activeTab === 'testing' && (
            <div className="flex-1">
              <TestingPlayground
                prompt={prompt}
                variables={variables}
                models={models}
              />
            </div>
          )}
          
          {activeTab === 'version' && (
            <div className="flex-1">
              <PromptEditor
                value={prompt}
                onChange={setPrompt}
                onRun={handleRun}
                onSave={handleSave}
                isRunning={isRunning}
                promptName={promptName}
                onPromptNameChange={setPromptName}
              />
              <VersionControl
                prompt={prompt}
                onPromptChange={setPrompt}
                promptName={promptName}
              />
            </div>
          )}
          
          {activeTab === 'files' && selectedFile && (
             <FilePreview
               file={selectedFile}
               onSnippetSelected={(snippet) => {
                 setPrompt(prev => prev + '\n\n' + snippet);
                 setActiveTab('editor');
                 toast.success('Code snippet added to prompt');
               }}
             />
           )}
          
          {activeTab === 'diff' && (
             <LiveDiffViewer
               originalContent={originalContent}
               modifiedContent={modifiedContent}
               fileName="comparison.txt"
               language="text"
             />
           )}
          
          {activeTab === 'diagram' && (
             <DiagramGenerator
               fileTree={fileNodes}
               codeElements={codeElements}
               dependencies={dependencies}
             />
           )}
          
          {activeTab === 'parser' && (
              <CodeParser
                fileContent={selectedFile?.content || prompt}
                fileName={selectedFile?.name || 'prompt.txt'}
                language={selectedFile?.language || 'text'}
                onAnalysisComplete={(files) => {
                  setParsedFiles(files);
                  // Extract data for diagram
                  const nodes: FileNode[] = files.map(f => ({
                    path: f.path,
                    type: f.type === 'file' ? 'file' : 'directory',
                    size: f.content?.length || 0
                  }));
                  setFileNodes(nodes);
                  
                  const elements: CodeElement[] = files.flatMap(f => 
                    f.functions?.map((fn: any) => ({
                      name: fn.name,
                      type: 'function' as const,
                      line: fn.line || 0
                    })) || []
                  );
                  setCodeElements(elements);
                  
                  const deps: Dependency[] = files.flatMap(f => 
                    f.imports?.map((imp: any) => ({
                      name: imp,
                      type: 'dependency' as const,
                      source: f.path
                    })) || []
                  );
                  setDependencies(deps);
                }}
              />
            )}
          
          {activeTab === 'applicator' && (
             <CodeApplicator
               changes={codeChanges}
               onApplyAll={async (changes) => {
                 toast.success(`Applied ${changes.length} code changes`);
                 setCodeChanges([]);
                 return true;
               }}
             />
           )}
        </div>
      </div>
        </div>
      </TokenProvider>
    </LLMProvider>
  );
}