import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  sustainability: number;
  yield: number;
  rank: number;
  country: string;
  verified: boolean;
}

const Leaderboard = () => {
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Maria Santos',
      score: 9850,
      sustainability: 98,
      yield: 1250,
      rank: 1,
      country: 'Brazil',
      verified: true
    },
    {
      id: '2',
      name: 'David Chen',
      score: 9720,
      sustainability: 95,
      yield: 1180,
      rank: 2,
      country: 'USA',
      verified: true
    },
    {
      id: '3',
      name: 'John Kumar',
      score: 9450,
      sustainability: 92,
      yield: 1100,
      rank: 3,
      country: 'India',
      verified: true
    },
    {
      id: '4',
      name: 'Ana Rodriguez',
      score: 9200,
      sustainability: 89,
      yield: 1050,
      rank: 4,
      country: 'Spain',
      verified: false
    },
    {
      id: '5',
      name: 'Sarah Wilson',
      score: 8950,
      sustainability: 87,
      yield: 980,
      rank: 5,
      country: 'USA',
      verified: true
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {leaderboardData.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg border ${getRankColor(entry.rank)} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {entry.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.name}</span>
                      {entry.verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{entry.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{entry.score.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-green-600">{entry.sustainability}%</div>
                  <div className="text-xs text-muted-foreground">Sustainability</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600">{entry.yield.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Yield</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            This Week's Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Maria Santos</span>
              </div>
              <Badge variant="default">+15% Yield</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-gray-400" />
                <span className="font-medium">David Chen</span>
              </div>
              <Badge variant="secondary">+12% Sustainability</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600" />
                <span className="font-medium">John Kumar</span>
              </div>
              <Badge variant="outline">+8% Efficiency</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12.5k</div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8.7k</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3.2k</div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
