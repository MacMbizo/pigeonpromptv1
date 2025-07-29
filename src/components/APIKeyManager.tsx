import React, { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Plus, Eye, EyeOff, Activity, Clock, Shield, AlertTriangle } from 'lucide-react';
import { apiService, APIKey, RateLimitInfo } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface APIKeyWithStats extends Omit<APIKey, 'key'> {
  key?: string;
  rateLimit?: RateLimitInfo;
}

const APIKeyManager: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKeyWithStats[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000
  });
  const [showKey, setShowKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const availablePermissions = [
    { id: 'prompts:read', label: 'Read Prompts', description: 'View and list prompts' },
    { id: 'prompts:write', label: 'Write Prompts', description: 'Create and modify prompts' },
    { id: 'prompts:execute', label: 'Execute Prompts', description: 'Run prompt executions' },
    { id: 'analytics:read', label: 'Read Analytics', description: 'Access usage analytics' },
    { id: 'webhooks:read', label: 'Read Webhooks', description: 'View webhook configurations' },
    { id: 'webhooks:write', label: 'Write Webhooks', description: 'Create and modify webhooks' }
  ];

  useEffect(() => {
    if (user) {
      loadAPIKeys();
    }
  }, [user]);

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiService.listAPIKeys(user!.id);
      
      // Load rate limit info for each key
      const keysWithStats = await Promise.all(
        keys.map(async (key) => {
          try {
            const rateLimit = await apiService.checkRateLimit(key as APIKey);
            return { ...key, rateLimit };
          } catch {
            return key;
          }
        })
      );
      
      setApiKeys(keysWithStats);
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAPIKey = async () => {
    if (!newKeyData.name.trim()) {
      setError('API key name is required');
      return;
    }

    if (newKeyData.permissions.length === 0) {
      setError('At least one permission is required');
      return;
    }

    try {
      setLoading(true);
      const newKey = await apiService.generateAPIKey(
        user!.id,
        newKeyData.name,
        newKeyData.permissions,
        newKeyData.rateLimit
      );
      
      setApiKeys(prev => [{ ...newKey, rateLimit: undefined }, ...prev]);
      setShowKey(newKey.id);
      setIsCreating(false);
      setNewKeyData({ name: '', permissions: [], rateLimit: 1000 });
      setError(null);
    } catch (err) {
      setError('Failed to create API key');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const revokeAPIKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.revokeAPIKey(keyId, user!.id);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (err) {
      setError('Failed to revoke API key');
      console.error(err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const togglePermission = (permission: string) => {
    setNewKeyData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRateLimitStatus = (rateLimit?: RateLimitInfo) => {
    if (!rateLimit) return { color: 'text-gray-500', text: 'Unknown' };
    
    const percentage = (rateLimit.remaining / rateLimit.limit) * 100;
    
    if (percentage > 50) {
      return { color: 'text-green-600', text: `${rateLimit.remaining}/${rateLimit.limit}` };
    } else if (percentage > 20) {
      return { color: 'text-yellow-600', text: `${rateLimit.remaining}/${rateLimit.limit}` };
    } else {
      return { color: 'text-red-600', text: `${rateLimit.remaining}/${rateLimit.limit}` };
    }
  };

  if (loading && apiKeys.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Key Management</h2>
          <p className="text-gray-600 mt-1">
            Create and manage API keys for third-party integrations
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Create API Key Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Production API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newKeyData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-sm">{permission.label}</div>
                        <div className="text-xs text-gray-500">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Limit (requests per hour)
                </label>
                <input
                  type="number"
                  value={newKeyData.rateLimit}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, rateLimit: parseInt(e.target.value) || 1000 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="10000"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={createAPIKey}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Key'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewKeyData({ name: '', permissions: [], rateLimit: 1000 });
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
            <p className="text-gray-600 mb-4">
              Create your first API key to start integrating with the platform
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create API Key
            </button>
          </div>
        ) : (
          apiKeys.map(apiKey => {
            const rateLimitStatus = getRateLimitStatus(apiKey.rateLimit);
            
            return (
              <div key={apiKey.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                      {apiKey.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Revoked
                        </span>
                      )}
                    </div>
                    
                    {/* API Key Display */}
                    {showKey === apiKey.id && apiKey.key ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-gray-800 break-all">
                            {apiKey.key}
                          </code>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => copyToClipboard(apiKey.key!)}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowKey(null)}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                              title="Hide key"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-red-600 mt-2">
                          ⚠️ This key will only be shown once. Make sure to copy it now.
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <button
                          onClick={() => setShowKey(apiKey.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Show API Key
                        </button>
                      </div>
                    )}

                    {/* Permissions */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Permissions:</div>
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map(permission => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium">{apiKey.usageCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Rate Limit:</span>
                        <span className={`font-medium ${rateLimitStatus.color}`}>
                          {rateLimitStatus.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Last Used:</span>
                        <span className="font-medium">{formatDate(apiKey.lastUsed)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(apiKey.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => revokeAPIKey(apiKey.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke API Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SDK Documentation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SDK Integration</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">JavaScript/Node.js</h4>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`npm install @prompt-platform/sdk

const SDK = require('@prompt-platform/sdk');
const client = new SDK('your-api-key');

const result = await client.executePrompt(
  'Analyze this code for bugs',
  'gpt-4o'
);`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Python</h4>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
{`pip install prompt-platform-sdk

from prompt_platform import SDK
client = SDK('your-api-key')

result = client.execute_prompt(
    'Analyze this code for bugs',
    model='gpt-4o'
)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;