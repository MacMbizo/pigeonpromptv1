import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Mail, 
  Calendar, 
  Clock, 
  Activity, 
  MessageSquare, 
  Share2, 
  Copy, 
  Download, 
  Upload, 
  GitBranch, 
  History, 
  Bell, 
  Search, 
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Owner" | "Admin" | "Editor" | "Viewer";
  status: "Active" | "Pending" | "Inactive";
  lastActive: string;
  joinedAt: string;
  promptsCreated: number;
  promptsShared: number;
}

interface TeamPrompt {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  collaborators: TeamMember[];
  status: "Draft" | "Review" | "Published" | "Archived";
  visibility: "Private" | "Team" | "Public";
  lastModified: string;
  version: string;
  comments: number;
  likes: number;
  category: string;
  tags: string[];
}

interface TeamActivity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "create" | "edit" | "comment" | "share" | "invite" | "approve";
}

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");

  const mockTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20team%20lead%20avatar&image_size=square",
      role: "Owner",
      status: "Active",
      lastActive: "2 minutes ago",
      joinedAt: "2024-01-01",
      promptsCreated: 45,
      promptsShared: 23
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20developer%20avatar&image_size=square",
      role: "Admin",
      status: "Active",
      lastActive: "1 hour ago",
      joinedAt: "2024-01-05",
      promptsCreated: 32,
      promptsShared: 18
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20designer%20avatar&image_size=square",
      role: "Editor",
      status: "Active",
      lastActive: "3 hours ago",
      joinedAt: "2024-01-10",
      promptsCreated: 28,
      promptsShared: 15
    },
    {
      id: "4",
      name: "David Kim",
      email: "david@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20analyst%20avatar&image_size=square",
      role: "Viewer",
      status: "Pending",
      lastActive: "Never",
      joinedAt: "2024-01-20",
      promptsCreated: 0,
      promptsShared: 0
    }
  ];

  const mockTeamPrompts: TeamPrompt[] = [
    {
      id: "1",
      title: "Customer Support Response Templates",
      description: "Comprehensive templates for handling various customer support scenarios with empathy and efficiency.",
      author: {
        name: "Sarah Johnson",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20team%20lead%20avatar&image_size=square"
      },
      collaborators: mockTeamMembers.slice(0, 3),
      status: "Published",
      visibility: "Team",
      lastModified: "2 hours ago",
      version: "v2.1",
      comments: 8,
      likes: 15,
      category: "Customer Service",
      tags: ["Support", "Templates", "Communication"]
    },
    {
      id: "2",
      title: "Marketing Campaign Generator",
      description: "AI-powered prompts for creating engaging marketing campaigns across different channels and audiences.",
      author: {
        name: "Mike Chen",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20developer%20avatar&image_size=square"
      },
      collaborators: [mockTeamMembers[0], mockTeamMembers[2]],
      status: "Review",
      visibility: "Private",
      lastModified: "1 day ago",
      version: "v1.3",
      comments: 12,
      likes: 8,
      category: "Marketing",
      tags: ["Campaigns", "Social Media", "Content"]
    },
    {
      id: "3",
      title: "Code Documentation Assistant",
      description: "Automated documentation generation for various programming languages with best practices.",
      author: {
        name: "Emily Rodriguez",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20designer%20avatar&image_size=square"
      },
      collaborators: [mockTeamMembers[1]],
      status: "Draft",
      visibility: "Private",
      lastModified: "3 days ago",
      version: "v0.8",
      comments: 5,
      likes: 3,
      category: "Development",
      tags: ["Documentation", "Code", "Automation"]
    }
  ];

  const mockActivities: TeamActivity[] = [
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20team%20lead%20avatar&image_size=square"
      },
      action: "published",
      target: "Customer Support Response Templates",
      timestamp: "2 hours ago",
      type: "approve"
    },
    {
      id: "2",
      user: {
        name: "Mike Chen",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20developer%20avatar&image_size=square"
      },
      action: "commented on",
      target: "Marketing Campaign Generator",
      timestamp: "4 hours ago",
      type: "comment"
    },
    {
      id: "3",
      user: {
        name: "Emily Rodriguez",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20designer%20avatar&image_size=square"
      },
      action: "created",
      target: "Code Documentation Assistant",
      timestamp: "1 day ago",
      type: "create"
    },
    {
      id: "4",
      user: {
        name: "Sarah Johnson",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20team%20lead%20avatar&image_size=square"
      },
      action: "invited",
      target: "David Kim to join the team",
      timestamp: "2 days ago",
      type: "invite"
    }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "members", label: "Team Members", icon: Users },
    { id: "prompts", label: "Team Prompts", icon: MessageSquare },
    { id: "activity", label: "Activity", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "bg-purple-100 text-purple-800";
      case "Admin": return "bg-blue-100 text-blue-800";
      case "Editor": return "bg-green-100 text-green-800";
      case "Viewer": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPromptStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "Review": return "bg-yellow-100 text-yellow-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Archived": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRemoveMember = (memberId: string) => {
    toast.success("Member removed from team");
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    toast.success(`Role updated to ${newRole}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Team Collaboration
          </h2>
          <p className="text-gray-600">Manage your team and collaborate on prompts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm" onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTeamMembers.length}</div>
                <div className="text-xs text-gray-500">
                  {mockTeamMembers.filter(m => m.status === "Active").length} active
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Team Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTeamPrompts.length}</div>
                <div className="text-xs text-gray-500">
                  {mockTeamPrompts.filter(p => p.status === "Published").length} published
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTeamPrompts.reduce((sum, p) => sum + p.likes, 0)}
                </div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this week
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTeamPrompts.reduce((sum, p) => sum + p.comments, 0)}
                </div>
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Active discussions
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>
                          {" "}{activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "create" ? "bg-green-500" :
                        activity.type === "edit" ? "bg-blue-500" :
                        activity.type === "comment" ? "bg-yellow-500" :
                        activity.type === "share" ? "bg-purple-500" :
                        activity.type === "invite" ? "bg-orange-500" :
                        "bg-gray-500"
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Members ({mockTeamMembers.length})</h3>
              <Button onClick={() => setShowInviteModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>
            
            <div className="grid gap-4">
              {mockTeamMembers.map(member => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Last active: {member.lastActive}</p>
                          <p className="text-gray-500">Joined: {member.joinedAt}</p>
                        </div>
                        
                        <div className="text-right text-sm">
                          <p className="font-medium">{member.promptsCreated} prompts</p>
                          <p className="text-gray-500">{member.promptsShared} shared</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "prompts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Prompts ({mockTeamPrompts.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Prompt
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {mockTeamPrompts.map(prompt => (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-lg">{prompt.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPromptStatusColor(prompt.status)}`}>
                            {prompt.status}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {prompt.visibility}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{prompt.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <img
                              src={prompt.author.avatar}
                              alt={prompt.author.name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>{prompt.author.name}</span>
                          </div>
                          <span>v{prompt.version}</span>
                          <span>{prompt.lastModified}</span>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{prompt.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>{prompt.likes}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {prompt.category}
                          </span>
                          {prompt.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {prompt.collaborators.slice(0, 3).map(collaborator => (
                            <img
                              key={collaborator.id}
                              src={collaborator.avatar}
                              alt={collaborator.name}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              title={collaborator.name}
                            />
                          ))}
                          {prompt.collaborators.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                              +{prompt.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Team Activity</h3>
            
            <div className="space-y-4">
              {mockActivities.map(activity => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>
                          {" "}{activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === "create" ? "bg-green-500" :
                        activity.type === "edit" ? "bg-blue-500" :
                        activity.type === "comment" ? "bg-yellow-500" :
                        activity.type === "share" ? "bg-purple-500" :
                        activity.type === "invite" ? "bg-orange-500" :
                        "bg-gray-500"
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Team Settings</h3>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                  <CardDescription>Manage your team's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Team Name</label>
                    <input 
                      type="text" 
                      defaultValue="Marketing Team" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      defaultValue="Our marketing team creates and manages all promotional content and campaigns."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Configure team member permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow members to invite others</h4>
                        <p className="text-sm text-gray-600">Team members can send invitations to new members</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Auto-approve prompt publications</h4>
                        <p className="text-sm text-gray-600">Prompts are automatically published without review</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Allow external sharing</h4>
                        <p className="text-sm text-gray-600">Members can share prompts outside the team</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                  <Button>Update Permissions</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Invite Team Member</h3>
                <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Viewer">Viewer - Can view prompts</option>
                    <option value="Editor">Editor - Can create and edit prompts</option>
                    <option value="Admin">Admin - Can manage team and prompts</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleInviteMember}
                  >
                    Send Invitation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCollaboration;