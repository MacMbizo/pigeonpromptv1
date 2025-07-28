import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Key,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Check,
  Users,
  Building,
  Crown
} from "lucide-react";
import { toast } from "sonner";

const settingsSections = [
  { id: "profile", name: "Profile", icon: User },
  { id: "api", name: "API Keys", icon: Key },
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "appearance", name: "Appearance", icon: Palette },
  { id: "workspace", name: "Workspace", icon: Building },
  { id: "team", name: "Team", icon: Users }
];

const apiKeys = [
  {
    id: 1,
    name: "Production API",
    key: "pk_live_1234567890abcdef",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
    permissions: ["read", "write"]
  },
  {
    id: 2,
    name: "Development API",
    key: "pk_test_abcdef1234567890",
    created: "2024-01-10",
    lastUsed: "1 day ago",
    permissions: ["read"]
  }
];

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    role: "Admin",
    avatar: "JD",
    status: "active",
    lastActive: "Online"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "Editor",
    avatar: "SW",
    status: "active",
    lastActive: "2 hours ago"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "Viewer",
    avatar: "MJ",
    status: "pending",
    lastActive: "Never"
  }
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showApiKey, setShowApiKey] = useState<{[key: number]: boolean}>({});
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });
  const [theme, setTheme] = useState("light");

  const handleCopyApiKey = (keyId: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteApiKey = (keyId: number) => {
    toast.success("API key deleted successfully");
  };

  const handleInviteTeamMember = () => {
    toast.success("Invitation sent successfully");
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSaveBilling = () => {
    toast.success("Billing information updated");
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue="john@company.com"
              className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              rows={3}
              defaultValue="AI Engineer passionate about prompt optimization and workflow automation."
              className="w-full p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <Button onClick={handleSaveProfile} className="mt-4">
          Save Changes
        </Button>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account</p>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">API Keys</h3>
          <p className="text-sm text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <div className="flex space-x-1">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {showApiKey[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•').slice(0, 20) + '...'}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowApiKey(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                    >
                      {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyApiKey(apiKey.id, apiKey.key)}
                    >
                      {copiedKey === apiKey.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteApiKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Current Plan</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <h4 className="text-xl font-semibold">Team Plan</h4>
                </div>
                <p className="text-muted-foreground">$29/month • Up to 10 team members</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Calls Used</span>
                    <span>8,450 / 50,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '17%' }}></div>
                  </div>
                </div>
              </div>
              <Button>Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSaveBilling}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Billing History</h3>
        <div className="space-y-2">
          {[
            { date: "2024-01-01", amount: "$29.00", status: "Paid" },
            { date: "2023-12-01", amount: "$29.00", status: "Paid" },
            { date: "2023-11-01", amount: "$29.00", status: "Paid" }
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{invoice.date}</span>
                <span className="text-muted-foreground">{invoice.amount}</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  {invoice.status}
                </span>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">Manage your team access and permissions</p>
        </div>
        <Button onClick={handleInviteTeamMember}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                  <select className="border border-border rounded px-2 py-1 text-sm">
                    <option value="admin" selected={member.role === 'Admin'}>Admin</option>
                    <option value="editor" selected={member.role === 'Editor'}>Editor</option>
                    <option value="viewer" selected={member.role === 'Viewer'}>Viewer</option>
                  </select>
                  <Button size="sm" variant="destructive">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'sms', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'marketing', label: 'Marketing Emails', description: 'Receive product updates and tips' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{notification.label}</h4>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[notification.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [notification.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', preview: 'bg-white border-2' },
            { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-2' },
            { value: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' }
          ].map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                theme === themeOption.value ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`w-full h-20 rounded mb-2 ${themeOption.preview}`}></div>
              <p className="font-medium">{themeOption.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile": return renderProfileSection();
      case "api": return renderApiSection();
      case "billing": return renderBillingSection();
      case "notifications": return renderNotificationsSection();
      case "appearance": return renderAppearanceSection();
      case "team": return renderTeamSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}