import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Crown,
  User,
  Mail,
  Calendar,
  Activity,
  Settings,
  UserPlus,
  Download,
  Upload
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'owner';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastActive: string;
  joinedAt: string;
  promptsCreated: number;
  executionsRun: number;
  avatar?: string;
  department?: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  owner: string;
  createdAt: string;
  status: 'active' | 'archived';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-15T10:30:00Z',
      joinedAt: '2024-01-01T00:00:00Z',
      promptsCreated: 45,
      executionsRun: 1234,
      department: 'Engineering',
      permissions: ['read', 'write', 'execute', 'admin']
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'editor',
      status: 'active',
      lastActive: '2024-01-15T09:15:00Z',
      joinedAt: '2024-01-02T00:00:00Z',
      promptsCreated: 32,
      executionsRun: 876,
      department: 'Product',
      permissions: ['read', 'write', 'execute']
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'viewer',
      status: 'active',
      lastActive: '2024-01-14T16:45:00Z',
      joinedAt: '2024-01-05T00:00:00Z',
      promptsCreated: 8,
      executionsRun: 234,
      department: 'Marketing',
      permissions: ['read']
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'editor',
      status: 'pending',
      lastActive: '2024-01-10T14:20:00Z',
      joinedAt: '2024-01-10T00:00:00Z',
      promptsCreated: 0,
      executionsRun: 0,
      department: 'Sales',
      permissions: ['read', 'write']
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'viewer',
      status: 'suspended',
      lastActive: '2024-01-08T11:30:00Z',
      joinedAt: '2024-01-03T00:00:00Z',
      promptsCreated: 12,
      executionsRun: 156,
      department: 'Support',
      permissions: ['read']
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Owner',
      description: 'Full system access with billing and user management',
      permissions: ['read', 'write', 'execute', 'admin', 'billing', 'user_management'],
      userCount: 1,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access to all features except billing',
      permissions: ['read', 'write', 'execute', 'admin', 'user_management'],
      userCount: 3,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: '3',
      name: 'Editor',
      description: 'Can create, edit, and execute prompts and workflows',
      permissions: ['read', 'write', 'execute'],
      userCount: 8,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to prompts and results',
      permissions: ['read'],
      userCount: 12,
      color: 'bg-gray-100 text-gray-800'
    }
  ]);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Engineering Team',
      description: 'Core development and technical implementation',
      memberCount: 8,
      owner: 'John Doe',
      createdAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Product Team',
      description: 'Product strategy and feature development',
      memberCount: 5,
      owner: 'Jane Smith',
      createdAt: '2024-01-02T00:00:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Marketing Team',
      description: 'Content creation and campaign management',
      memberCount: 4,
      owner: 'Mike Johnson',
      createdAt: '2024-01-03T00:00:00Z',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'editor':
        return <Edit className="h-4 w-4" />;
      case 'viewer':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const inviteUser = () => {
    toast.success('User invitation sent');
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User removed');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'active' ? 'suspended' : 'active'
          }
        : user
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and team access across your organization
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={inviteUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Teams</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">All Roles</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user accounts and their access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.name}</h3>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <Badge variant="secondary">{user.role}</Badge>
                            </div>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </span>
                            {user.department && (
                              <span>{user.department}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Prompts Created:</span>
                        <div className="font-medium">{user.promptsCreated}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Executions:</span>
                        <div className="font-medium">{user.executionsRun.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Joined:</span>
                        <div className="font-medium">{formatDate(user.joinedAt)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Active:</span>
                        <div className="font-medium">{formatDate(user.lastActive)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Define and manage user roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getRoleIcon(role.name.toLowerCase())}
                        </div>
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {role.userCount} users
                          </p>
                        </div>
                      </div>
                      <Badge className={role.color}>
                        {role.name}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Permissions:</span>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Organize users into teams for better collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{team.name}</h3>
                            <Badge className={getStatusColor(team.status)}>
                              {team.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {team.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Members:</span>
                        <div className="font-medium">{team.memberCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <div className="font-medium">{team.owner}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">{formatDate(team.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Overview of permissions across different roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Permission Management</h3>
                <p className="text-muted-foreground mb-4">
                  Configure granular permissions for different user roles and actions
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Configure Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}