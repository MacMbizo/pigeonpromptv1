import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Download,
  Calendar,
  TrendingUp,
  Zap,
  Users,
  Crown,
  Check,
  X,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Clock,
  Settings,
  Receipt,
  Wallet
} from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

interface Usage {
  promptExecutions: {
    used: number;
    limit: number;
    cost: number;
  };
  apiCalls: {
    used: number;
    limit: number;
    cost: number;
  };
  storage: {
    used: number;
    limit: number;
    cost: number;
  };
  users: {
    used: number;
    limit: number;
    cost: number;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    promptExecutions: number;
    apiCalls: number;
    storage: number;
    users: number;
  };
  popular?: boolean;
}

export default function Billing() {
  const [subscription, setSubscription] = useState<Subscription>({
    id: 'sub_1234567890',
    plan: 'Professional',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited prompts',
      '100K executions/month',
      'Advanced analytics',
      'Team collaboration',
      'Priority support'
    ]
  });

  const [usage, setUsage] = useState<Usage>({
    promptExecutions: {
      used: 45623,
      limit: 100000,
      cost: 45.62
    },
    apiCalls: {
      used: 23456,
      limit: 50000,
      cost: 23.46
    },
    storage: {
      used: 2.3,
      limit: 10,
      cost: 2.30
    },
    users: {
      used: 8,
      limit: 25,
      cost: 0
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      date: '2024-01-01T00:00:00Z',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      description: 'Professional Plan - January 2024',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2023-12-01T00:00:00Z',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      description: 'Professional Plan - December 2023',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2023-11-01T00:00:00Z',
      amount: 99.00,
      currency: 'USD',
      status: 'paid',
      description: 'Professional Plan - November 2023',
      downloadUrl: '#'
    }
  ]);

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      currency: 'USD',
      interval: 'month',
      features: [
        '10K prompt executions',
        '5K API calls',
        '1GB storage',
        '5 team members',
        'Basic analytics',
        'Email support'
      ],
      limits: {
        promptExecutions: 10000,
        apiCalls: 5000,
        storage: 1,
        users: 5
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      currency: 'USD',
      interval: 'month',
      features: [
        '100K prompt executions',
        '50K API calls',
        '10GB storage',
        '25 team members',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      limits: {
        promptExecutions: 100000,
        apiCalls: 50000,
        storage: 10,
        users: 25
      },
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      currency: 'USD',
      interval: 'month',
      features: [
        'Unlimited executions',
        'Unlimited API calls',
        '100GB storage',
        'Unlimited users',
        'Enterprise analytics',
        'Dedicated support',
        'Custom deployment',
        'SLA guarantee'
      ],
      limits: {
        promptExecutions: -1,
        apiCalls: -1,
        storage: 100,
        users: -1
      }
    }
  ]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'past_due':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    toast.success('Invoice download started');
  };

  const changePlan = (planId: string) => {
    toast.success(`Plan change to ${planId} initiated`);
  };

  const cancelSubscription = () => {
    toast.success('Subscription cancellation initiated');
  };

  const handleDownloadInvoices = () => {
    toast.success('Downloading all invoices...');
  };

  const handleBillingSettings = () => {
    toast.success('Billing settings opened');
  };

  const handleChangePlan = () => {
    toast.success('Change plan dialog opened');
  };

  const handleAddPaymentMethod = () => {
    toast.success('Add payment method dialog opened');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, usage, and billing information
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownloadInvoices}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoices
          </Button>
          <Button variant="outline" onClick={handleBillingSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Billing Settings
          </Button>
        </div>
      </div>

      {/* Current Subscription Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Current Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{subscription.plan}</h3>
                <p className="text-muted-foreground">
                  {formatCurrency(subscription.price)} per {subscription.interval}
                </p>
              </div>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current period:</span>
                <span>
                  {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next billing date:</span>
                <span>{formatDate(subscription.currentPeriodEnd)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Included features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={handleChangePlan}>
                Change Plan
              </Button>
              <Button variant="outline" onClick={cancelSubscription}>
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {formatCurrency(
                  usage.promptExecutions.cost + 
                  usage.apiCalls.cost + 
                  usage.storage.cost + 
                  usage.users.cost
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total usage cost</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Executions:</span>
                <span>{formatCurrency(usage.promptExecutions.cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Calls:</span>
                <span>{formatCurrency(usage.apiCalls.cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage:</span>
                <span>{formatCurrency(usage.storage.cost)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Subscription:</span>
                <span>{formatCurrency(subscription.price)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="usage" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Usage</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center space-x-2">
            <Receipt className="h-4 w-4" />
            <span>Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Plans</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prompt Executions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Prompt Executions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {usage.promptExecutions.used.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    / {usage.promptExecutions.limit === -1 ? '∞' : usage.promptExecutions.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.promptExecutions.used, usage.promptExecutions.limit)} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {getUsagePercentage(usage.promptExecutions.used, usage.promptExecutions.limit).toFixed(1)}% used
                  </span>
                  <span>{formatCurrency(usage.promptExecutions.cost)} this month</span>
                </div>
              </CardContent>
            </Card>

            {/* API Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>API Calls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {usage.apiCalls.used.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    / {usage.apiCalls.limit === -1 ? '∞' : usage.apiCalls.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.apiCalls.used, usage.apiCalls.limit)} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {getUsagePercentage(usage.apiCalls.used, usage.apiCalls.limit).toFixed(1)}% used
                  </span>
                  <span>{formatCurrency(usage.apiCalls.cost)} this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {usage.storage.used} GB
                  </span>
                  <span className="text-muted-foreground">
                    / {usage.storage.limit === -1 ? '∞' : `${usage.storage.limit} GB`}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.storage.used, usage.storage.limit)} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {getUsagePercentage(usage.storage.used, usage.storage.limit).toFixed(1)}% used
                  </span>
                  <span>{formatCurrency(usage.storage.cost)} this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Team Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {usage.users.used}
                  </span>
                  <span className="text-muted-foreground">
                    / {usage.users.limit === -1 ? '∞' : usage.users.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usage.users.used, usage.users.limit)} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {getUsagePercentage(usage.users.used, usage.users.limit).toFixed(1)}% used
                  </span>
                  <span>Included in plan</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{invoice.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-lg font-normal text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={subscription.plan === plan.name ? "outline" : "default"}
                    onClick={() => changePlan(plan.id)}
                    disabled={subscription.plan === plan.name}
                  >
                    {subscription.plan === plan.name ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Payment Management</h3>
                <p className="text-muted-foreground mb-4">
                  Add and manage credit cards, update billing address, and configure payment preferences
                </p>
                <Button onClick={handleAddPaymentMethod}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}