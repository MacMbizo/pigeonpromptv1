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
  History
} from "lucide-react";
import { toast } from "sonner";
import PromptEditor from "@/components/PromptEditor";
import TestingPlayground from "@/components/TestingPlayground";
import VersionControl from "@/components/VersionControl";

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
  const [activeTab, setActiveTab] = useState<'editor' | 'testing' | 'version'>('editor');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: '14',
    theme: 'light',
    autoSave: true,
    syntaxHighlighting: true,
    lineNumbers: true,
    wordWrap: true
  });

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
      default: return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'editor': return 'Editor';
      case 'testing': return 'Testing';
      case 'version': return 'Version Control';
      default: return '';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Main Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-1">
            {(['editor', 'testing', 'version'] as const).map((tab) => (
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
      </div>
    </div>
  );
}