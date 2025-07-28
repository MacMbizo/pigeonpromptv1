import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Zap,
  Timer,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ExecutionLog {
  id: string;
  timestamp: Date;
  nodeId: string;
  nodeName: string;
  status: 'running' | 'completed' | 'failed' | 'skipped';
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

interface ExecutionMetrics {
  totalRuns: number;
  successRate: number;
  averageDuration: number;
  totalCost: number;
  lastRun: Date;
}

interface ScheduledExecution {
  id: string;
  workflowId: string;
  schedule: string;
  nextRun: Date;
  enabled: boolean;
  lastRun?: Date;
  lastStatus?: 'success' | 'failed';
}

interface ExecutionEngineProps {
  workflowId: string;
  nodes: any[];
  connections: any[];
  onExecutionStart: () => void;
  onExecutionComplete: (success: boolean) => void;
}

export default function ExecutionEngine({
  workflowId,
  nodes,
  connections,
  onExecutionStart,
  onExecutionComplete
}: ExecutionEngineProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ExecutionMetrics>({
    totalRuns: 0,
    successRate: 0,
    averageDuration: 0,
    totalCost: 0,
    lastRun: new Date()
  });
  const [scheduledExecutions, setScheduledExecutions] = useState<ScheduledExecution[]>([]);
  const [activeTab, setActiveTab] = useState<'execution' | 'logs' | 'metrics' | 'schedule'>('execution');

  // Simulate execution engine
  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error("No nodes to execute");
      return;
    }

    setIsExecuting(true);
    setExecutionLogs([]);
    onExecutionStart();

    const startTime = Date.now();
    let success = true;

    try {
      // Find start node or first node
      const startNode = nodes.find(n => n.type === 'start') || nodes[0];
      const executionOrder = getExecutionOrder(startNode.id);

      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        setCurrentStep(nodeId);
        const stepStartTime = Date.now();

        // Add running log
        const runningLog: ExecutionLog = {
          id: `log_${Date.now()}_${nodeId}`,
          timestamp: new Date(),
          nodeId,
          nodeName: node.data.label,
          status: 'running'
        };
        setExecutionLogs(prev => [...prev, runningLog]);

        // Simulate node execution
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const duration = Date.now() - stepStartTime;
        const nodeSuccess = Math.random() > 0.1; // 90% success rate

        if (!nodeSuccess) {
          success = false;
          const errorLog: ExecutionLog = {
            ...runningLog,
            status: 'failed',
            duration,
            error: `Execution failed for ${node.data.label}`
          };
          setExecutionLogs(prev => prev.map(log => 
            log.id === runningLog.id ? errorLog : log
          ));
          break;
        } else {
          const successLog: ExecutionLog = {
            ...runningLog,
            status: 'completed',
            duration,
            output: generateMockOutput(node.type)
          };
          setExecutionLogs(prev => prev.map(log => 
            log.id === runningLog.id ? successLog : log
          ));
        }
      }

      const totalDuration = Date.now() - startTime;
      
      // Update metrics
      setMetrics(prev => ({
        totalRuns: prev.totalRuns + 1,
        successRate: ((prev.successRate * prev.totalRuns) + (success ? 1 : 0)) / (prev.totalRuns + 1),
        averageDuration: ((prev.averageDuration * prev.totalRuns) + totalDuration) / (prev.totalRuns + 1),
        totalCost: prev.totalCost + (totalDuration / 1000 * 0.01), // Mock cost calculation
        lastRun: new Date()
      }));

      if (success) {
        toast.success(`Workflow completed successfully in ${(totalDuration / 1000).toFixed(1)}s`);
      } else {
        toast.error("Workflow execution failed");
      }

    } catch (error) {
      success = false;
      toast.error("Execution error occurred");
    } finally {
      setIsExecuting(false);
      setCurrentStep(null);
      onExecutionComplete(success);
    }
  };

  const getExecutionOrder = (startNodeId: string): string[] => {
    // Simple topological sort for execution order
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      order.push(nodeId);

      // Find connected nodes
      const connectedNodes = connections
        .filter(c => c.source === nodeId)
        .map(c => c.target);
      
      connectedNodes.forEach(visit);
    };

    visit(startNodeId);
    return order;
  };

  const generateMockOutput = (nodeType: string) => {
    switch (nodeType) {
      case 'prompt':
        return { text: "Generated AI response", confidence: 0.95 };
      case 'api':
        return { status: 200, data: { result: "API response" } };
      case 'condition':
        return { result: true, reason: "Condition met" };
      case 'transform':
        return { transformed: true, output: "Processed data" };
      default:
        return { status: "completed" };
    }
  };

  const stopExecution = () => {
    setIsExecuting(false);
    setCurrentStep(null);
    toast.info("Execution stopped");
  };

  const clearLogs = () => {
    setExecutionLogs([]);
    toast.success("Logs cleared");
  };

  const scheduleWorkflow = (schedule: string) => {
    const newSchedule: ScheduledExecution = {
      id: `schedule_${Date.now()}`,
      workflowId,
      schedule,
      nextRun: new Date(Date.now() + 60000), // Next minute for demo
      enabled: true
    };
    setScheduledExecutions(prev => [...prev, newSchedule]);
    toast.success(`Workflow scheduled: ${schedule}`);
  };

  const getStatusIcon = (status: ExecutionLog['status']) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Execution Engine</h2>
            {isExecuting && currentStep && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Executing: {nodes.find(n => n.id === currentStep)?.data.label}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
            
            {isExecuting && (
              <Button onClick={stopExecution} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
            
            <Button onClick={clearLogs} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4">
          {[
            { id: 'execution', label: 'Execution', icon: Play },
            { id: 'logs', label: 'Logs', icon: Activity },
            { id: 'metrics', label: 'Metrics', icon: BarChart3 },
            { id: 'schedule', label: 'Schedule', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'execution' && (
          <div className="p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {isExecuting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                        <span className="font-medium text-blue-500">Running</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-500">Ready</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{nodes.length}</div>
                  <div className="text-sm text-muted-foreground">Total nodes</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{connections.length}</div>
                  <div className="text-sm text-muted-foreground">Total connections</div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Execution View */}
            {isExecuting && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Execution</CardTitle>
                  <CardDescription>Real-time workflow execution status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nodes.map(node => {
                      const log = executionLogs.find(l => l.nodeId === node.id);
                      const isCurrent = currentStep === node.id;
                      
                      return (
                        <div
                          key={node.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            isCurrent ? 'border-blue-500 bg-blue-50' : 'border-border'
                          }`}
                        >
                          {log ? getStatusIcon(log.status) : <Activity className="h-4 w-4 text-gray-400" />}
                          <div className="flex-1">
                            <div className="font-medium">{node.data.label}</div>
                            {log && (
                              <div className="text-sm text-muted-foreground">
                                {log.status === 'completed' && log.duration && `Completed in ${log.duration}ms`}
                                {log.status === 'failed' && log.error}
                                {log.status === 'running' && 'Executing...'}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4 h-full overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Execution Logs</CardTitle>
                <CardDescription>Detailed execution history and outputs</CardDescription>
              </CardHeader>
              <CardContent>
                {executionLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No execution logs yet</p>
                    <p className="text-sm">Run the workflow to see logs</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {executionLogs.map(log => (
                      <div key={log.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <span className="font-medium">{log.nodeName}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {log.duration && (
                          <div className="text-sm text-muted-foreground mb-1">
                            Duration: {log.duration}ms
                          </div>
                        )}
                        
                        {log.error && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {log.error}
                          </div>
                        )}
                        
                        {log.output && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View Output
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.output, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalRuns}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics.successRate * 100).toFixed(1)}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(metrics.averageDuration / 1000).toFixed(1)}s</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Workflow execution analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Detailed performance metrics and charts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="p-4 h-full overflow-y-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Schedule Workflow</CardTitle>
                <CardDescription>Set up automated workflow execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Hourly', 'Daily', 'Weekly', 'Monthly'].map(schedule => (
                    <Button
                      key={schedule}
                      variant="outline"
                      onClick={() => scheduleWorkflow(schedule.toLowerCase())}
                      className="flex items-center space-x-2"
                    >
                      <Clock className="h-4 w-4" />
                      <span>{schedule}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Executions</CardTitle>
                <CardDescription>Manage automated workflow schedules</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledExecutions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled executions</p>
                    <p className="text-sm">Create a schedule to automate your workflow</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scheduledExecutions.map(schedule => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">{schedule.schedule} execution</div>
                          <div className="text-sm text-muted-foreground">
                            Next run: {schedule.nextRun.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              setScheduledExecutions(prev => prev.filter(s => s.id !== schedule.id));
                              toast.success("Schedule removed");
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}