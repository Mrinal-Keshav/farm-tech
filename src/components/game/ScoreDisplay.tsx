import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingUp, Shield } from 'lucide-react';

interface ScoreDisplayProps {
  sustainability: number;
  cropYield: number;
  resilience: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  sustainability,
  cropYield,
  resilience
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
      <h3 className="font-semibold text-gray-800 mb-4">Farm Performance</h3>
      
      <div className="space-y-4">
        {/* Sustainability Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Sustainability</span>
            </div>
            <span className="text-sm font-bold">{sustainability}%</span>
          </div>
          <Progress value={sustainability} className="h-2" />
        </div>

        {/* Yield Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Yield</span>
            </div>
            <span className="text-sm font-bold">{cropYield} units</span>
          </div>
          <Progress value={Math.min(cropYield / 10, 100)} className="h-2" />
        </div>

        {/* Resilience Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Resilience</span>
            </div>
            <span className="text-sm font-bold">{resilience}%</span>
          </div>
          <Progress value={resilience} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
