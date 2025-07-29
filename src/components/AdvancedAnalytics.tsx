import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  Clock,
  Target,
  Activity,
  Download,
  Filter,
  Calendar,
  Globe
} from "lucide-react";

interface AnalyticsData {
  totalPrompts: number;
  totalExecutions: number;
  activeUsers: number;
  revenue: number;
  avgResponseTime: number;
  successRate: number;
  topPrompts: Array<{
    id: string;
    name: string;
    executions: number;
    successRate: number;
  }>;
  usageByModel: Array<{
    model: string;
    usage: number;
    cost: number;
  }>;
  dailyStats: Array<{
    date: string;
    executions: number;
    users: number;
    revenue: number;
  }>;
}

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPrompts: 1247,
    totalExecutions: 45623,
    activeUsers: 892,
    revenue: 12450.75,
    avgResponseTime: 1.2,
    successRate: 98.5,
    topPrompts: [
      { id: '1', name: 'Customer Support Assistant', executions: 8934, successRate: 99.2 },
      { id: '2', name: 'Content Generator', executions: 7821, successRate: 97.8 },
      { id: '3', name: 'Code Review Helper', executions: 6543, successRate: 98.9 },
      { id: '4', name: 'Email Composer', executions: 5432, successRate: 96.5 },
      { id: '5', name: 'Data Analyzer', executions: 4321, successRate: 99.1 }
    ],
    usageByModel: [
      { model: 'GPT-4', usage: 45, cost: 2340.50 },
      { model: 'GPT-3.5 Turbo', usage: 35, cost: 890.25 },
      { model: 'Claude-3', usage: 15, cost: 567.80 },
      { model: 'Gemini Pro', usage: 5, cost: 123.45 }
    ],
    dailyStats: [
      { date: '2024-01-01', executions: 1234, users: 89, revenue: 456.78 },
      { date: '2024-01-02', executions: 1456, users: 92, revenue: 523.45 },
      { date: '2024-01-03', executions: 1678, users: 95, revenue: 612.34 },
      { date: '2024-01-04', executions: 1543, users: 88, revenue: 567.89 },
      { date: '2024-01-05', executions: 1789, users: 101, revenue: 678.90 }
    ]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleFilter = () => {
    toast.success('Filter options opened');
  };

  const handleExport = () => {
    toast.success('Analytics data exported successfully');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your PigeonPrompt platform performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalPrompts)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalExecutions)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23.4%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Response Time</span>
              <span className="text-sm text-muted-foreground">{analytics.avgResponseTime}s</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm text-muted-foreground">{analytics.successRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.successRate}%` }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error Rate</span>
              <span className="text-sm text-muted-foreground">{(100 - analytics.successRate).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${100 - analytics.successRate}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Model Usage Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.usageByModel.map((model, index) => (
                <div key={model.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{model.model}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{model.usage}%</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(model.cost)}</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${model.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Top Performing Prompts</span>
          </CardTitle>
          <CardDescription>
            Most executed prompts with highest success rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPrompts.map((prompt, index) => (
              <div key={prompt.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{prompt.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(prompt.executions)} executions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{prompt.successRate}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Usage Trends</span>
          </CardTitle>
          <CardDescription>
            Daily execution and user activity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive chart visualization</p>
              <p className="text-sm text-muted-foreground">Integration with charting library (Recharts) recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}