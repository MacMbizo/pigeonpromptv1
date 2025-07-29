import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Zap,
  DollarSign
} from 'lucide-react';
import { useLLM, LLMModel } from './LLMProvider';

// Types for token management
interface TokenUsage {
  id: string;
  timestamp: number;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  operation: string;
  context?: string;
}

interface TokenBudget {
  daily: number;
  monthly: number;
  perRequest: number;
}

interface TokenStats {
  totalTokensUsed: number;
  totalCost: number;
  requestCount: number;
  averageTokensPerRequest: number;
  averageCostPerRequest: number;
  topModels: Array<{
    model: string;
    tokens: number;
    cost: number;
    requests: number;
  }>;
  dailyUsage: Array<{
    date: string;
    tokens: number;
    cost: number;
    requests: number;
  }>;
}

// Context for token management
interface TokenContextType {
  usage: TokenUsage[];
  budget: TokenBudget;
  stats: TokenStats;
  addUsage: (usage: Omit<TokenUsage, 'id' | 'timestamp'>) => void;
  setBudget: (budget: TokenBudget) => void;
  estimateTokens: (text: string, model?: string) => number;
  estimateCost: (tokens: number, model: LLMModel, type: 'input' | 'output') => number;
  getRemainingBudget: (period: 'daily' | 'monthly') => number;
  clearUsage: () => void;
  exportUsage: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

// Custom hook to use token context
export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

// Token estimation utilities
const estimateTokensForModel = (text: string, model: string): number => {
  // Different models have different tokenization
  const baseTokens = Math.ceil(text.length / 4); // Base estimation: 4 chars per token
  
  switch (model) {
    case 'gpt-4o':
    case 'gpt-4o-mini':
      return Math.ceil(baseTokens * 1.0); // GPT-4 tokenization
    case 'gpt-3.5-turbo':
      return Math.ceil(baseTokens * 0.95); // Slightly more efficient
    case 'claude-3-5-sonnet-20241022':
    case 'claude-3-haiku-20240307':
      return Math.ceil(baseTokens * 1.1); // Claude tends to use more tokens
    case 'gemini-1.5-pro':
    case 'gemini-1.5-flash':
      return Math.ceil(baseTokens * 0.9); // Gemini is more efficient
    default:
      return baseTokens;
  }
};

// Token Provider component
interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [usage, setUsage] = useState<TokenUsage[]>([]);
  const [budget, setBudget] = useState<TokenBudget>({
    daily: 100000, // 100k tokens per day
    monthly: 2000000, // 2M tokens per month
    perRequest: 10000 // 10k tokens per request
  });

  const { providers } = useLLM();

  // Load saved data from localStorage
  useEffect(() => {
    const savedUsage = localStorage.getItem('token-usage');
    if (savedUsage) {
      try {
        setUsage(JSON.parse(savedUsage));
      } catch (error) {
        console.error('Failed to parse saved token usage:', error);
      }
    }

    const savedBudget = localStorage.getItem('token-budget');
    if (savedBudget) {
      try {
        setBudget(JSON.parse(savedBudget));
      } catch (error) {
        console.error('Failed to parse saved token budget:', error);
      }
    }
  }, []);

  // Save usage to localStorage
  const saveUsage = (newUsage: TokenUsage[]) => {
    setUsage(newUsage);
    localStorage.setItem('token-usage', JSON.stringify(newUsage));
  };

  // Save budget to localStorage
  const saveBudget = (newBudget: TokenBudget) => {
    setBudget(newBudget);
    localStorage.setItem('token-budget', JSON.stringify(newBudget));
  };

