import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types for different LLM providers
export interface LLMProvider {
  id: string;
  name: string;
  models: LLMModel[];
  apiKeyRequired: boolean;
  baseUrl?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  inputCostPer1K: number;
  outputCostPer1K: number;
  supportsStreaming: boolean;
  supportsVision?: boolean;
  contextWindow: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface LLMResponse {
  id: string;
  model: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  timestamp: number;
}

export interface StreamChunk {
  content: string;
  finished: boolean;
}

// Available LLM providers and models
const PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    apiKeyRequired: true,
    baseUrl: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 4096,
        inputCostPer1K: 0.005,
        outputCostPer1K: 0.015,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 128000
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 16384,
        inputCostPer1K: 0.00015,
        outputCostPer1K: 0.0006,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 128000
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        maxTokens: 4096,
        inputCostPer1K: 0.0005,
        outputCostPer1K: 0.0015,
        supportsStreaming: true,
        contextWindow: 16385
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    apiKeyRequired: true,
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        maxTokens: 8192,
        inputCostPer1K: 0.003,
        outputCostPer1K: 0.015,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 200000
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        maxTokens: 4096,
        inputCostPer1K: 0.00025,
        outputCostPer1K: 0.00125,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 200000
      }
    ]
  },
  {
    id: 'google',
    name: 'Google',
    apiKeyRequired: true,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        maxTokens: 8192,
        inputCostPer1K: 0.00125,
        outputCostPer1K: 0.005,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 2000000
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        maxTokens: 8192,
        inputCostPer1K: 0.000075,
        outputCostPer1K: 0.0003,
        supportsStreaming: true,
        supportsVision: true,
        contextWindow: 1000000
      }
    ]
  }
];

// Context for LLM provider
interface LLMContextType {
  providers: LLMProvider[];
  selectedModel: LLMModel | null;
  apiKeys: Record<string, string>;
  setSelectedModel: (model: LLMModel) => void;
  setApiKey: (provider: string, apiKey: string) => void;
  sendMessage: (request: LLMRequest) => Promise<LLMResponse>;
  sendStreamingMessage: (request: LLMRequest, onChunk: (chunk: StreamChunk) => void) => Promise<LLMResponse>;
  calculateCost: (model: LLMModel, promptTokens: number, completionTokens: number) => number;
  isProviderConfigured: (providerId: string) => boolean;
  getAvailableModels: () => LLMModel[];
}

const LLMContext = createContext<LLMContextType | undefined>(undefined);

// Custom hook to use LLM context
export const useLLM = () => {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within an LLMProvider');
  }
  return context;
};

// Token estimation utility
const estimateTokens = (text: string): number => {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
};

// LLM Provider component
interface LLMProviderProps {
  children: ReactNode;
}

