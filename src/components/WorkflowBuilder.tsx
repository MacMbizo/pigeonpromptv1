import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Play,
  Save,
  Settings,
  Trash2,
  Copy,
  Link,
  Zap,
  GitBranch,
  Database,
  Code2,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  Square
} from "lucide-react";
import { toast } from "sonner";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    prompt?: string;
    condition?: string;
    apiEndpoint?: string;
    transformation?: string;
    schedule?: string;
  };
  connections?: string[];
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

const nodeTypes = [
  {
    type: "prompt",
    name: "AI Prompt",
    icon: Code2,
    description: "Execute AI prompt with variables",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    category: "AI"
  },
  {
    type: "condition",
    name: "Condition",
    icon: GitBranch,
    description: "Conditional logic branching",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    category: "Logic"
  },
  {
    type: "api",
    name: "API Call",
    icon: Database,
    description: "External API integration",
    color: "bg-green-50 border-green-200 text-green-700",
    category: "Integration"
  },
  {
    type: "transform",
    name: "Transform",
    icon: Zap,
    description: "Data transformation",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    category: "Data"
  },
  {
    type: "schedule",
    name: "Scheduler",
    icon: Clock,
    description: "Time-based triggers",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    category: "Trigger"
  },
  {
    type: "webhook",
    name: "Webhook",
    icon: Link,
    description: "HTTP webhook trigger",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    category: "Trigger"
  }
];

interface WorkflowBuilderProps {
  nodes: Node[];
  connections: Connection[];
  onNodesChange: (nodes: Node[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onSave: () => void;
  onRun: () => void;
  isRunning: boolean;
}

export default function WorkflowBuilder({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onSave,
  onRun,
  isRunning
}: WorkflowBuilderProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const handleDragStart = (nodeType: string) => {
    setDraggedNodeType(nodeType);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: draggedNodeType,
      position: { x, y },
      data: {
        label: nodeTypes.find(nt => nt.type === draggedNodeType)?.name || "New Node"
      },
      connections: []
    };

    onNodesChange([...nodes, newNode]);
    setDraggedNodeType(null);
    toast.success("Node added to workflow");
  }, [draggedNodeType, nodes, onNodesChange, pan, zoom]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNodeClick = (node: Node) => {
    if (isConnecting && connectionStart && connectionStart !== node.id) {
      // Create connection
      const newConnection: Connection = {
        id: `conn_${Date.now()}`,
        source: connectionStart,
        target: node.id
      };
      onConnectionsChange([...connections, newConnection]);
      setIsConnecting(false);
      setConnectionStart(null);
      toast.success("Nodes connected");
    } else {
      setSelectedNode(node);
    }
  };

  const handleStartConnection = (nodeId: string) => {
    setIsConnecting(true);
    setConnectionStart(nodeId);
    toast.info("Click another node to connect");
  };

  const handleDeleteNode = (nodeId: string) => {
    onNodesChange(nodes.filter(n => n.id !== nodeId));
    onConnectionsChange(connections.filter(c => c.source !== nodeId && c.target !== nodeId));
    setSelectedNode(null);
    toast.success("Node deleted");
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<Node['data']>) => {
    onNodesChange(nodes.map(n => 
      n.id === nodeId 
        ? { ...n, data: { ...n.data, ...updates } }
        : n
    ));
  };

  const getNodeTypeInfo = (type: string) => {
    return nodeTypes.find(nt => nt.type === type) || nodeTypes[0];
  };

  const renderConnection = (connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return null;

    const sourceX = sourceNode.position.x + 60;
    const sourceY = sourceNode.position.y + 25;
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 25;

    return (
      <line
        key={connection.id}
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke="#6b7280"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        className="cursor-pointer hover:stroke-primary"
      />
    );
  };

  return (
    <div className="h-full flex">
      {/* Node Palette */}
      <div className="w-64 border-r border-border bg-card overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Node Library</h3>
          
          {["AI", "Logic", "Integration", "Data", "Trigger"].map(category => (
            <div key={category} className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="space-y-2">
                {nodeTypes.filter(nt => nt.category === category).map((nodeType) => (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={() => handleDragStart(nodeType.type)}
                    className={`p-3 border-2 border-dashed rounded-lg cursor-grab hover:shadow-sm transition-all ${nodeType.color}`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <nodeType.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{nodeType.name}</span>
                    </div>
                    <p className="text-xs opacity-70">{nodeType.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
          <Button size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button 
            size="sm" 
            onClick={onRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1">
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(zoom * 1.2, 2))}>
            +
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(zoom / 1.2, 0.5))}>
            -
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
            Reset
          </Button>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="w-full h-full relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0'
          }}
        >
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

          {/* Connections */}
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
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>
            {connections.map(renderConnection)}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const nodeTypeInfo = getNodeTypeInfo(node.type);
            return (
              <div
                key={node.id}
                className={`absolute p-3 rounded-lg border-2 bg-white shadow-sm cursor-pointer hover:shadow-md transition-all group ${nodeTypeInfo.color} ${
                  selectedNode?.id === node.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  minWidth: '120px'
                }}
                onClick={() => handleNodeClick(node)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <nodeTypeInfo.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{node.data.label}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartConnection(node.id);
                      }}
                    >
                      <Link className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
                {node.data.apiEndpoint && (
                  <p className="text-xs text-gray-600 truncate">
                    {node.data.apiEndpoint}
                  </p>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Square className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag nodes from the library to create your automation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 border-l border-border bg-card overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Node Properties</h3>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => handleUpdateNode(selectedNode.id, { label: e.target.value })}
                  className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {selectedNode.type === 'prompt' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Prompt Template</label>
                  <textarea
                    value={selectedNode.data.prompt || ''}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { prompt: e.target.value })}
                    rows={4}
                    placeholder="Enter your prompt template with {{variables}}"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {selectedNode.type === 'condition' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <input
                    type="text"
                    value={selectedNode.data.condition || ''}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { condition: e.target.value })}
                    placeholder="e.g., result.confidence > 0.8"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {selectedNode.type === 'api' && (
                <div>
                  <label className="block text-sm font-medium mb-1">API Endpoint</label>
                  <input
                    type="text"
                    value={selectedNode.data.apiEndpoint || ''}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { apiEndpoint: e.target.value })}
                    placeholder="https://api.example.com/endpoint"
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {selectedNode.type === 'schedule' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule</label>
                  <select
                    value={selectedNode.data.schedule || ''}
                    onChange={(e) => handleUpdateNode(selectedNode.id, { schedule: e.target.value })}
                    className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select schedule</option>
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <Button 
                  className="w-full mb-2"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    const newNode = {
                      ...selectedNode,
                      id: `node_${Date.now()}`,
                      position: {
                        x: selectedNode.position.x + 20,
                        y: selectedNode.position.y + 20
                      }
                    };
                    onNodesChange([...nodes, newNode]);
                    toast.success("Node duplicated");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a node to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}