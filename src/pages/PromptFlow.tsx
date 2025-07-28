import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Play,
  Save,
  Settings,
  Workflow,
  Code2,
  Database,
  GitBranch,
  Zap,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Download,
  Upload,
  Eye,
  BarChart3,
  Calendar,
  Monitor,
  Cog
} from "lucide-react";
import { toast } from "sonner";
import WorkflowBuilder from "@/components/WorkflowBuilder";
import ExecutionEngine from "@/components/ExecutionEngine";
import MonitoringDashboard from "@/components/MonitoringDashboard";
import SchedulingSystem from "@/components/SchedulingSystem";

const nodeTypes = [
  {
    type: "prompt",
    name: "Prompt Node",
    icon: Code2,
    description: "Execute an AI prompt",
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  {
    type: "api",
    name: "API Call",
    icon: Database,
    description: "Make external API request",
    color: "bg-green-50 border-green-200 text-green-700"
  },
  {
    type: "condition",
    name: "Condition",
    icon: GitBranch,
    description: "Conditional logic branch",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700"
  },
  {
    type: "transform",
    name: "Transform",
    icon: Zap,
    description: "Data transformation",
    color: "bg-purple-50 border-purple-200 text-purple-700"
  }
];

const sampleFlows = [
  {
    id: 1,
    name: "Customer Support Pipeline",
    description: "Automated customer inquiry processing with sentiment analysis",
    nodes: 5,
    status: "deployed",
    lastRun: "2 hours ago",
    successRate: "98.5%"
  },
  {
    id: 2,
    name: "Content Generation Workflow",
    description: "Multi-step content creation with review and optimization",
    nodes: 8,
    status: "testing",
    lastRun: "1 day ago",
    successRate: "94.2%"
  },
  {
    id: 3,
    name: "Code Review Assistant",
    description: "Automated code analysis and feedback generation",
    nodes: 6,
    status: "draft",
    lastRun: "Never",
    successRate: "N/A"
  }
];

const flowNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 100, y: 100 },
    data: { label: "Start" }
  },
  {
    id: "prompt1",
    type: "prompt",
    position: { x: 300, y: 100 },
    data: { 
      label: "Analyze Sentiment",
      prompt: "Analyze the sentiment of the following text: {{input_text}}"
    }
  },
  {
    id: "condition1",
    type: "condition",
    position: { x: 500, y: 100 },
    data: { 
      label: "Is Negative?",
      condition: "sentiment === 'negative'"
    }
  },
  {
    id: "prompt2",
    type: "prompt",
    position: { x: 700, y: 50 },
    data: { 
      label: "Generate Apology",
      prompt: "Generate a professional apology response for: {{input_text}}"
    }
  },
  {
    id: "prompt3",
    type: "prompt",
    position: { x: 700, y: 150 },
    data: { 
      label: "Generate Response",
      prompt: "Generate a helpful response for: {{input_text}}"
    }
  },
  {
    id: "end",
    type: "end",
    position: { x: 900, y: 100 },
    data: { label: "End" }
  }
];

