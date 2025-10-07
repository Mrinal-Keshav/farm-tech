import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  description: string;
  effect: string;
  severity: string;
  duration: number;
  icon: string;
  probability: number;
  seasons: string[];
  daysLeft?: number;
}

interface EventsSystemProps {
  activeEvents: Event[];
}

const EventsSystem: React.FC<EventsSystemProps> = ({ activeEvents }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'positive':
        return 'border-green-500 bg-green-50';
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  if (activeEvents.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Active Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeEvents.map((event) => (
              <div 
                key={event.id} 
                className={`border rounded-lg p-3 ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(event.severity)}
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{event.name}</h4>
                      {event.daysLeft && (
                        <Badge variant="outline" className="text-xs">
                          {event.daysLeft} days left
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-700 mb-2">
                      {event.description}
                    </p>
                    
                    <p className="text-xs font-medium text-gray-600">
                      Effect: {event.effect}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsSystem;

