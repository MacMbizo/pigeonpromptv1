import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  DollarSign, 
  Crown, 
  Star, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  Award, 
  Users, 
  Download, 
  Heart, 
  Eye, 
  Filter, 
  Search, 
  Tag, 
  Zap, 
  Shield, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Wallet, 
  Gift, 
  Percent
} from "lucide-react";
import { toast } from "sonner";

interface MarketplacePrompt {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    reputation: number;
    totalSales: number;
  };
  category: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  totalRatings: number;
  sales: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimatedTime: string;
  isPremium: boolean;
  isExclusive: boolean;
  isBestseller: boolean;
  isOnSale: boolean;
  saleEndDate?: string;
  previewAvailable: boolean;
  licenseType: "Personal" | "Commercial" | "Extended";
  includes: string[];
  requirements: string[];
}

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: "monthly" | "yearly";
  features: string[];
  popularFeatures: string[];
  isPopular: boolean;
  discount?: number;
  originalPrice?: number;
}

const MarketplaceFeatures = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("bestselling");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"prompts" | "subscriptions">("prompts");
  const [cart, setCart] = useState<string[]>([]);

  const mockPrompts: MarketplacePrompt[] = [
    {
      id: "1",
      title: "Ultimate Marketing Copy Generator Pro",
      description: "Professional-grade marketing copy generator with A/B testing templates, conversion optimization, and industry-specific variations. Includes 50+ templates and advanced customization options.",
      author: {
        name: "Marketing Guru Sarah",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20marketing%20expert%20woman%20avatar&image_size=square",
        verified: true,
        reputation: 9850,
        totalSales: 2340
      },
      category: "Marketing",
      tags: ["Marketing", "Copywriting", "A/B Testing", "Conversion", "Templates"],
      price: 49.99,
      originalPrice: 79.99,
      currency: "USD",
      rating: 4.9,
      totalRatings: 456,
      sales: 1250,
      views: 15670,
      likes: 892,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-20",
      difficulty: "Advanced",
      estimatedTime: "15-30 min",
      isPremium: true,
      isExclusive: true,
      isBestseller: true,
      isOnSale: true,
      saleEndDate: "2024-02-01",
      previewAvailable: true,
      licenseType: "Commercial",
      includes: ["50+ Templates", "A/B Testing Guide", "Industry Variations", "Conversion Metrics", "Email Support"],
      requirements: ["Basic marketing knowledge", "Understanding of target audiences"]
    },
    {
      id: "2",
      title: "AI Code Architect Enterprise",
      description: "Enterprise-level code generation and architecture planning tool. Includes security best practices, scalability patterns, and team collaboration features.",
      author: {
        name: "Tech Lead Alex",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20tech%20lead%20developer%20avatar&image_size=square",
        verified: true,
        reputation: 12500,
        totalSales: 890
      },
      category: "Development",
      tags: ["Architecture", "Enterprise", "Security", "Scalability", "Team Collaboration"],
      price: 129.99,
      currency: "USD",
      rating: 4.8,
      totalRatings: 203,
      sales: 567,
      views: 8920,
      likes: 445,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-18",
      difficulty: "Expert",
      estimatedTime: "30-60 min",
      isPremium: true,
      isExclusive: false,
      isBestseller: false,
      isOnSale: false,
      previewAvailable: true,
      licenseType: "Extended",
      includes: ["Architecture Templates", "Security Checklist", "Scalability Patterns", "Team Workflows", "Priority Support"],
      requirements: ["Advanced programming experience", "System design knowledge"]
    },
    {
      id: "3",
      title: "Content Creator's Toolkit",
      description: "Complete content creation suite for social media, blogs, and video scripts. Perfect for influencers and content creators.",
      author: {
        name: "Content Queen Emma",
        avatar: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20content%20creator%20woman%20avatar&image_size=square",
        verified: true,
        reputation: 7200,
        totalSales: 1560
      },
      category: "Content Creation",
      tags: ["Social Media", "Blog Writing", "Video Scripts", "Influencer", "Engagement"],
      price: 29.99,
      currency: "USD",
      rating: 4.7,
      totalRatings: 789,
      sales: 2100,
      views: 25430,
      likes: 1340,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-19",
      difficulty: "Intermediate",
      estimatedTime: "10-20 min",
      isPremium: true,
      isExclusive: false,
      isBestseller: true,
      isOnSale: false,
      previewAvailable: true,
      licenseType: "Commercial",
      includes: ["30+ Templates", "Platform-Specific Formats", "Engagement Strategies", "Analytics Guide"],
      requirements: ["Basic content creation experience"]
    }
  ];

  const mockSubscriptions: Subscription[] = [
    {
      id: "basic",
      name: "Basic Plan",
      description: "Perfect for individuals getting started with AI prompts",
      price: 9.99,
      currency: "USD",
      period: "monthly",
      features: [
        "Access to 100+ premium prompts",
        "Basic customization options",
        "Email support",
        "Personal use license",
        "Monthly prompt updates"
      ],
      popularFeatures: ["100+ premium prompts", "Personal use license"],
      isPopular: false
    },
    {
      id: "pro",
      name: "Pro Plan",
      description: "For professionals and small teams",
      price: 29.99,
      originalPrice: 39.99,
      currency: "USD",
      period: "monthly",
      features: [
        "Access to 500+ premium prompts",
        "Advanced customization",
        "Priority support",
        "Commercial use license",
        "Weekly prompt updates",
        "Team collaboration (up to 5 members)",
        "Analytics dashboard",
        "Custom templates"
      ],
      popularFeatures: ["500+ premium prompts", "Commercial license", "Team collaboration"],
      isPopular: true,
      discount: 25
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      description: "For large teams and organizations",
      price: 99.99,
      currency: "USD",
      period: "monthly",
      features: [
        "Unlimited premium prompts",
        "Full customization suite",
        "24/7 dedicated support",
        "Extended commercial license",
        "Daily prompt updates",
        "Unlimited team members",
        "Advanced analytics",
        "Custom integrations",
        "White-label options",
        "API access"
      ],
      popularFeatures: ["Unlimited prompts", "24/7 support", "API access"],
      isPopular: false
    }
  ];

  const categories = [
    "all",
    "Marketing",
    "Development",
    "Content Creation",
    "Business",
    "Education",
    "Design",
    "Analytics"
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "under-25", label: "Under $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "over-100", label: "Over $100" }
  ];

  const sortOptions = [
    { value: "bestselling", label: "Best Selling" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "most-popular", label: "Most Popular" }
  ];

  const handleAddToCart = (promptId: string) => {
    if (!cart.includes(promptId)) {
      setCart([...cart, promptId]);
      toast.success("Added to cart!");
    } else {
      toast.info("Already in cart!");
    }
  };

  const handleBuyNow = (promptId: string) => {
    toast.success("Redirecting to checkout...");
  };

  const handlePreview = (promptId: string) => {
    toast.info("Opening preview...");
  };

  const handleSubscribe = (planId: string) => {
    toast.success(`Subscribing to ${planId} plan...`);
  };

  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory;
    const matchesPrice = priceRange === "all" || 
      (priceRange === "free" && prompt.price === 0) ||
      (priceRange === "under-25" && prompt.price < 25) ||
      (priceRange === "25-50" && prompt.price >= 25 && prompt.price <= 50) ||
      (priceRange === "50-100" && prompt.price > 50 && prompt.price <= 100) ||
      (priceRange === "over-100" && prompt.price > 100);
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Premium Marketplace
          </h2>
          <p className="text-gray-600">Discover professional-grade prompts and unlock premium features</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "prompts" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("prompts")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Prompts
          </Button>
          <Button 
            variant={viewMode === "subscriptions" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewMode("subscriptions")}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Subscriptions
          </Button>
          {cart.length > 0 && (
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            </Button>
          )}
        </div>
      </div>

      {viewMode === "prompts" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search premium prompts..."
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
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
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
            </div>
          </div>

          {/* Featured Deals */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-500" />
              Limited Time Offers
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPrompts.filter(p => p.isOnSale).slice(0, 2).map(prompt => (
                <Card key={`sale-${prompt.id}`} className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            SALE
                          </span>
                          <span className="text-xs text-gray-500">
                            Ends {prompt.saleEndDate}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${prompt.price}
                          </span>
                          {prompt.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              ${prompt.originalPrice}
                            </span>
                          )}
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {Math.round((1 - prompt.price / (prompt.originalPrice || prompt.price)) * 100)}% OFF
                          </span>
                        </div>
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
              <Card key={prompt.id} className="hover:shadow-lg transition-all duration-200 group relative">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  {prompt.isBestseller && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      BESTSELLER
                    </span>
                  )}
                  {prompt.isExclusive && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      EXCLUSIVE
                    </span>
                  )}
                  {prompt.isOnSale && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      SALE
                    </span>
                  )}
                </div>

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
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{prompt.rating}</span>
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
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          ${prompt.price}
                        </span>
                        {prompt.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${prompt.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{prompt.licenseType} License</span>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{prompt.sales}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{prompt.likes}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{prompt.views}</span>
                      </div>
                    </div>

                    {/* Includes */}
                    <div>
                      <h4 className="text-sm font-medium mb-1">Includes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {prompt.includes.slice(0, 3).map(item => (
                          <span
                            key={item}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                        {prompt.includes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{prompt.includes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      {prompt.previewAvailable && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handlePreview(prompt.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleAddToCart(prompt.id)}
                        disabled={cart.includes(prompt.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {cart.includes(prompt.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleBuyNow(prompt.id)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Subscriptions */
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
            <p className="text-gray-600">Unlock premium features and get unlimited access to our prompt library</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSubscriptions.map(plan => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.isPopular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm px-4 py-1 rounded-full font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-lg text-gray-500 line-through">
                          ${plan.originalPrice}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {plan.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className={`text-sm ${plan.popularFeatures.includes(feature) ? 'font-medium' : ''}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.isPopular ? 'Start Free Trial' : 'Get Started'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {plan.isPopular ? '14-day free trial, then' : 'Billed'} ${plan.price}/{plan.period}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Enterprise Contact */}
          <Card className="bg-gray-50">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Need a Custom Solution?</h3>
              <p className="text-gray-600 mb-4">
                Contact our sales team for enterprise pricing, custom integrations, and volume discounts.
              </p>
              <Button variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarketplaceFeatures;