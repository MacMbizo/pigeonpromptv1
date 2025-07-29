import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    bio: 'AI Engineer passionate about prompt engineering and automation.',
    company: '',
    website: '',
    location: '',
    timezone: 'America/Los_Angeles'
  });
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || ''
      }));
    }
  }, [user]);

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 24,
    loginNotifications: true,
    apiKeyRotation: 30,
    passwordLastChanged: '2024-01-01T00:00:00Z'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    workflowCompletions: true,
    systemUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    weeklyDigest: true
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    density: 'comfortable',
    sidebarCollapsed: false
  });

  const [integrations, setIntegrations] = useState({
    slackWebhook: '',
    discordWebhook: '',
    teamsWebhook: '',
    emailNotifications: true,
    smsNotifications: false
  });

  const [dataSettings, setDataSettings] = useState({
    dataRetention: 365,
    autoBackup: true,
    backupFrequency: 'daily',
    exportFormat: 'json',
    anonymizeData: false
  });

  const saveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const saveSecurity = () => {
    toast.success('Security settings updated');
  };

  const saveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const saveAppearance = () => {
    toast.success('Appearance settings saved');
  };

  const saveIntegrations = () => {
    toast.success('Integration settings saved');
  };

  const saveDataSettings = () => {
    toast.success('Data settings updated');
  };

  const resetToDefaults = () => {
    toast.success('Settings reset to defaults');
  };

  const exportData = () => {
    toast.success('Data export initiated');
  };

  const deleteAccount = () => {
    toast.error('Account deletion requires additional verification');
  };

  const handleChangePassword = () => {
    toast.success('Password change dialog opened');
  };

  const handleGenerateCodes = () => {
    toast.success('Backup codes generated successfully');
  };

  const handleImportData = () => {
    toast.success('Data import dialog opened');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and platform configuration
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Europe/Paris">Central European Time (CET)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <Button onClick={saveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                    min="1"
                    max="168"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKeyRotation">API Key Rotation (days)</Label>
                  <Input
                    id="apiKeyRotation"
                    type="number"
                    value={security.apiKeyRotation}
                    onChange={(e) => setSecurity({ ...security, apiKeyRotation: parseInt(e.target.value) })}
                    min="7"
                    max="365"
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Password & Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed: {new Date(security.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Backup Codes</p>
                    <p className="text-sm text-muted-foreground">
                      Generate backup codes for account recovery
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleGenerateCodes}>
                    Generate Codes
                  </Button>
                </div>
              </div>
              
              <Button onClick={saveSecurity}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription, billing information, and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                    <p className="text-xs text-muted-foreground mt-1">Limited features and usage</p>
                  </div>
                  <Button>
                    Upgrade Plan
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium">API Calls</h4>
                        <p className="text-2xl font-bold text-primary">1,247</p>
                        <p className="text-xs text-muted-foreground">of 10,000 this month</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium">Storage</h4>
                        <p className="text-2xl font-bold text-primary">2.3 GB</p>
                        <p className="text-xs text-muted-foreground">of 5 GB used</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="font-medium">Team Members</h4>
                        <p className="text-2xl font-bold text-primary">1</p>
                        <p className="text-xs text-muted-foreground">of 3 available</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        value={profile.email}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">No payment method on file</p>
                    <Button variant="outline" className="mt-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Billing History</h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">No billing history available</p>
                    <p className="text-xs text-muted-foreground mt-1">You're currently on the free plan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Notifications</span>
                </h3>
                
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Workflow Completions</Label>
                      <p className="text-sm text-muted-foreground">Get notified when workflows finish</p>
                    </div>
                    <Switch
                      checked={notifications.workflowCompletions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, workflowCompletions: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">Platform updates and maintenance</p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important security notifications</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Product updates and tips</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Push Notifications</span>
                </h3>
                
                <div className="ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Real-time notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={saveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Display</CardTitle>
              <CardDescription>
                Customize the look and feel of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex space-x-2">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setAppearance({ ...appearance, theme: value })}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                          appearance.theme === value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={appearance.language}
                      onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="density">Interface Density</Label>
                    <select
                      id="density"
                      value={appearance.density}
                      onChange={(e) => setAppearance({ ...appearance, density: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="compact">Compact</option>
                      <option value="comfortable">Comfortable</option>
                      <option value="spacious">Spacious</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      value={appearance.dateFormat}
                      onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <select
                      id="timeFormat"
                      value={appearance.timeFormat}
                      onChange={(e) => setAppearance({ ...appearance, timeFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sidebar Collapsed by Default</Label>
                    <p className="text-sm text-muted-foreground">Start with sidebar minimized</p>
                  </div>
                  <Switch
                    checked={appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => setAppearance({ ...appearance, sidebarCollapsed: checked })}
                  />
                </div>
              </div>
              
              <Button onClick={saveAppearance}>
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Connect with external services and configure webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Webhook URLs</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                    <Input
                      id="slackWebhook"
                      value={integrations.slackWebhook}
                      onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                    <Input
                      id="discordWebhook"
                      value={integrations.discordWebhook}
                      onChange={(e) => setIntegrations({ ...integrations, discordWebhook: e.target.value })}
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamsWebhook">Microsoft Teams Webhook URL</Label>
                    <Input
                      id="teamsWebhook"
                      value={integrations.teamsWebhook}
                      onChange={(e) => setIntegrations({ ...integrations, teamsWebhook: e.target.value })}
                      placeholder="https://outlook.office.com/webhook/..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Channels</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={integrations.emailNotifications}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, emailNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={integrations.smsNotifications}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, smsNotifications: checked })}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={saveIntegrations}>
                <Save className="h-4 w-4 mr-2" />
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure data retention, backups, and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Data Retention</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={dataSettings.dataRetention}
                      onChange={(e) => setDataSettings({ ...dataSettings, dataRetention: parseInt(e.target.value) })}
                      min="30"
                      max="2555"
                    />
                    <p className="text-sm text-muted-foreground">
                      How long to keep execution logs and results
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Enable automated data backups</p>
                    </div>
                    <Switch
                      checked={dataSettings.autoBackup}
                      onCheckedChange={(checked) => setDataSettings({ ...dataSettings, autoBackup: checked })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <select
                      id="backupFrequency"
                      value={dataSettings.backupFrequency}
                      onChange={(e) => setDataSettings({ ...dataSettings, backupFrequency: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      disabled={!dataSettings.autoBackup}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Privacy & Export</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Anonymize Personal Data</Label>
                      <p className="text-sm text-muted-foreground">Remove personal identifiers from exports</p>
                    </div>
                    <Switch
                      checked={dataSettings.anonymizeData}
                      onCheckedChange={(checked) => setDataSettings({ ...dataSettings, anonymizeData: checked })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <select
                      id="exportFormat"
                      value={dataSettings.exportFormat}
                      onChange={(e) => setDataSettings({ ...dataSettings, exportFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="xml">XML</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button variant="outline" onClick={handleImportData}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button onClick={saveDataSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Data Settings
              </Button>
            </CardContent>
          </Card>
          
          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" onClick={deleteAccount}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}