export const LLMProvider: React.FC<LLMProviderProps> = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  // Load saved API keys and selected model from localStorage
  useEffect(() => {
    const savedApiKeys = localStorage.getItem('llm-api-keys');
    if (savedApiKeys) {
      try {
        setApiKeys(JSON.parse(savedApiKeys));
      } catch (error) {
        console.error('Failed to parse saved API keys:', error);
      }
    }

    const savedModelId = localStorage.getItem('llm-selected-model');
    if (savedModelId) {
      const model = PROVIDERS.flatMap(p => p.models).find(m => m.id === savedModelId);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, []);

  // Save API keys to localStorage
  const handleSetApiKey = (provider: string, apiKey: string) => {
    const newApiKeys = { ...apiKeys, [provider]: apiKey };
    setApiKeys(newApiKeys);
    localStorage.setItem('llm-api-keys', JSON.stringify(newApiKeys));
  };

  // Save selected model to localStorage
  const handleSetSelectedModel = (model: LLMModel) => {
    setSelectedModel(model);
    localStorage.setItem('llm-selected-model', model.id);
  };

  // Check if provider is configured
  const isProviderConfigured = (providerId: string): boolean => {
    const provider = PROVIDERS.find(p => p.id === providerId);
    if (!provider) return false;
    if (!provider.apiKeyRequired) return true;
    return !!apiKeys[providerId];
  };

  // Get available models (only from configured providers)
  const getAvailableModels = (): LLMModel[] => {
    return PROVIDERS
      .filter(provider => isProviderConfigured(provider.id))
      .flatMap(provider => provider.models);
  };

  // Calculate cost for a request
  const calculateCost = (model: LLMModel, promptTokens: number, completionTokens: number): number => {
    const inputCost = (promptTokens / 1000) * model.inputCostPer1K;
    const outputCost = (completionTokens / 1000) * model.outputCostPer1K;
    return inputCost + outputCost;
  };

  // Send message to OpenAI
  const sendOpenAIMessage = async (request: LLMRequest): Promise<LLMResponse> => {
    const apiKey = apiKeys.openai;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
        stream: false,
        top_p: request.topP,
        frequency_penalty: request.frequencyPenalty,
        presence_penalty: request.presencePenalty
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const model = PROVIDERS.find(p => p.id === 'openai')?.models.find(m => m.id === request.model);
    
    return {
      id: data.id,
      model: request.model,
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
        cost: model ? calculateCost(model, data.usage.prompt_tokens, data.usage.completion_tokens) : 0
      },
      finishReason: data.choices[0].finish_reason,
      timestamp: Date.now()
    };
  };

  // Send message to Anthropic
  const sendAnthropicMessage = async (request: LLMRequest): Promise<LLMResponse> => {
    const apiKey = apiKeys.anthropic;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert messages format for Anthropic
    const systemMessage = request.messages.find(m => m.role === 'system');
    const messages = request.messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature || 0.7,
        system: systemMessage?.content,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API request failed');
    }

    const data = await response.json();
    const model = PROVIDERS.find(p => p.id === 'anthropic')?.models.find(m => m.id === request.model);
    
    return {
      id: data.id,
      model: request.model,
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        cost: model ? calculateCost(model, data.usage.input_tokens, data.usage.output_tokens) : 0
      },
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
      timestamp: Date.now()
    };
  };

  // Send message to Google
  const sendGoogleMessage = async (request: LLMRequest): Promise<LLMResponse> => {
    const apiKey = apiKeys.google;
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // Convert messages format for Google
    const contents = request.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 4096,
          topP: request.topP
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Google API request failed');
    }

    const data = await response.json();
    const model = PROVIDERS.find(p => p.id === 'google')?.models.find(m => m.id === request.model);
    
    // Estimate tokens for Google (they don't provide usage info in basic API)
    const promptTokens = estimateTokens(request.messages.map(m => m.content).join(' '));
    const completionTokens = estimateTokens(data.candidates[0].content.parts[0].text);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      model: request.model,
      content: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        cost: model ? calculateCost(model, promptTokens, completionTokens) : 0
      },
      finishReason: data.candidates[0].finishReason === 'STOP' ? 'stop' : 'length',
      timestamp: Date.now()
    };
  };

  // Main send message function
  const sendMessage = async (request: LLMRequest): Promise<LLMResponse> => {
    if (!selectedModel) {
      throw new Error('No model selected');
    }

    try {
      switch (selectedModel.provider) {
        case 'openai':
          return await sendOpenAIMessage(request);
        case 'anthropic':
          return await sendAnthropicMessage(request);
        case 'google':
          return await sendGoogleMessage(request);
        default:
          throw new Error(`Unsupported provider: ${selectedModel.provider}`);
      }
    } catch (error) {
      console.error('LLM request failed:', error);
      toast.error(`LLM request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  // Streaming message (simplified implementation)
  const sendStreamingMessage = async (
    request: LLMRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<LLMResponse> => {
    // For now, simulate streaming by sending the full response in chunks
    const response = await sendMessage({ ...request, stream: false });
    
    // Simulate streaming by sending content in chunks
    const content = response.content;
    const chunkSize = 10;
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      const isFinished = i + chunkSize >= content.length;
      
      onChunk({
        content: chunk,
        finished: isFinished
      });
      
      // Add small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return response;
  };

  const contextValue: LLMContextType = {
    providers: PROVIDERS,
    selectedModel,
    apiKeys,
    setSelectedModel: handleSetSelectedModel,
    setApiKey: handleSetApiKey,
    sendMessage,
    sendStreamingMessage,
    calculateCost,
    isProviderConfigured,
    getAvailableModels
  };

  return (
    <LLMContext.Provider value={contextValue}>
      {children}
    </LLMContext.Provider>
  );
};

export default LLMProvider;