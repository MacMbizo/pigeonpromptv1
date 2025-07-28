import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Users,
  Globe,
  Award,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Eye,
  GitBranch
} from "lucide-react";
import CommunityFeatures from "@/components/CommunityFeatures";
import TeamCollaboration from "@/components/TeamCollaboration";

const stats = [
  {
    title: "Total Prompts",
    value: "12,847",
    change: "+2.4%",
    icon: Globe,
    color: "bg-blue-500"
  },
  {
    title: "Active Users",
    value: "8,392",
    change: "+12.3%",
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Downloads Today",
    value: "1,247",
    change: "+8.7%",
    icon: Download,
    color: "bg-purple-500"
  },
  {
    title: "Top Rated",
    value: "4.8★",
    change: "+0.2",
    icon: Star,
    color: "bg-orange-500"
  }
];

const featuredPrompts = [
  {
    id: "1",
    title: "Advanced Code Review Assistant",
    description: "Comprehensive code analysis with security checks and optimization suggestions.",
    author: "Alex Rodriguez",
    rating: 4.9,
    downloads: 2847,
    category: "Development",
    tags: ["Code Review", "Security", "Performance"]
  },
  {
    id: "2",
    title: "Creative Writing Companion",
    description: "Generate engaging stories, poems, and creative content with advanced prompts.",
    author: "Sarah Chen",
    rating: 4.8,
    downloads: 1923,
    category: "Creative",
    tags: ["Writing", "Storytelling", "Creative"]
  },
  {
    id: "3",
    title: "Business Strategy Analyzer",
    description: "Analyze market trends and generate strategic business insights.",
    author: "Michael Johnson",
    rating: 4.7,
    downloads: 1654,
    category: "Business",
    tags: ["Strategy", "Analysis", "Business"]
  }
];

export default function CommunityHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground mt-1">
            Discover, share, and collaborate on prompts with the community.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Share Prompt
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-600">{stat.change}</span> from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search prompts, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {["all", "trending", "new", "popular"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Featured Prompts</span>
          </CardTitle>
          <CardDescription>
            Hand-picked prompts from our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{prompt.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{prompt.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {prompt.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{prompt.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{prompt.author}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6">
          <CommunityFeatures />
        </TabsContent>
        
        <TabsContent value="collaborate" className="space-y-6">
          <TeamCollaboration />
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending This Week</span>
              </CardTitle>
              <CardDescription>
                Most popular prompts in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredPrompts.map((prompt, index) => (
                  <div key={prompt.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{prompt.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{prompt.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{prompt.downloads * 3}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}