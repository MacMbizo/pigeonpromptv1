import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Save,
  Settings,
  Copy,
  Download,
  Upload,
  Zap,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", cost: "$0.005/1K tokens" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", cost: "$0.015/1K tokens" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", cost: "$0.0008/1K tokens" },
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
  }
];

export default function PromptIDE() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const handleRun = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsRunning(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        id: Date.now(),
        model: selectedModel,
        prompt: prompt,
        response: "This is a simulated response from the AI model. In a real implementation, this would be the actual response from the selected model.",
        tokens: Math.floor(Math.random() * 500) + 100,
        latency: Math.floor(Math.random() * 2000) + 500,
        cost: (Math.random() * 0.05).toFixed(4)
      };
      setResults(prev => [mockResult, ...prev]);
      setIsRunning(false);
      toast.success("Prompt executed successfully!");
    }, 2000);
  };

  const handleSave = () => {
    toast.success("Prompt saved to your workspace");
  };

  const loadTemplate = (template: any) => {
    setPrompt(template.template);
    toast.success(`Loaded template: ${template.name}`);
  };

  const extractVariables = (text: string) => {
    const matches = text.match(/{{\s*([^}]+)\s*}}/g);
    return matches ? matches.map(match => match.replace(/[{}\s]/g, '')) : [];
  };

  const promptVariables = extractVariables(prompt);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Editor */}
      <div className="flex-1 flex flex-col border-r border-border">
        {/* Toolbar */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">Prompt IDE</h1>
              <span className="text-sm text-muted-foreground">Untitled Prompt</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                onClick={handleRun} 
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

        {/* Editor */}
        <div className="flex-1 p-4">
          <div className="h-full">
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here... Use {{variable}} syntax for dynamic content."
              className="w-full h-[calc(100%-2rem)] p-4 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Variables Panel */}
        {promptVariables.length > 0 && (
          <div className="border-t border-border p-4">
            <h3 className="text-sm font-medium mb-3">Variables</h3>
            <div className="grid grid-cols-2 gap-3">
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
      </div>

      {/* Right Panel - Configuration & Results */}
      <div className="w-96 flex flex-col">
        {/* Model Selection */}
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium mb-3">Model Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-muted-foreground">
              Cost: {models.find(m => m.id === selectedModel)?.cost}
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium mb-3">Quick Templates</h3>
          <div className="space-y-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => loadTemplate(template)}
                className="w-full text-left p-2 text-sm border border-border rounded hover:bg-muted transition-colors"
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium mb-3">Results</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Run a prompt to see results here
              </div>
            ) : (
              results.map((result) => (
                <Card key={result.id} className="text-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{result.model}</CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {result.latency}ms
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-muted p-2 rounded text-xs mb-2">
                      {result.response}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{result.tokens} tokens</span>
                      <span>${result.cost}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}