export default function PromptFlow() {
  const [activeTab, setActiveTab] = useState<'builder' | 'execution' | 'monitoring' | 'scheduling'>('builder');
  const [selectedFlow, setSelectedFlow] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showNodePanel, setShowNodePanel] = useState(true);

  const handleRunFlow = () => {
    setIsRunning(true);
    toast.success("Flow execution started");
    
    // Simulate flow execution
    setTimeout(() => {
      setIsRunning(false);
      toast.success("Flow completed successfully!");
    }, 3000);
  };

  const handleSaveFlow = () => {
    toast.success("Flow saved successfully");
  };

  const handleDeployFlow = () => {
    toast.success("Flow deployed as API endpoint");
  };

  const handleImportFlow = () => {
    toast.success('Flow imported successfully!');
  };

  const handleExportFlow = () => {
    toast.success('Flow exported successfully!');
  };

  const handleNewFlow = () => {
    toast.success('New flow created!');
    setSelectedFlow(null);
  };

  const handleSettings = () => {
    toast.success('Settings opened!');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header with Navigation Tabs */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">PromptFlow Engine</h1>
            <p className="text-muted-foreground">
              Design, test, deploy, and monitor AI workflow automations
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleImportFlow}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportFlow}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleNewFlow}>
              <Plus className="h-4 w-4 mr-2" />
              New Flow
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          {[
            { id: 'builder', label: 'Workflow Builder', icon: Workflow },
            { id: 'execution', label: 'Execution Engine', icon: Play },
            { id: 'monitoring', label: 'Monitoring', icon: Monitor },
            { id: 'scheduling', label: 'Scheduling', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'builder' && (
          <div className="h-full flex">
            {/* Left Panel - Node Library */}
            {showNodePanel && (
              <div className="w-64 border-r border-border bg-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Node Library</h2>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setShowNodePanel(false)}
                    >
                      ×
                    </Button>
                  </div>
            
                  <div className="space-y-3">
                    {nodeTypes.map((nodeType) => (
                      <div
                        key={nodeType.type}
                        draggable
                        className={`p-3 border-2 border-dashed rounded-lg cursor-grab hover:shadow-sm transition-shadow ${nodeType.color}`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <nodeType.icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{nodeType.name}</span>
                        </div>
                        <p className="text-xs opacity-70">{nodeType.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium mb-3">Recent Flows</h3>
                    <div className="space-y-2">
                      {sampleFlows.map((flow) => (
                        <button
                          key={flow.id}
                          onClick={() => setSelectedFlow(flow)}
                          className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                            selectedFlow?.id === flow.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <div className="font-medium">{flow.name}</div>
                          <div className="text-xs opacity-70">{flow.nodes} nodes</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Workflow className="h-5 w-5" />
                      <h1 className="text-xl font-semibold">
                        {selectedFlow ? selectedFlow.name : "New Flow"}
                      </h1>
                    </div>
                    {!showNodePanel && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowNodePanel(true)}
                      >
                        Show Nodes
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSaveFlow}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSettings}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      onClick={handleRunFlow}
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
                          Test Flow
                        </>
                      )}
                    </Button>
                    <Button onClick={handleDeployFlow}>
                      <Upload className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 bg-gray-50 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Flow Nodes */}
                <div className="relative z-10">
                  {flowNodes.map((node) => {
                    const nodeType = nodeTypes.find(nt => nt.type === node.type);
                    const isStartEnd = node.type === 'start' || node.type === 'end';
                    
                    return (
                      <div
                        key={node.id}
                        className={`absolute p-3 rounded-lg border-2 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                          isStartEnd ? 'border-gray-300' : nodeType?.color || 'border-gray-300'
                        }`}
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          minWidth: '120px'
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {isStartEnd ? (
                            <Circle className="h-4 w-4" />
                          ) : (
                            nodeType && <nodeType.icon className="h-4 w-4" />
                          )}
                          <span className="font-medium text-sm">{node.data.label}</span>
                        </div>
                        {node.data.prompt && (
                          <p className="text-xs text-gray-600 truncate">
                            {node.data.prompt.substring(0, 40)}...
                          </p>
                        )}
                        {node.data.condition && (
                          <p className="text-xs text-gray-600">
                            {node.data.condition}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 pointer-events-none">
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#6b7280"
                        />
                      </marker>
                    </defs>
                    
                    {/* Sample connections */}
                    <line
                      x1="220" y1="115"
                      x2="300" y2="115"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="420" y1="115"
                      x2="500" y2="115"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="580" y1="100"
                      x2="700" y2="65"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="580" y1="130"
                      x2="700" y2="165"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="820" y1="65"
                      x2="900" y2="100"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <line
                      x1="820" y1="165"
                      x2="900" y2="130"
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  </svg>
                </div>

                {/* Empty State */}
                {!selectedFlow && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Build Your First PromptFlow
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drag nodes from the library to create powerful AI workflows
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Start Building
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Properties */}
            <div className="w-80 border-l border-border bg-card">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Flow Properties</h3>
                
                {selectedFlow ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedFlow.name}
                        className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={selectedFlow.description}
                        rows={3}
                        className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium mb-3">Flow Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Nodes</span>
                          <span className="text-sm font-medium">{selectedFlow.nodes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            selectedFlow.status === 'deployed' ? 'bg-green-100 text-green-800' :
                            selectedFlow.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedFlow.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Success Rate</span>
                          <span className="text-sm font-medium">{selectedFlow.successRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Run</span>
                          <span className="text-sm font-medium">{selectedFlow.lastRun}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <Button className="w-full mb-2">
                        <Eye className="h-4 w-4 mr-2" />
                        View API Endpoint
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a flow to view properties</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'execution' && (
          <ExecutionEngine
            workflowId={selectedFlow?.id?.toString() || 'default'}
            nodes={flowNodes}
            connections={[
              { id: 'e1', source: 'start', target: 'prompt1' },
              { id: 'e2', source: 'prompt1', target: 'condition1' },
              { id: 'e3', source: 'condition1', target: 'prompt2' },
              { id: 'e4', source: 'condition1', target: 'prompt3' },
              { id: 'e5', source: 'prompt2', target: 'end' },
              { id: 'e6', source: 'prompt3', target: 'end' }
            ]}
            onExecutionStart={() => {
              setIsRunning(true);
              toast.success('Workflow execution started');
            }}
            onExecutionComplete={(success) => {
              setIsRunning(false);
              if (success) {
                toast.success('Workflow execution completed successfully');
              } else {
                toast.error('Workflow execution failed');
              }
            }}
          />
        )}
        {activeTab === 'monitoring' && <MonitoringDashboard />}
        {activeTab === 'scheduling' && <SchedulingSystem />}
      </div>
    </div>
  );
}