  // Add new usage record
  const addUsage = (newUsage: Omit<TokenUsage, 'id' | 'timestamp'>) => {
    const usageRecord: TokenUsage = {
      ...newUsage,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    const updatedUsage = [usageRecord, ...usage].slice(0, 1000); // Keep last 1000 records
    saveUsage(updatedUsage);
    
    // Check budget limits
    checkBudgetLimits(usageRecord);
  };

  // Check if usage exceeds budget limits
  const checkBudgetLimits = (newUsage: TokenUsage) => {
    const now = new Date();
    const today = now.toDateString();
    const thisMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    // Check daily limit
    const dailyUsage = usage
      .filter(u => new Date(u.timestamp).toDateString() === today)
      .reduce((sum, u) => sum + u.totalTokens, 0) + newUsage.totalTokens;
    
    if (dailyUsage > budget.daily) {
      toast.error(`Daily token limit exceeded! Used ${dailyUsage.toLocaleString()} / ${budget.daily.toLocaleString()} tokens`);
    } else if (dailyUsage > budget.daily * 0.8) {
      toast.warning(`Daily token usage at ${Math.round((dailyUsage / budget.daily) * 100)}%`);
    }
    
    // Check monthly limit
    const monthlyUsage = usage
      .filter(u => {
        const date = new Date(u.timestamp);
        return `${date.getFullYear()}-${date.getMonth()}` === thisMonth;
      })
      .reduce((sum, u) => sum + u.totalTokens, 0) + newUsage.totalTokens;
    
    if (monthlyUsage > budget.monthly) {
      toast.error(`Monthly token limit exceeded! Used ${monthlyUsage.toLocaleString()} / ${budget.monthly.toLocaleString()} tokens`);
    }
    
    // Check per-request limit
    if (newUsage.totalTokens > budget.perRequest) {
      toast.warning(`Request used ${newUsage.totalTokens.toLocaleString()} tokens (limit: ${budget.perRequest.toLocaleString()})`);
    }
  };

  // Estimate tokens for text
  const estimateTokens = (text: string, model?: string): number => {
    return estimateTokensForModel(text, model || 'gpt-4o');
  };

  // Estimate cost for tokens
  const estimateCost = (tokens: number, model: LLMModel, type: 'input' | 'output'): number => {
    const costPer1K = type === 'input' ? model.inputCostPer1K : model.outputCostPer1K;
    return (tokens / 1000) * costPer1K;
  };

  // Get remaining budget
  const getRemainingBudget = (period: 'daily' | 'monthly'): number => {
    const now = new Date();
    const today = now.toDateString();
    const thisMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    if (period === 'daily') {
      const dailyUsage = usage
        .filter(u => new Date(u.timestamp).toDateString() === today)
        .reduce((sum, u) => sum + u.totalTokens, 0);
      return Math.max(0, budget.daily - dailyUsage);
    } else {
      const monthlyUsage = usage
        .filter(u => {
          const date = new Date(u.timestamp);
          return `${date.getFullYear()}-${date.getMonth()}` === thisMonth;
        })
        .reduce((sum, u) => sum + u.totalTokens, 0);
      return Math.max(0, budget.monthly - monthlyUsage);
    }
  };

  // Calculate statistics
  const stats: TokenStats = React.useMemo(() => {
    const totalTokensUsed = usage.reduce((sum, u) => sum + u.totalTokens, 0);
    const totalCost = usage.reduce((sum, u) => sum + u.cost, 0);
    const requestCount = usage.length;
    
    // Group by model
    const modelStats = usage.reduce((acc, u) => {
      const key = u.model;
      if (!acc[key]) {
        acc[key] = { model: key, tokens: 0, cost: 0, requests: 0 };
      }
      acc[key].tokens += u.totalTokens;
      acc[key].cost += u.cost;
      acc[key].requests += 1;
      return acc;
    }, {} as Record<string, { model: string; tokens: number; cost: number; requests: number }>);
    
    const topModels = Object.values(modelStats)
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 5);
    
    // Group by day for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();
    
    const dailyUsage = last30Days.map(date => {
      const dayUsage = usage.filter(u => new Date(u.timestamp).toDateString() === date);
      return {
        date,
        tokens: dayUsage.reduce((sum, u) => sum + u.totalTokens, 0),
        cost: dayUsage.reduce((sum, u) => sum + u.cost, 0),
        requests: dayUsage.length
      };
    });
    
    return {
      totalTokensUsed,
      totalCost,
      requestCount,
      averageTokensPerRequest: requestCount > 0 ? totalTokensUsed / requestCount : 0,
      averageCostPerRequest: requestCount > 0 ? totalCost / requestCount : 0,
      topModels,
      dailyUsage
    };
  }, [usage]);

