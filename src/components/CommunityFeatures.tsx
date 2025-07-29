import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Award, 
  Users, 
  Eye, 
  Download, 
  GitBranch,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Crown,
  Zap,
  Calendar,
  Tag
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface CommunityPrompt {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    reputation: number;
  };
  category: string;
  tags: string[];
  rating: number;
  totalRatings: number;
  likes: number;
  downloads: number;
  forks: number;
  comments: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimatedTime: string;
  isFeatured: boolean;
  isTrending: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
}

interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  timestamp: string;
  helpful: number;
  isHelpful: boolean;
}

const CommunityFeatures = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<CommunityPrompt | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    category: "all",
    difficulty: "all",
    rating: "all",
    tags: "",
    author: "",
    dateRange: "all"
  });

  const mockPrompts: CommunityPrompt[] = [
    {
      id: "1",
      title: "Advanced Content Generator",
      description: "Create engaging, SEO-optimized content for blogs, social media, and marketing campaigns with brand voice consistency.",
      author: {
        name: "Sarah Chen",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20content%20creator%20avatar&image_size=square",
        verified: true,
        reputation: 4850
      },
      category: "Content Creation",
      tags: ["SEO", "Marketing", "Blog", "Social Media", "Brand Voice"],
      rating: 4.8,
      totalRatings: 156,
      likes: 342,
      downloads: 1250,
      forks: 89,
      comments: 45,
      views: 5670,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      difficulty: "Intermediate",
      estimatedTime: "5-10 min",
      isFeatured: true,
      isTrending: true,
      isBookmarked: false,
      isLiked: false
    },
    {
      id: "2",
      title: "Code Review Assistant Pro",
      description: "Comprehensive code analysis with security checks, performance optimization suggestions, and best practice recommendations.",
      author: {
        name: "Alex Rodriguez",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20developer%20avatar&image_size=square",
        verified: true,
        reputation: 6200
      },
      category: "Development",
      tags: ["Code Review", "Security", "Performance", "Best Practices", "Quality"],
      rating: 4.9,
      totalRatings: 203,
      likes: 567,
      downloads: 890,
      forks: 156,
      comments: 78,
      views: 3420,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      difficulty: "Advanced",
      estimatedTime: "10-15 min",
      isFeatured: true,
      isTrending: false,
      isBookmarked: true,
      isLiked: true
    },
    {
      id: "3",
      title: "Customer Support Wizard",
      description: "Intelligent customer service responses with empathy, problem-solving focus, and escalation handling.",
      author: {
        name: "Emily Watson",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20customer%20service%20avatar&image_size=square",
        verified: false,
        reputation: 2100
      },
      category: "Customer Service",
      tags: ["Customer Support", "Empathy", "Problem Solving", "Communication"],
      rating: 4.6,
      totalRatings: 89,
      likes: 234,
      downloads: 567,
      forks: 45,
      comments: 23,
      views: 1890,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-16",
      difficulty: "Beginner",
      estimatedTime: "3-5 min",
      isFeatured: false,
      isTrending: true,
      isBookmarked: false,
      isLiked: false
    }
  ];

  const mockReviews: Review[] = [
    {
      id: "1",
      author: {
        name: "Marcus Johnson",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20reviewer%20avatar&image_size=square"
      },
      rating: 5,
      comment: "Absolutely fantastic prompt! Saved me hours of work and the output quality is consistently excellent. The SEO optimization features are particularly impressive.",
      timestamp: "2 days ago",
      helpful: 12,
      isHelpful: false
    },
    {
      id: "2",
      author: {
        name: "Lisa Park",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20marketer%20avatar&image_size=square"
      },
      rating: 4,
      comment: "Great prompt overall, but could use more customization options for different industries. Still very useful for general content creation.",
      timestamp: "1 week ago",
      helpful: 8,
      isHelpful: true
    }
  ];

  const categories = [
    "all",
    "Content Creation",
    "Development",
    "Customer Service",
    "Data Analysis",
    "Marketing",
    "Research",
    "Education"
  ];

  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "most-downloaded", label: "Most Downloaded" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleLike = (promptId: string) => {
    toast.success("Prompt liked!");
  };

  const handleBookmark = (promptId: string) => {
    toast.success("Prompt bookmarked!");
  };

  const handleDownload = (promptId: string) => {
    toast.success("Prompt downloaded!");
  };

  const handleFork = (promptId: string) => {
    toast.success("Prompt forked to your workspace!");
  };

  const handleShare = (promptId: string) => {
    navigator.clipboard.writeText(`https://pigeonprompt.com/community/prompts/${promptId}`);
    toast.success("Share link copied to clipboard!");
  };

  const handleReviewHelpful = (reviewId: string) => {
    toast.success("Thanks for your feedback!");
  };

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully!");
    setShowFilters(false);
  };

  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Prompts</h2>
          <p className="text-gray-600">Discover and share amazing prompts with the community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </Button>
          <Button variant="outline" size="sm">
            <Award className="w-4 h-4 mr-2" />
            Featured
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search prompts, tags, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogDescription>
                  Filter community prompts by various criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filterCategory" className="text-right">
                    Category
                  </Label>
                  <select 
                    id="filterCategory" 
                    value={filterOptions.category}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, category: e.target.value }))}
                    className="col-span-3 p-2 border border-border rounded"
                  >
                    <option value="all">All Categories</option>
                    <option value="Content Creation">Content Creation</option>
                    <option value="Development">Development</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Research">Research</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filterDifficulty" className="text-right">
                    Difficulty
                  </Label>
                  <select 
                    id="filterDifficulty" 
                    value={filterOptions.difficulty}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="col-span-3 p-2 border border-border rounded"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filterRating" className="text-right">
                    Rating
                  </Label>
                  <select 
                    id="filterRating" 
                    value={filterOptions.rating}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, rating: e.target.value }))}
                    className="col-span-3 p-2 border border-border rounded"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0+">4.0+ Stars</option>
                    <option value="3.5+">3.5+ Stars</option>
                    <option value="3.0+">3.0+ Stars</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filterTags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="filterTags"
                    value={filterOptions.tags}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filterAuthor" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="filterAuthor"
                    value={filterOptions.author}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Filter by author name"
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFilters(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Featured This Week
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrompts.filter(p => p.isFeatured).slice(0, 2).map(prompt => (
            <Card key={`featured-${prompt.id}`} className="border-2 border-yellow-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={prompt.author.avatar}
                      alt={prompt.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{prompt.author.name}</span>
                        {prompt.author.verified && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{prompt.rating}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <Card key={prompt.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={prompt.author.avatar}
                    alt={prompt.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">{prompt.author.name}</span>
                    {prompt.author.verified && <Crown className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {prompt.isTrending && <Zap className="w-4 h-4 text-orange-500" />}
                  {prompt.isFeatured && <Award className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {prompt.title}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {prompt.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Category and Difficulty */}
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {prompt.category}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(prompt.difficulty)}`}>
                    {prompt.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{prompt.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{prompt.rating}</span>
                    <span className="text-gray-500">({prompt.totalRatings})</span>
                  </div>
                  <span className="text-xs text-gray-500">{prompt.estimatedTime}</span>
                </div>

                {/* Engagement Stats */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className={`w-4 h-4 ${prompt.isLiked ? 'text-red-500 fill-current' : ''}`} />
                      <span>{prompt.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{prompt.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{prompt.forks}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{prompt.views}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => handleLike(prompt.id)}
                    >
                      <Heart className={`w-4 h-4 ${prompt.isLiked ? 'text-red-500 fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => handleBookmark(prompt.id)}
                    >
                      <Bookmark className={`w-4 h-4 ${prompt.isBookmarked ? 'text-blue-500 fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => handleShare(prompt.id)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFork(prompt.id)}
                    >
                      <GitBranch className="w-4 h-4 mr-1" />
                      Fork
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(prompt.id)}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reviews Modal */}
      {showReviews && selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
                <Button variant="ghost" onClick={() => setShowReviews(false)}>
                  ×
                </Button>
              </div>
              
              {/* Rating Summary */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">{selectedPrompt.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= selectedPrompt.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{selectedPrompt.totalRatings} reviews</div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-sm w-2">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.author.avatar}
                        alt={review.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.author.name}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.timestamp}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleReviewHelpful(review.id)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600">
                            <Flag className="w-4 h-4" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Prompts
        </Button>
      </div>
    </div>
  );
};

export default CommunityFeatures;