import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Share2, 
  Settings, 
  Crown, 
  Shield, 
  Eye,
  Edit,
  Trash2,
  Clock,
  Send,
  AtSign,
  Bell
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "admin" | "editor" | "viewer";
  lastActive: string;
  status: "online" | "offline" | "away";
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: string;
  replies?: Comment[];
  mentions?: string[];
}

interface CollaborationPanelProps {
  promptId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationPanel = ({ promptId, isOpen, onClose }: CollaborationPanelProps) => {
  const [activeTab, setActiveTab] = useState<"team" | "comments" | "sharing">("team");
  const [newComment, setNewComment] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const mockTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20avatar%20headshot%20smiling&image_size=square",
      role: "owner",
      lastActive: "now",
      status: "online"
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      email: "alex@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20developer%20avatar%20headshot&image_size=square",
      role: "admin",
      lastActive: "5 min ago",
      status: "away"
    },
    {
      id: "3",
      name: "Emily Watson",
      email: "emily@company.com",
      avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20scientist%20avatar%20headshot&image_size=square",
      role: "editor",
      lastActive: "2 hours ago",
      status: "offline"
    }
  ];

  const mockComments: Comment[] = [
    {
      id: "1",
      author: mockTeamMembers[1],
      content: "This prompt works great for customer service scenarios. Maybe we should add more context about tone?",
      timestamp: "2 hours ago",
      mentions: ["sarah"]
    },
    {
      id: "2",
      author: mockTeamMembers[2],
      content: "I tested this with different models and GPT-4 gives the best results. Should we specify that in the documentation?",
      timestamp: "1 hour ago",
      replies: [
        {
          id: "2-1",
          author: mockTeamMembers[0],
          content: "Good point! I'll add that to the model recommendations section.",
          timestamp: "45 min ago"
        }
      ]
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "admin": return <Shield className="w-4 h-4 text-blue-500" />;
      case "editor": return <Edit className="w-4 h-4 text-green-500" />;
      case "viewer": return <Eye className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const handleInviteMember = () => {
    if (inviteEmail) {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      toast.success("Comment added successfully");
      setNewComment("");
    }
  };

  const handleSharePrompt = () => {
    navigator.clipboard.writeText(`https://pigeonprompt.com/prompts/${promptId}`);
    toast.success("Share link copied to clipboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Collaboration</h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "team", label: "Team", icon: Users },
            { id: "comments", label: "Comments", icon: MessageCircle },
            { id: "sharing", label: "Sharing", icon: Share2 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "comments" && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {mockComments.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "team" && (
            <div className="space-y-6">
              {/* Invite Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Invite Team Members
                  </CardTitle>
                  <CardDescription>
                    Add collaborators to work together on this prompt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button onClick={handleInviteMember}>
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members ({mockTeamMembers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTeamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              {getRoleIcon(member.role)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email} • {member.lastActive}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 capitalize">{member.role}</span>
                          {member.role !== "owner" && (
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-6">
              {/* Add Comment */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add a comment... Use @username to mention team members"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AtSign className="w-4 h-4" />
                        <span>Use @ to mention team members</span>
                      </div>
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {mockComments.map(comment => (
                  <Card key={comment.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.author.name}</span>
                              {getRoleIcon(comment.author.role)}
                              <span className="text-sm text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                            {comment.mentions && (
                              <div className="flex items-center gap-1 mt-2">
                                <Bell className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-600">
                                  Mentioned {comment.mentions.join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Replies */}
                        {comment.replies && (
                          <div className="ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <img
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.author.name}</span>
                                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button className="hover:text-blue-600">Reply</button>
                          <button className="hover:text-blue-600">Like</button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sharing" && (
            <div className="space-y-6">
              {/* Public Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Public Sharing</CardTitle>
                  <CardDescription>
                    Control how this prompt can be discovered and used by others
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Make prompt public</h4>
                      <p className="text-sm text-gray-500">Allow others to discover and use this prompt</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Allow forking</h4>
                      <p className="text-sm text-gray-500">Let others create their own versions</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show in community hub</h4>
                      <p className="text-sm text-gray-500">Feature in the public prompt library</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                </CardContent>
              </Card>

              {/* Share Link */}
              <Card>
                <CardHeader>
                  <CardTitle>Share Link</CardTitle>
                  <CardDescription>
                    Share this prompt with specific people
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`https://pigeonprompt.com/prompts/${promptId}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <Button onClick={handleSharePrompt}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Anyone with this link can view the prompt
                  </p>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Export & Integration</CardTitle>
                  <CardDescription>
                    Export this prompt for use in other tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      Export as JSON
                    </Button>
                    <Button variant="outline">
                      Export as YAML
                    </Button>
                    <Button variant="outline">
                      Generate API Code
                    </Button>
                    <Button variant="outline">
                      Create Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;