  // Clear usage data
  const clearUsage = () => {
    setUsage([]);
    localStorage.removeItem('token-usage');
    toast.success('Usage data cleared');
  };

  // Export usage data
  const exportUsage = () => {
    const csvContent = [
      'Timestamp,Model,Provider,Prompt Tokens,Completion Tokens,Total Tokens,Cost,Operation,Context',
      ...usage.map(u => [
        new Date(u.timestamp).toISOString(),
        u.model,
        u.provider,
        u.promptTokens,
        u.completionTokens,
        u.totalTokens,
        u.cost.toFixed(6),
        u.operation,
        u.context || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token-usage-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Usage data exported');
  };

  const contextValue: TokenContextType = {
    usage,
    budget,
    stats,
    addUsage,
    setBudget: saveBudget,
    estimateTokens,
    estimateCost,
    getRemainingBudget,
    clearUsage,
    exportUsage
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};

// Token Manager Dashboard Component
interface TokenManagerProps {
  showDetailed?: boolean;
}

const TokenManager: React.FC<TokenManagerProps> = ({ showDetailed = false }) => {
  const { usage, budget, stats, getRemainingBudget, clearUsage, exportUsage } = useTokens();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('daily');

  const dailyRemaining = getRemainingBudget('daily');
  const monthlyRemaining = getRemainingBudget('monthly');
  const dailyUsagePercent = ((budget.daily - dailyRemaining) / budget.daily) * 100;
  const monthlyUsagePercent = ((budget.monthly - monthlyRemaining) / budget.monthly) * 100;

  if (!showDetailed) {
    // Compact view for sidebar
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Coins className="h-4 w-4" />
            <span>Token Usage</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Daily Usage */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Daily</span>
              <span>{(budget.daily - dailyRemaining).toLocaleString()} / {budget.daily.toLocaleString()}</span>
            </div>
            <Progress value={dailyUsagePercent} className="h-2" />
          </div>
          
          {/* Monthly Usage */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Monthly</span>
              <span>{(budget.monthly - monthlyRemaining).toLocaleString()} / {budget.monthly.toLocaleString()}</span>
            </div>
            <Progress value={monthlyUsagePercent} className="h-2" />
          </div>
          
          {/* Cost */}
          <div className="flex items-center justify-between text-xs">
            <span>Total Cost</span>
            <span className="font-medium">${stats.totalCost.toFixed(4)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed view
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
                <p className="text-lg font-semibold">{stats.totalTokensUsed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-lg font-semibold">${stats.totalCost.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Requests</p>
                <p className="text-lg font-semibold">{stats.requestCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg/Request</p>
                <p className="text-lg font-semibold">{Math.round(stats.averageTokensPerRequest).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Daily Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Used</span>
                <span>{(budget.daily - dailyRemaining).toLocaleString()} tokens</span>
              </div>
              <Progress value={dailyUsagePercent} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{dailyUsagePercent.toFixed(1)}% used</span>
                <span>{dailyRemaining.toLocaleString()} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Used</span>
                <span>{(budget.monthly - monthlyRemaining).toLocaleString()} tokens</span>
              </div>
              <Progress value={monthlyUsagePercent} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{monthlyUsagePercent.toFixed(1)}% used</span>
                <span>{monthlyRemaining.toLocaleString()} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Models */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Top Models</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={exportUsage}>
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={clearUsage}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {stats.topModels.map((model, index) => (
              <div key={model.model} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{model.model}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{model.tokens.toLocaleString()} tokens</span>
                  <span>${model.cost.toFixed(4)}</span>
                  <span>{model.requests} requests</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recent Usage</CardTitle>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {usage.slice(0, 20).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.model}
                    </Badge>
                    <span className="text-sm">{item.operation}</span>
                    {item.context && (
                      <span className="text-xs text-muted-foreground">({item.context})</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{item.totalTokens.toLocaleString()} tokens</span>
                    <span>${item.cost.toFixed(4)}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenManager;