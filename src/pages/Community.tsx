import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare,
  Heart,
  Share,
  Send,
  Filter,
  Search,
  TrendingUp,
  MapPin,
  Calendar,
  Tag,
  Plus,
  Eye,
  Clock,
  ThumbsUp,
  MessageCircle,
  Gamepad2,
  BarChart3,
  Leaf,
  Star,
  Award,
  Zap
} from "lucide-react";
import { useAuth } from "../App";
import Leaderboard from "../components/Leaderboard";
import CommunityFeed from "./CommunityFeed";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location: string;
    verified: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  category: string;
}

interface DiscussionTopic {
  id: string;
  title: string;
  description: string;
  posts: number;
  lastActive: string;
  category: string;
  pinned?: boolean;
}

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo posts data
  const posts: Post[] = [
    {
      id: '1',
      author: { name: 'Priya Sharma', location: 'Punjab, India', verified: true },
      content: 'Just harvested my best tomato crop ever! 🍅 The AI suggestions about watering schedule really made a difference. Yield increased by 23% compared to last season. The FarmTech app\'s irrigation recommendations were spot on!',
      timestamp: '2 hours ago',
      likes: 47,
      comments: 12,
      shares: 8,
      tags: ['tomatoes', 'harvest', 'ai-suggestions', 'irrigation'],
      category: 'Success Stories'
    },
    {
      id: '2',
      author: { name: 'Rajesh Kumar', location: 'Haryana, India', verified: true },
      content: 'Has anyone tried companion planting with corn and beans? I\'m seeing some conflicting advice online. Looking for real farmer experiences. Planning to start next season and want to get it right! 🌽',
      timestamp: '4 hours ago',
      likes: 23,
      comments: 18,
      shares: 3,
      tags: ['corn', 'beans', 'companion-planting', 'planning'],
      category: 'Questions'
    },
    {
      id: '3',
      author: { name: 'Anita Patel', location: 'Gujarat, India', verified: false },
      content: 'Weather forecast shows heavy rain next week. Should I harvest my wheat now or wait? It\'s about 85% ready according to the app analysis. The FarmTech weather integration is really helpful! 🌾',
      timestamp: '6 hours ago',
      likes: 31,
      comments: 22,
      shares: 5,
      tags: ['wheat', 'weather', 'harvest-timing', 'decision-making'],
      category: 'Advice Needed'
    },
    {
      id: '4',
      author: { name: 'Deepak Singh', location: 'Uttar Pradesh, India', verified: true },
      content: 'Sharing my soil test results after following the app\'s fertilizer recommendations for 3 months. pH improved from 6.2 to 6.8, and nitrogen levels are perfect now! 📊 The FarmTech soil analysis feature is incredible!',
      timestamp: '1 day ago',
      likes: 89,
      comments: 31,
      shares: 24,
      tags: ['soil-health', 'fertilizer', 'results', 'soil-testing'],
      category: 'Success Stories'
    },
    {
      id: '5',
      author: { name: user?.name || 'You', location: 'Your Farm', verified: true },
      content: 'Just completed the Tractor Run minigame and earned ₹500! 🚜 The game is so fun and helps me understand farm operations better. Try it out! The FarmSphere integration is amazing!',
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: ['minigame', 'tractor-run', 'earnings', 'gamification'],
      category: 'Game Achievements'
    },
    {
      id: '6',
      author: { name: 'Sunita Reddy', location: 'Andhra Pradesh, India', verified: true },
      content: 'My sustainability score reached 95%! 🌱 The FarmSphere game really helped me understand the impact of different farming practices. Highly recommend! The environmental impact tracking is eye-opening!',
      timestamp: '3 hours ago',
      likes: 67,
      comments: 15,
      shares: 12,
      tags: ['sustainability', 'farmsphere', 'game', 'environment'],
      category: 'Game Achievements'
    },
    {
      id: '7',
      author: { name: 'Amit Kumar', location: 'Bihar, India', verified: true },
      content: 'Successfully implemented drip irrigation system with FarmTech\'s guidance. Water usage reduced by 40% while maintaining crop quality! 💧 The water management features are game-changing!',
      timestamp: '5 hours ago',
      likes: 52,
      comments: 8,
      shares: 15,
      tags: ['irrigation', 'water-conservation', 'drip-system', 'efficiency'],
      category: 'Success Stories'
    },
    {
      id: '8',
      author: { name: 'Kavita Singh', location: 'Rajasthan, India', verified: false },
      content: 'Looking for advice on organic pest control methods. The FarmTech community has been so helpful! Any recommendations for aphid control? 🐛',
      timestamp: '8 hours ago',
      likes: 19,
      comments: 25,
      shares: 2,
      tags: ['pest-control', 'organic', 'aphids', 'help-needed'],
      category: 'Questions'
    }
  ];

  const discussionTopics: DiscussionTopic[] = [
    {
      id: '1',
      title: 'Organic Pest Control Methods',
      description: 'Share and discuss natural pest control techniques that work in real farming conditions',
      posts: 156,
      lastActive: '2 hours ago',
      category: 'Pest Management',
      pinned: true
    },
    {
      id: '2',
      title: 'Water Conservation Techniques',
      description: 'Best practices for efficient water usage and conservation in modern farming',
      posts: 203,
      lastActive: '5 hours ago',
      category: 'Irrigation'
    },
    {
      id: '3',
      title: 'Climate Change Adaptation',
      description: 'How to adapt farming practices to changing climate conditions and extreme weather',
      posts: 87,
      lastActive: '1 day ago',
      category: 'Climate'
    },
    {
      id: '4',
      title: 'Technology Integration',
      description: 'Discussing IoT devices, sensors, automation, and smart farming technologies',
      posts: 134,
      lastActive: '3 days ago',
      category: 'Technology'
    },
    {
      id: '5',
      title: 'FarmSphere Game Strategies',
      description: 'Share tips and strategies for the farming simulation game and minigames',
      posts: 89,
      lastActive: '4 hours ago',
      category: 'Gaming',
      pinned: true
    },
    {
      id: '6',
      title: 'Minigame High Scores',
      description: 'Compete with other farmers in Tractor Run and other minigames',
      posts: 45,
      lastActive: '1 hour ago',
      category: 'Gaming'
    },
    {
      id: '7',
      title: 'Soil Health Optimization',
      description: 'Discussing soil testing, amendments, and long-term soil health strategies',
      posts: 178,
      lastActive: '6 hours ago',
      category: 'Soil Management'
    },
    {
      id: '8',
      title: 'Market Trends & Pricing',
      description: 'Share market insights, pricing strategies, and crop selection advice',
      posts: 92,
      lastActive: '2 days ago',
      category: 'Business'
    }
  ];

  const trendingTopics = [
    { name: '#DroughtResistant', posts: 234 },
    { name: '#OrganicFarming', posts: 189 },
    { name: '#SmartIrrigation', posts: 156 },
    { name: '#SoilHealth', posts: 134 },
    { name: '#ClimateAdaptation', posts: 98 },
    { name: '#FarmSphere', posts: 67 },
    { name: '#TractorRun', posts: 45 },
    { name: '#GameAchievements', posts: 32 },
    { name: '#WaterConservation', posts: 28 },
    { name: '#PestControl', posts: 25 }
  ];

  const communityStats = [
    { label: 'Active Farmers', value: '12.5k', icon: Users, color: 'text-primary' },
    { label: 'Discussions', value: '3.2k', icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Success Stories', value: '8.7k', icon: TrendingUp, color: 'text-earth-gold' },
    { label: 'Countries', value: '45', icon: MapPin, color: 'text-earth-green' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Farmer Community</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, share knowledge, and learn from farmers around the world
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {communityStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="interactive">Interactive Community</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>

              {/* Community Feed */}
              <TabsContent value="feed" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-soft transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {post.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{post.author.name}</span>
                                {post.author.verified && (
                                  <Badge variant="default" className="text-xs">Verified</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{post.author.location}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{post.category}</Badge>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-foreground leading-relaxed">{post.content}</p>
                        </div>

                        {/* Post Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-6">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              {formatNumber(post.likes)}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              {formatNumber(post.comments)}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <Share className="w-4 h-4 mr-2" />
                              {formatNumber(post.shares)}
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Interactive Feed */}
              <TabsContent value="interactive" className="space-y-6">
                <CommunityFeed />
              </TabsContent>

              {/* Discussions */}
              <TabsContent value="discussions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground">Popular Discussions</h2>
                  <Button variant="hero" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Topic
                  </Button>
                </div>

                <div className="space-y-4">
                  {discussionTopics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{topic.title}</h3>
                              {topic.pinned && (
                                <Badge variant="default" className="text-xs">Pinned</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">{topic.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{topic.posts} posts</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Last active {topic.lastActive}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{topic.category}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Leaderboard */}
              <TabsContent value="leaderboard" className="space-y-6">
                <Leaderboard />
              </TabsContent>

            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between hover:bg-accent p-2 rounded-lg cursor-pointer">
                    <span className="font-medium text-primary">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">{topic.posts}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Be respectful and supportive to fellow farmers</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Share accurate information and cite sources</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Keep discussions relevant to farming</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>No spam or promotional content</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="nature" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Find Experts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Community Events
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/farming-game')}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play FarmSphere
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Leaf className="w-4 h-4 mr-2" />
                  Share Farm Progress
                </Button>
              </CardContent>
            </Card>

            {/* Featured Farmers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Farmers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Priya Sharma</div>
                    <div className="text-xs text-muted-foreground">Tomato Expert</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Expert
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">DS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Deepak Singh</div>
                    <div className="text-xs text-muted-foreground">Soil Specialist</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Top Contributor
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">SR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Sunita Reddy</div>
                    <div className="text-xs text-muted-foreground">Sustainability Champion</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Rising Star
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;