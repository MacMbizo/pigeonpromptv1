import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  RotateCcw,
  Copy,
  Download,
  BarChart3,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  Target,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

interface Model {
  id: string;
  name: string;
  provider: string;
  cost: string;
}

interface TestResult {
  id: string;
  model: string;
  prompt: string;
  response: string;
  tokens: number;
  latency: number;
  cost: string;
  timestamp: Date;
  quality?: number;
}

interface ABTest {
  id: string;
  name: string;
  promptA: string;
  promptB: string;
  results: {
    a: TestResult[];
    b: TestResult[];
  };
  metrics: {
    avgLatencyA: number;
    avgLatencyB: number;
    avgCostA: number;
    avgCostB: number;
    winnerA: number;
    winnerB: number;
  };
}

interface TestingPlaygroundProps {
  prompt: string;
  variables: Record<string, string>;
  models: Model[];
}

export default function TestingPlayground({ prompt, variables, models }: TestingPlaygroundProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o"]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [showABTest, setShowABTest] = useState(false);
  const [abTestPromptB, setAbTestPromptB] = useState("");
  const [currentABTest, setCurrentABTest] = useState<ABTest | null>(null);

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const runTests = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    if (selectedModels.length === 0) {
      toast.error("Please select at least one model");
      return;
    }

    setIsRunning(true);
    const newResults: TestResult[] = [];

    // Simulate running tests on multiple models
    for (const modelId of selectedModels) {
      const model = models.find(m => m.id === modelId);
      if (!model) continue;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const result: TestResult = {
        id: `${Date.now()}-${modelId}`,
        model: model.name,
        prompt: prompt,
        response: `This is a simulated response from ${model.name}. The response quality and characteristics would vary based on the actual model capabilities and the specific prompt provided.`,
        tokens: Math.floor(Math.random() * 500) + 100,
        latency: Math.floor(Math.random() * 3000) + 500,
        cost: (Math.random() * 0.1).toFixed(4),
        timestamp: new Date(),
        quality: Math.floor(Math.random() * 30) + 70 // 70-100 quality score
      };

      newResults.push(result);
    }

    setResults(prev => [...newResults, ...prev]);
    setIsRunning(false);
    toast.success(`Tests completed for ${selectedModels.length} models`);
  };

  const startABTest = () => {
    if (!prompt.trim() || !abTestPromptB.trim()) {
      toast.error("Please provide both prompt variants");
      return;
    }

    const newABTest: ABTest = {
      id: Date.now().toString(),
      name: `A/B Test ${abTests.length + 1}`,
      promptA: prompt,
      promptB: abTestPromptB,
      results: { a: [], b: [] },
      metrics: {
        avgLatencyA: 0,
        avgLatencyB: 0,
        avgCostA: 0,
        avgCostB: 0,
        winnerA: 0,
        winnerB: 0
      }
    };

    setAbTests(prev => [...prev, newABTest]);
    setCurrentABTest(newABTest);
    toast.success("A/B test created successfully");
  };

  const runABTest = async () => {
    if (!currentABTest) return;

    setIsRunning(true);
    
    // Simulate running both variants
    const testRuns = 5; // Run each variant 5 times
    const resultsA: TestResult[] = [];
    const resultsB: TestResult[] = [];

    for (let i = 0; i < testRuns; i++) {
      // Test variant A
      const resultA: TestResult = {
        id: `${Date.now()}-a-${i}`,
        model: selectedModels[0] || "gpt-4o",
        prompt: currentABTest.promptA,
        response: `Response A-${i + 1}: Simulated response for variant A`,
        tokens: Math.floor(Math.random() * 200) + 150,
        latency: Math.floor(Math.random() * 2000) + 800,
        cost: (Math.random() * 0.05).toFixed(4),
        timestamp: new Date(),
        quality: Math.floor(Math.random() * 20) + 75
      };
      resultsA.push(resultA);

      // Test variant B
      const resultB: TestResult = {
        id: `${Date.now()}-b-${i}`,
        model: selectedModels[0] || "gpt-4o",
        prompt: currentABTest.promptB,
        response: `Response B-${i + 1}: Simulated response for variant B`,
        tokens: Math.floor(Math.random() * 200) + 150,
        latency: Math.floor(Math.random() * 2000) + 800,
        cost: (Math.random() * 0.05).toFixed(4),
        timestamp: new Date(),
        quality: Math.floor(Math.random() * 20) + 70
      };
      resultsB.push(resultB);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Calculate metrics
    const avgLatencyA = resultsA.reduce((sum, r) => sum + r.latency, 0) / resultsA.length;
    const avgLatencyB = resultsB.reduce((sum, r) => sum + r.latency, 0) / resultsB.length;
    const avgCostA = resultsA.reduce((sum, r) => sum + parseFloat(r.cost), 0) / resultsA.length;
    const avgCostB = resultsB.reduce((sum, r) => sum + parseFloat(r.cost), 0) / resultsB.length;
    const avgQualityA = resultsA.reduce((sum, r) => sum + (r.quality || 0), 0) / resultsA.length;
    const avgQualityB = resultsB.reduce((sum, r) => sum + (r.quality || 0), 0) / resultsB.length;

    const updatedTest: ABTest = {
      ...currentABTest,
      results: { a: resultsA, b: resultsB },
      metrics: {
        avgLatencyA,
        avgLatencyB,
        avgCostA,
        avgCostB,
        winnerA: avgQualityA > avgQualityB ? 1 : 0,
        winnerB: avgQualityB > avgQualityA ? 1 : 0
      }
    };

    setAbTests(prev => prev.map(test => test.id === currentABTest.id ? updatedTest : test));
    setCurrentABTest(updatedTest);
    setIsRunning(false);
    toast.success("A/B test completed");
  };

  const copyResult = (result: TestResult) => {
    navigator.clipboard.writeText(result.response);
    toast.success("Response copied to clipboard");
  };

  const exportResults = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-results.json';
    a.click();
    toast.success("Results exported");
  };

  return (
    <div className="w-96 flex flex-col">
      {/* Model Selection */}
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-medium mb-3">Model Selection</h3>
        <div className="space-y-2">
          {models.map((model) => (
            <label key={model.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedModels.includes(model.id)}
                onChange={() => handleModelToggle(model.id)}
                className="rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground">{model.provider} • {model.cost}</div>
              </div>
            </label>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning || selectedModels.length === 0}
            className="w-full"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Multi-Model Test
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowABTest(!showABTest)}
            className="w-full"
          >
            <Target className="h-4 w-4 mr-2" />
            A/B Test
          </Button>
        </div>
      </div>

      {/* A/B Testing Panel */}
      {showABTest && (
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium mb-3">A/B Testing</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Variant B Prompt</label>
              <textarea
                value={abTestPromptB}
                onChange={(e) => setAbTestPromptB(e.target.value)}
                placeholder="Enter alternative prompt..."
                className="w-full h-20 p-2 text-xs border border-border rounded resize-none"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" onClick={startABTest} className="flex-1">
                <Shuffle className="h-3 w-3 mr-1" />
                Create Test
              </Button>
              {currentABTest && (
                <Button size="sm" onClick={runABTest} disabled={isRunning} className="flex-1">
                  <Play className="h-3 w-3 mr-1" />
                  Run Test
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* A/B Test Results */}
      {currentABTest && currentABTest.results.a.length > 0 && (
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium mb-3">A/B Test Results</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-blue-50 rounded">
                <div className="font-medium">Variant A</div>
                <div>Avg Latency: {currentABTest.metrics.avgLatencyA.toFixed(0)}ms</div>
                <div>Avg Cost: ${currentABTest.metrics.avgCostA.toFixed(4)}</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="font-medium">Variant B</div>
                <div>Avg Latency: {currentABTest.metrics.avgLatencyB.toFixed(0)}ms</div>
                <div>Avg Cost: ${currentABTest.metrics.avgCostB.toFixed(4)}</div>
              </div>
            </div>
            
            <div className="text-xs text-center p-2 bg-muted rounded">
              {currentABTest.metrics.winnerA > currentABTest.metrics.winnerB 
                ? "🏆 Variant A performs better" 
                : "🏆 Variant B performs better"}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Test Results</h3>
          {results.length > 0 && (
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setResults([])}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Run tests to see results here
            </div>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="text-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{result.model}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {result.quality && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {result.quality}%
                        </div>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => copyResult(result)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted p-2 rounded text-xs mb-2 max-h-20 overflow-y-auto">
                    {result.response}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span>{result.tokens} tokens</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {result.latency}ms
                      </span>
                    </div>
                    <span className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {result.cost}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}