// API Service Layer for AI Prompt Engineering Platform
// Provides RESTful endpoints and third-party integration capabilities

import { supabase } from '../lib/supabase';

export interface APIKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  permissions: string[];
  rateLimit: number;
  usageCount: number;
  lastUsed: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface APIRequest {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  requestBody?: any;
  responseStatus: number;
  responseTime: number;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

class APIService {
  private baseUrl: string;
  private version: string;

  constructor() {
    this.baseUrl = '/api';
    this.version = 'v1';
  }

  // API Key Management
  async generateAPIKey(userId: string, name: string, permissions: string[], rateLimit: number = 1000): Promise<APIKey> {
    const key = this.generateSecureKey();
    
    const apiKey: Omit<APIKey, 'id'> = {
      name,
      key: await this.hashKey(key),
      userId,
      permissions,
      rateLimit,
      usageCount: 0,
      lastUsed: new Date(),
      isActive: true,
      createdAt: new Date()
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert(apiKey)
      .select()
      .single();

    if (error) throw error;

    return { ...data, key }; // Return unhashed key only once
  }

  async listAPIKeys(userId: string): Promise<Omit<APIKey, 'key'>[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, userId, permissions, rateLimit, usageCount, lastUsed, expiresAt, isActive, createdAt')
      .eq('userId', userId)
      .eq('isActive', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async revokeAPIKey(keyId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .update({ isActive: false })
      .eq('id', keyId)
      .eq('userId', userId);

    if (error) throw error;
  }

  async validateAPIKey(key: string): Promise<APIKey | null> {
    const hashedKey = await this.hashKey(key);
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', hashedKey)
      .eq('isActive', true)
      .single();

    if (error || !data) return null;

    // Check expiration
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return null;
    }

    return data;
  }

  // Rate Limiting
  async checkRateLimit(apiKey: APIKey): Promise<RateLimitInfo> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour window

    const { data, error } = await supabase
      .from('api_requests')
      .select('id')
      .eq('apiKeyId', apiKey.id)
      .gte('timestamp', windowStart.toISOString());

    if (error) throw error;

    const currentUsage = data?.length || 0;
    const remaining = Math.max(0, apiKey.rateLimit - currentUsage);
    const resetTime = new Date(windowStart.getTime() + 60 * 60 * 1000);

    return {
      limit: apiKey.rateLimit,
      remaining,
      resetTime,
      retryAfter: remaining === 0 ? Math.ceil((resetTime.getTime() - now.getTime()) / 1000) : undefined
    };
  }

  async logAPIRequest(request: Omit<APIRequest, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('api_requests')
      .insert(request);

    if (error) throw error;

    // Update API key usage count
    await supabase
      .from('api_keys')
      .update({ 
        usageCount: supabase.sql`usage_count + 1`,
        lastUsed: new Date().toISOString()
      })
      .eq('id', request.apiKeyId);
  }

  // Public API Endpoints
  async executePrompt(apiKey: APIKey, promptData: any): Promise<any> {
    // Validate permissions
    if (!apiKey.permissions.includes('prompts:execute')) {
      throw new Error('Insufficient permissions');
    }

    // Execute prompt logic here
    const result = {
      id: this.generateId(),
      prompt: promptData.prompt,
      response: 'Generated response based on prompt',
      model: promptData.model || 'gpt-4o',
      tokens: {
        input: promptData.prompt.length / 4, // Rough estimate
        output: 150,
        total: (promptData.prompt.length / 4) + 150
      },
      timestamp: new Date().toISOString(),
      executionTime: Math.random() * 2000 + 500 // Simulated execution time
    };

    return result;
  }

  async listPrompts(apiKey: APIKey, filters?: any): Promise<any[]> {
    if (!apiKey.permissions.includes('prompts:read')) {
      throw new Error('Insufficient permissions');
    }

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('userId', apiKey.userId)
      .order('createdAt', { ascending: false })
      .limit(filters?.limit || 50);

    if (error) throw error;
    return data || [];
  }

  async createPrompt(apiKey: APIKey, promptData: any): Promise<any> {
    if (!apiKey.permissions.includes('prompts:write')) {
      throw new Error('Insufficient permissions');
    }

    const prompt = {
      ...promptData,
      userId: apiKey.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('prompts')
      .insert(prompt)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAnalytics(apiKey: APIKey, timeRange?: string): Promise<any> {
    if (!apiKey.permissions.includes('analytics:read')) {
      throw new Error('Insufficient permissions');
    }

    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const { data, error } = await supabase
      .from('api_requests')
      .select('*')
      .eq('apiKeyId', apiKey.id)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (error) throw error;

    return this.processAnalyticsData(data || []);
  }

  // Webhook Management
  async createWebhook(apiKey: APIKey, webhookData: any): Promise<any> {
    if (!apiKey.permissions.includes('webhooks:write')) {
      throw new Error('Insufficient permissions');
    }

    const webhook = {
      ...webhookData,
      userId: apiKey.userId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('webhooks')
      .insert(webhook)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async triggerWebhook(webhookId: string, payload: any): Promise<void> {
    const { data: webhook, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('id', webhookId)
      .eq('isActive', true)
      .single();

    if (error || !webhook) return;

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': await this.generateWebhookSignature(payload, webhook.secret)
        },
        body: JSON.stringify(payload)
      });

      // Log webhook delivery
      await supabase
        .from('webhook_deliveries')
        .insert({
          webhookId,
          payload,
          responseStatus: response.status,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Webhook delivery failed:', error);
    }
  }

  // SDK Generation
  generateJavaScriptSDK(): string {
    return `
// AI Prompt Engineering Platform JavaScript SDK
class PromptPlatformSDK {
  constructor(apiKey, baseUrl = 'http://localhost:5175/api/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(\`API Error: \${response.status} \${response.statusText}\`);
    }

    return response.json();
  }

  async executePrompt(prompt, model = 'gpt-4o') {
    return this.request('/prompts/execute', {
      method: 'POST',
      body: JSON.stringify({ prompt, model })
    });
  }

  async listPrompts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(\`/prompts?\${params}\`);
  }

  async createPrompt(promptData) {
    return this.request('/prompts', {
      method: 'POST',
      body: JSON.stringify(promptData)
    });
  }

  async getAnalytics(timeRange = '7d') {
    return this.request(\`/analytics?timeRange=\${timeRange}\`);
  }
}

module.exports = PromptPlatformSDK;
    `;
  }

  generatePythonSDK(): string {
    return `
# AI Prompt Engineering Platform Python SDK
import requests
import json
from typing import Dict, List, Optional

class PromptPlatformSDK:
    def __init__(self, api_key: str, base_url: str = "http://localhost:5175/api/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, endpoint: str, method: str = 'GET', data: Optional[Dict] = None) -> Dict:
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, json=data)
        response.raise_for_status()
        return response.json()

    def execute_prompt(self, prompt: str, model: str = 'gpt-4o') -> Dict:
        return self._request('/prompts/execute', 'POST', {
            'prompt': prompt,
            'model': model
        })

    def list_prompts(self, filters: Optional[Dict] = None) -> List[Dict]:
        endpoint = '/prompts'
        if filters:
            params = '&'.join([f"{k}={v}" for k, v in filters.items()])
            endpoint += f"?{params}"
        return self._request(endpoint)

    def create_prompt(self, prompt_data: Dict) -> Dict:
        return self._request('/prompts', 'POST', prompt_data)

    def get_analytics(self, time_range: str = '7d') -> Dict:
        return self._request(f'/analytics?timeRange={time_range}')
    `;
  }

  // Utility Methods
  private generateSecureKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'pk_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private processAnalyticsData(requests: APIRequest[]): any {
    const totalRequests = requests.length;
    const avgResponseTime = requests.reduce((sum, req) => sum + req.responseTime, 0) / totalRequests || 0;
    
    const statusCodes = requests.reduce((acc, req) => {
      acc[req.responseStatus] = (acc[req.responseStatus] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const endpointUsage = requests.reduce((acc, req) => {
      acc[req.endpoint] = (acc[req.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests,
      avgResponseTime,
      statusCodes,
      endpointUsage,
      timeRange: {
        start: requests[0]?.timestamp,
        end: requests[requests.length - 1]?.timestamp
      }
    };
  }

  private async generateWebhookSignature(payload: any, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(JSON.stringify(payload));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const apiService = new APIService();
export default APIService;