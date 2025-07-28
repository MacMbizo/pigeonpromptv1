import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Server,
  Database,
  Wifi,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { toast } from "sonner";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  workflowId?: string;
  resolved: boolean;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  uptime: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface WorkflowStats {
  id: string;
  name: string;
  executions: number;
  successRate: number;
  avgDuration: number;
  lastRun: Date;
  status: 'active' | 'paused' | 'error';
}

export default function MonitoringDashboard() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'workflows' | 'system' | 'alerts'>('overview');

  // Mock data - in real app, this would come from APIs
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: "Total Executions",
      value: "12,847",
      change: 12.5,
      trend: 'up',
      icon: Activity,
      color: "text-blue-600"
    },
    {
      title: "Success Rate",
      value: "98.2%",
      change: 2.1,
      trend: 'up',
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: -8.3,
      trend: 'down',
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Total Cost",
      value: "$2,847",
      change: 15.2,
      trend: 'up',
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Active Users",
      value: "1,247",
      change: 5.8,
      trend: 'up',
      icon: Users,
      color: "text-indigo-600"
    },
    {
      title: "API Calls",
      value: "847K",
      change: -2.1,
      trend: 'down',
      icon: Zap,
      color: "text-red-600"
    }
  ]);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "alert_1",
      type: "warning",
      message: "High memory usage detected on workflow engine",
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: "alert_2",
      type: "error",
      message: "Workflow 'Customer Support Pipeline' failed 3 times in the last hour",
      timestamp: new Date(Date.now() - 600000),
      workflowId: "workflow_123",
      resolved: false
    },
    {
      id: "alert_3",
      type: "info",
      message: "Scheduled maintenance completed successfully",
      timestamp: new Date(Date.now() - 3600000),
      resolved: true
    }
  ]);

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    uptime: "15d 7h 23m",
    status: 'healthy'
  });

  const [workflowStats, setWorkflowStats] = useState<WorkflowStats[]>([
    {
      id: "wf_1",
      name: "Customer Support Pipeline",
      executions: 2847,
      successRate: 97.8,
      avgDuration: 1200,
      lastRun: new Date(Date.now() - 300000),
      status: 'active'
    },
    {
      id: "wf_2",
      name: "Content Generation Workflow",
      executions: 1523,
      successRate: 99.1,
      avgDuration: 2100,
      lastRun: new Date(Date.now() - 600000),
      status: 'active'
    },
    {
      id: "wf_3",
      name: "Code Review Assistant",
      executions: 847,
      successRate: 94.2,
      avgDuration: 3400,
      lastRun: new Date(Date.now() - 1800000),
      status: 'paused'
    }
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Simulate data updates
        updateMetrics();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      change: metric.change + (Math.random() - 0.5) * 2
    })));
  };

  const refreshData = () => {
    setLastUpdated(new Date());
    updateMetrics();
    toast.success("Dashboard data refreshed");
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    toast.success("Alert resolved");
  };

  const exportData = () => {
    toast.success("Exporting dashboard data...");
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Range Selector */}
            <div className="flex border border-border rounded-lg">
              {['1h', '24h', '7d', '30d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'workflows', label: 'Workflows', icon: Activity },
            { id: 'system', label: 'System Health', icon: Server },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
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
              {tab.id === 'alerts' && alerts.filter(a => !a.resolved).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {alerts.filter(a => !a.resolved).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm ${
                            metric.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Trends</CardTitle>
                  <CardDescription>Workflow execution over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Execution trend chart</p>
                      <p className="text-sm">Chart integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Success Rate Distribution</CardTitle>
                  <CardDescription>Success rates by workflow type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Success rate distribution</p>
                      <p className="text-sm">Chart integration coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest workflow executions and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflowStats.slice(0, 5).map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last run: {workflow.lastRun.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{workflow.successRate.toFixed(1)}% success</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Detailed performance metrics for all workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowStats.map(workflow => (
                    <div key={workflow.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{workflow.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {workflow.id}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Executions</div>
                          <div className="text-lg font-semibold">{workflow.executions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                          <div className="text-lg font-semibold">{workflow.successRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Avg Duration</div>
                          <div className="text-lg font-semibold">{(workflow.avgDuration / 1000).toFixed(1)}s</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Last Run</div>
                          <div className="text-lg font-semibold">{workflow.lastRun.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CPU Usage</p>
                      <p className="text-2xl font-bold">{systemHealth.cpu}%</p>
                    </div>
                    <Server className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.cpu}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Memory</p>
                      <p className="text-2xl font-bold">{systemHealth.memory}%</p>
                    </div>
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.memory}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Storage</p>
                      <p className="text-2xl font-bold">{systemHealth.storage}%</p>
                    </div>
                    <Database className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.storage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Network</p>
                      <p className="text-2xl font-bold">{systemHealth.network}%</p>
                    </div>
                    <Wifi className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${systemHealth.network}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Overall system health and uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="font-semibold">System Status: Healthy</div>
                      <div className="text-sm text-muted-foreground">Uptime: {systemHealth.uptime}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemHealth.status)}`}>
                    {systemHealth.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Monitor and manage system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts</p>
                    <p className="text-sm">All systems are running smoothly</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`border rounded-lg p-4 ${
                          alert.resolved ? 'border-gray-200 opacity-60' : 'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <div className={`font-medium ${
                                alert.resolved ? 'line-through text-muted-foreground' : ''
                              }`}>
                                {alert.message}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {alert.timestamp.toLocaleString()}
                                {alert.workflowId && ` • Workflow: ${alert.workflowId}`}
                              </div>
                            </div>
                          </div>
                          
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
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