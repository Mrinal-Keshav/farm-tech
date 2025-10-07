import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, 
  Users, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Leaf, 
  MessageSquare,
  Share2,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const IntegratedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from the game state
  const gameStats = {
    sustainability: 87,
    yield: 1250,
    money: 15000,
    level: 5,
    experience: 2340,
    nextLevel: 3000
  };

  const communityStats = {
    posts: 12,
    likes: 89,
    followers: 45,
    following: 23
  };

  const recentAchievements = [
    { id: 1, name: 'Green Thumb', description: 'Achieved 80% sustainability', icon: '🌱', earned: true },
    { id: 2, name: 'Harvest Master', description: 'Harvested 1000 crops', icon: '🌾', earned: true },
    { id: 3, name: 'Community Helper', description: 'Helped 10 farmers', icon: '👥', earned: false },
    { id: 4, name: 'Eco Warrior', description: 'Zero waste farming', icon: '♻️', earned: false }
  ];

  const recentPosts = [
    {
      id: 1,
      content: 'Just completed the Tractor Run minigame! 🚜',
      likes: 12,
      comments: 3,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      content: 'My sustainability score reached 87%! 🌱',
      likes: 23,
      comments: 8,
      timestamp: '1 day ago'
    }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Maria Santos', score: 9850, country: 'Brazil' },
    { rank: 2, name: 'David Chen', score: 9720, country: 'USA' },
    { rank: 3, name: 'John Kumar', score: 9450, country: 'India' },
    { rank: 4, name: 'You', score: 8230, country: 'Your Farm' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'Farmer'}!</h1>
            <p className="text-muted-foreground">Manage your farm and connect with the community</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/farming-game')} className="bg-green-600 hover:bg-green-700">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Play Game
            </Button>
            <Button onClick={() => navigate('/community')} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Community
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sustainability</p>
                  <p className="text-2xl font-bold text-green-600">{gameStats.sustainability}%</p>
                </div>
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Yield</p>
                  <p className="text-2xl font-bold text-blue-600">{gameStats.yield.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Money</p>
                  <p className="text-2xl font-bold text-yellow-600">${gameStats.money.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold text-purple-600">{gameStats.level}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {user?.name?.charAt(0) || 'F'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/farming-game')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Continue Farming
                  </Button>
                  <Button 
                    onClick={() => navigate('/community')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Visit Community
                  </Button>
                  <Button 
                    onClick={() => navigate('/analysis')} 
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {recentAchievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.earned ? 'border-green-200 bg-green-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.earned ? (
                        <Badge variant="default" className="bg-green-600">Earned</Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{communityStats.posts}</div>
                        <div className="text-sm text-muted-foreground">Posts</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{communityStats.likes}</div>
                        <div className="text-sm text-muted-foreground">Likes</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{communityStats.followers}</div>
                        <div className="text-sm text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{communityStats.following}</div>
                        <div className="text-sm text-muted-foreground">Following</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Community Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => navigate('/community')} 
                      className="w-full justify-start"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Share Progress
                    </Button>
                    <Button 
                      onClick={() => navigate('/community')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Find Farmers
                    </Button>
                    <Button 
                      onClick={() => navigate('/community')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Ask Questions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((player, index) => (
                    <div 
                      key={player.rank} 
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        player.name === 'You' 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {player.rank}
                        </div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.country}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.score.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegratedDashboard;
