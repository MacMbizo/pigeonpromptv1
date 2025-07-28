import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Settings,
  Repeat,
  Timer,
  CalendarDays,
  Zap,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface ScheduledJob {
  id: string;
  name: string;
  workflowId: string;
  workflowName: string;
  schedule: {
    type: 'cron' | 'interval' | 'once';
    expression: string;
    timezone: string;
  };
  enabled: boolean;
  nextRun: Date;
  lastRun?: Date;
  status: 'active' | 'paused' | 'error' | 'completed';
  executions: number;
  successRate: number;
  description?: string;
  parameters?: Record<string, any>;
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    email?: string;
    webhook?: string;
  };
}

interface ScheduleTemplate {
  name: string;
  expression: string;
  description: string;
}

export default function SchedulingSystem() {
  const [jobs, setJobs] = useState<ScheduledJob[]>([
    {
      id: "job_1",
      name: "Daily Report Generation",
      workflowId: "wf_1",
      workflowName: "Customer Support Pipeline",
      schedule: {
        type: 'cron',
        expression: '0 9 * * *',
        timezone: 'UTC'
      },
      enabled: true,
      nextRun: new Date(Date.now() + 86400000),
      lastRun: new Date(Date.now() - 86400000),
      status: 'active',
      executions: 47,
      successRate: 98.2,
      description: "Generate daily customer support reports",
      notifications: {
        onSuccess: true,
        onFailure: true,
        email: "admin@company.com"
      }
    },
    {
      id: "job_2",
      name: "Weekly Content Backup",
      workflowId: "wf_2",
      workflowName: "Content Generation Workflow",
      schedule: {
        type: 'cron',
        expression: '0 2 * * 0',
        timezone: 'UTC'
      },
      enabled: true,
      nextRun: new Date(Date.now() + 604800000),
      lastRun: new Date(Date.now() - 604800000),
      status: 'active',
      executions: 12,
      successRate: 100,
      description: "Weekly backup of generated content",
      notifications: {
        onSuccess: false,
        onFailure: true,
        email: "backup@company.com"
      }
    },
    {
      id: "job_3",
      name: "Hourly Health Check",
      workflowId: "wf_3",
      workflowName: "System Health Monitor",
      schedule: {
        type: 'interval',
        expression: '3600',
        timezone: 'UTC'
      },
      enabled: false,
      nextRun: new Date(Date.now() + 3600000),
      status: 'paused',
      executions: 168,
      successRate: 95.8,
      description: "Monitor system health every hour",
      notifications: {
        onSuccess: false,
        onFailure: true
      }
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);

  const [newJob, setNewJob] = useState<Partial<ScheduledJob>>({
    name: '',
    workflowId: '',
    schedule: {
      type: 'cron',
      expression: '0 9 * * *',
      timezone: 'UTC'
    },
    enabled: true,
    description: '',
    notifications: {
      onSuccess: false,
      onFailure: true
    }
  });

  const scheduleTemplates: ScheduleTemplate[] = [
    { name: "Every minute", expression: "* * * * *", description: "Runs every minute" },
    { name: "Every hour", expression: "0 * * * *", description: "Runs at the start of every hour" },
    { name: "Daily at 9 AM", expression: "0 9 * * *", description: "Runs daily at 9:00 AM" },
    { name: "Weekly on Monday", expression: "0 9 * * 1", description: "Runs every Monday at 9:00 AM" },
    { name: "Monthly on 1st", expression: "0 9 1 * *", description: "Runs on the 1st of every month at 9:00 AM" },
    { name: "Weekdays only", expression: "0 9 * * 1-5", description: "Runs Monday to Friday at 9:00 AM" }
  ];

  const mockWorkflows = [
    { id: "wf_1", name: "Customer Support Pipeline" },
    { id: "wf_2", name: "Content Generation Workflow" },
    { id: "wf_3", name: "Code Review Assistant" },
    { id: "wf_4", name: "Data Processing Pipeline" },
    { id: "wf_5", name: "Email Campaign Automation" }
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney"
  ];

  const createJob = () => {
    if (!newJob.name || !newJob.workflowId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const job: ScheduledJob = {
      id: `job_${Date.now()}`,
      name: newJob.name!,
      workflowId: newJob.workflowId!,
      workflowName: mockWorkflows.find(w => w.id === newJob.workflowId)?.name || '',
      schedule: newJob.schedule!,
      enabled: newJob.enabled!,
      nextRun: calculateNextRun(newJob.schedule!),
      status: newJob.enabled ? 'active' : 'paused',
      executions: 0,
      successRate: 0,
      description: newJob.description,
      notifications: newJob.notifications!
    };

    setJobs(prev => [...prev, job]);
    setShowCreateForm(false);
    setNewJob({
      name: '',
      workflowId: '',
      schedule: {
        type: 'cron',
        expression: '0 9 * * *',
        timezone: 'UTC'
      },
      enabled: true,
      description: '',
      notifications: {
        onSuccess: false,
        onFailure: true
      }
    });
    toast.success("Scheduled job created successfully");
  };

  const calculateNextRun = (schedule: ScheduledJob['schedule']): Date => {
    const now = new Date();
    if (schedule.type === 'interval') {
      return new Date(now.getTime() + parseInt(schedule.expression) * 1000);
    }
    // For cron expressions, this is a simplified calculation
    // In a real app, you'd use a proper cron parser
    return new Date(now.getTime() + 86400000); // Next day
  };

  const toggleJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            enabled: !job.enabled,
            status: !job.enabled ? 'active' : 'paused'
          }
        : job
    ));
    toast.success("Job status updated");
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    toast.success("Job deleted successfully");
  };

  const runJobNow = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast.success(`Running "${job.name}" now...`);
      // In a real app, this would trigger the workflow execution
    }
  };

  const getStatusIcon = (status: ScheduledJob['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ScheduledJob['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCronExpression = (expression: string, type: string) => {
    if (type === 'interval') {
      const seconds = parseInt(expression);
      if (seconds < 60) return `Every ${seconds} seconds`;
      if (seconds < 3600) return `Every ${Math.floor(seconds / 60)} minutes`;
      if (seconds < 86400) return `Every ${Math.floor(seconds / 3600)} hours`;
      return `Every ${Math.floor(seconds / 86400)} days`;
    }
    
    // Simplified cron description
    const parts = expression.split(' ');
    if (expression === '* * * * *') return 'Every minute';
    if (expression === '0 * * * *') return 'Every hour';
    if (expression === '0 9 * * *') return 'Daily at 9:00 AM';
    if (expression === '0 9 * * 1') return 'Weekly on Monday at 9:00 AM';
    if (expression === '0 9 1 * *') return 'Monthly on 1st at 9:00 AM';
    if (expression === '0 9 * * 1-5') return 'Weekdays at 9:00 AM';
    return expression;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Scheduling System</h1>
            <p className="text-muted-foreground">
              Manage automated workflow executions and schedules
            </p>
          </div>
          
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{jobs.filter(j => j.enabled).length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Executions</p>
                  <p className="text-2xl font-bold">{jobs.reduce((sum, job) => sum + job.executions, 0)}</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-2xl font-bold">
                    {jobs.length > 0 ? (jobs.reduce((sum, job) => sum + job.successRate, 0) / jobs.length).toFixed(1) : 0}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Jobs</CardTitle>
            <CardDescription>Manage your automated workflow schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled jobs</p>
                <p className="text-sm">Create your first scheduled job to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(job.status)}
                          <h3 className="font-semibold">{job.name}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Workflow</div>
                            <div className="font-medium">{job.workflowName}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Schedule</div>
                            <div className="font-medium">
                              {formatCronExpression(job.schedule.expression, job.schedule.type)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Next Run</div>
                            <div className="font-medium">{job.nextRun.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Success Rate</div>
                            <div className="font-medium">{job.successRate.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        {job.description && (
                          <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runJobNow(job.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleJob(job.id)}
                        >
                          {job.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingJob(job.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Job Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create Scheduled Job</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobName">Job Name</Label>
                <Input
                  id="jobName"
                  value={newJob.name || ''}
                  onChange={(e) => setNewJob(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter job name"
                />
              </div>
              
              <div>
                <Label htmlFor="workflow">Workflow</Label>
                <Select
                  value={newJob.workflowId || ''}
                  onValueChange={(value) => setNewJob(prev => ({ ...prev, workflowId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockWorkflows.map(workflow => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="scheduleType">Schedule Type</Label>
                <Select
                  value={newJob.schedule?.type || 'cron'}
                  onValueChange={(value) => setNewJob(prev => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      type: value as 'cron' | 'interval' | 'once'
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cron">Cron Expression</SelectItem>
                    <SelectItem value="interval">Interval (seconds)</SelectItem>
                    <SelectItem value="once">Run Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newJob.schedule?.type === 'cron' && (
                <div>
                  <Label htmlFor="cronExpression">Cron Expression</Label>
                  <Input
                    id="cronExpression"
                    value={newJob.schedule?.expression || ''}
                    onChange={(e) => setNewJob(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        expression: e.target.value
                      }
                    }))}
                    placeholder="0 9 * * *"
                  />
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Quick templates:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {scheduleTemplates.map(template => (
                        <Button
                          key={template.name}
                          variant="outline"
                          size="sm"
                          onClick={() => setNewJob(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule!,
                              expression: template.expression
                            }
                          }))}
                          className="text-left justify-start"
                        >
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.expression}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {newJob.schedule?.type === 'interval' && (
                <div>
                  <Label htmlFor="interval">Interval (seconds)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={newJob.schedule?.expression || ''}
                    onChange={(e) => setNewJob(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule!,
                        expression: e.target.value
                      }
                    }))}
                    placeholder="3600"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={newJob.schedule?.timezone || 'UTC'}
                  onValueChange={(value) => setNewJob(prev => ({
                    ...prev,
                    schedule: {
                      ...prev.schedule!,
                      timezone: value
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description || ''}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newJob.enabled || false}
                  onCheckedChange={(checked) => setNewJob(prev => ({ ...prev, enabled: checked }))}
                />
                <Label htmlFor="enabled">Enable job immediately</Label>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifySuccess"
                      checked={newJob.notifications?.onSuccess || false}
                      onCheckedChange={(checked) => setNewJob(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications!,
                          onSuccess: checked
                        }
                      }))}
                    />
                    <Label htmlFor="notifySuccess">Notify on success</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="notifyFailure"
                      checked={newJob.notifications?.onFailure || false}
                      onCheckedChange={(checked) => setNewJob(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications!,
                          onFailure: checked
                        }
                      }))}
                    />
                    <Label htmlFor="notifyFailure">Notify on failure</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="notificationEmail">Email (optional)</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      value={newJob.notifications?.email || ''}
                      onChange={(e) => setNewJob(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications!,
                          email: e.target.value
                        }
                      }))}
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={createJob}>
                <Save className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}