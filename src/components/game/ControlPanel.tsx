import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Sprout, Wrench, Scissors, DollarSign } from 'lucide-react';

interface Plot {
  id: number;
  x: number;
  y: number;
  crop: number | null;
  cropAge: number;
  growthStage: number;
  health: number;
  soilHealth: number;
  moisture: number;
  plantedDate: number | null;
  harvestReady: boolean;
  lastWatered: number | null;
  lastFertilized: number | null;
}

interface Crop {
  id: number;
  name: string;
  icon: string;
  growthStages: {
    name: string;
    days: number;
    icon: string;
  }[];
  waterNeeds: string;
  optimalTemp: { min: number; max: number };
  optimalSoilMoisture: { min: number; max: number };
  sustainabilityScore: number;
  basePrice: number;
  pestResistance: string;
  droughtResistance: string;
}

interface ControlPanelProps {
  selectedPlot: Plot | null;
  crops: Crop[];
  onPlantCrop: (cropId: number) => void;
  onIrrigate: () => void;
  onFertilize: () => void;
  onHarvest: () => void;
  disabled: boolean;
  money: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedPlot,
  crops,
  onPlantCrop,
  onIrrigate,
  onFertilize,
  onHarvest,
  disabled,
  money
}) => {
  const getMoistureStatus = (moisture: number) => {
    if (moisture < 0.15) return { status: 'Very Dry', color: 'text-red-500' };
    if (moisture < 0.25) return { status: 'Dry', color: 'text-orange-500' };
    if (moisture < 0.35) return { status: 'Optimal', color: 'text-green-500' };
    if (moisture < 0.45) return { status: 'Moist', color: 'text-blue-500' };
    return { status: 'Very Wet', color: 'text-purple-500' };
  };

  const getHealthStatus = (health: number) => {
    if (health > 0.8) return { status: 'Excellent', color: 'text-green-500' };
    if (health > 0.6) return { status: 'Good', color: 'text-green-400' };
    if (health > 0.4) return { status: 'Fair', color: 'text-yellow-500' };
    if (health > 0.2) return { status: 'Poor', color: 'text-orange-500' };
    return { status: 'Critical', color: 'text-red-500' };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Farm Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPlot ? (
            <>
              {/* Plot Information */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="font-medium text-sm">Plot {selectedPlot.x},{selectedPlot.y}</h4>
                
                {selectedPlot.crop ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Crop:</span>
                      <div className="flex items-center gap-1">
                        <span>{crops.find(c => c.id === selectedPlot.crop)?.icon}</span>
                        <span>{crops.find(c => c.id === selectedPlot.crop)?.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Health:</span>
                      <span className={getHealthStatus(selectedPlot.health).color}>
                        {getHealthStatus(selectedPlot.health).status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Moisture:</span>
                      <span className={getMoistureStatus(selectedPlot.moisture).color}>
                        {getMoistureStatus(selectedPlot.moisture).status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Soil Health:</span>
                      <span className={getHealthStatus(selectedPlot.soilHealth).color}>
                        {Math.round(selectedPlot.soilHealth * 100)}%
                      </span>
                    </div>
                    
                    {selectedPlot.harvestReady && (
                      <Badge variant="default" className="bg-yellow-500 text-white">
                        Ready to Harvest!
                      </Badge>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Empty plot - ready for planting</p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {selectedPlot.crop ? (
                  <>
                    <Button
                      onClick={onIrrigate}
                      className="w-full"
                      variant="outline"
                      disabled={disabled || money < 80}
                    >
                      <Droplets className="h-4 w-4 mr-2" />
                      Irrigate ($80)
                    </Button>
                    
                    <Button
                      onClick={onFertilize}
                      className="w-full"
                      variant="outline"
                      disabled={disabled || money < 120}
                    >
                      <Sprout className="h-4 w-4 mr-2" />
                      Fertilize ($120)
                    </Button>
                    
                    {selectedPlot.harvestReady && (
                      <Button
                        onClick={onHarvest}
                        className="w-full"
                        variant="default"
                        disabled={disabled}
                      >
                        <Scissors className="h-4 w-4 mr-2" />
                        Harvest
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Plant a Crop ($500 each)</h4>
                    {crops.map(crop => (
                      <Button
                        key={crop.id}
                        onClick={() => onPlantCrop(crop.id)}
                        className="w-full justify-start"
                        variant="outline"
                        disabled={disabled || money < 500}
                      >
                        <span className="mr-2">{crop.icon}</span>
                        {crop.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a plot to view controls</p>
            </div>
          )}
          
          {/* Money Display */}
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-sm font-medium">Available Funds:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-bold">{money.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
