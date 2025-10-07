import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Target, CheckCircle } from 'lucide-react';

interface Mission {
  id: number;
  title: string;
  description: string;
  reward: number;
  type: string;
  target: number | { min: number; max: number };
  duration?: number;
  difficulty: string;
  progress?: number;
}

interface MissionsPanelProps {
  missions: Mission[];
  activeMissions: number[];
  completedMissions: number[];
  onAcceptMission: (missionId: number) => void;
  onClaimReward: (missionId: number) => void;
}

const MissionsPanel: React.FC<MissionsPanelProps> = ({
  missions,
  activeMissions,
  completedMissions,
  onAcceptMission,
  onClaimReward
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isMissionActive = (missionId: number) => activeMissions.includes(missionId);
  const isMissionCompleted = (missionId: number) => completedMissions.includes(missionId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-lg">Missions</h2>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <Card key={mission.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {isMissionCompleted(mission.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Target className="h-4 w-4 text-blue-600" />
                    )}
                    {mission.title}
                  </CardTitle>
                  <p className="text-xs text-gray-600 mt-1">
                    {mission.description}
                  </p>
                </div>
                <Badge className={getDifficultyColor(mission.difficulty)}>
                  {mission.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {isMissionActive(mission.id) && mission.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Reward:</span>
                  <span className="text-sm font-bold text-green-600">
                    ${mission.reward.toLocaleString()}
                  </span>
                </div>

                {isMissionCompleted(mission.id) ? (
                  <Button size="sm" variant="default" disabled>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </Button>
                ) : isMissionActive(mission.id) ? (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => onClaimReward(mission.id)}
                    disabled={mission.progress !== 100}
                  >
                    Claim Reward
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAcceptMission(mission.id)}
                  >
                    Accept
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Mission Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Complete missions to earn money and improve your farm</li>
          <li>• Some missions require specific conditions to complete</li>
          <li>• Check your progress regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default MissionsPanel;

