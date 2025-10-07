import React from 'react';

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
}

interface FarmMapProps {
  plots: Plot[];
  cropData: Crop[];
  selectedPlot: number | null;
  onSelectPlot: (id: number) => void;
}

const FarmMap: React.FC<FarmMapProps> = ({
  plots,
  cropData,
  selectedPlot,
  onSelectPlot
}) => {
  // Helper to get crop icon based on growth stage
  const getCropIcon = (plot: Plot) => {
    if (plot.crop === null) return null;
    
    const crop = cropData.find(c => c.id === plot.crop);
    if (!crop) return null;

    // If crop is ready to harvest, show a special indicator
    if (plot.harvestReady) {
      return (
        <div className="relative">
          <div className="text-2xl">{crop.icon}</div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      );
    }

    // Otherwise show the appropriate growth stage icon
    if (plot.growthStage < crop.growthStages.length) {
      return (
        <div className="text-2xl">
          {crop.growthStages[plot.growthStage].icon}
        </div>
      );
    }
    
    return <div className="text-2xl">{crop.icon}</div>;
  };

  // Helper to get soil color based on moisture and health
  const getSoilColor = (moisture: number, health: number) => {
    // Enhanced color scale with better visual feedback
    if (moisture < 0.15) return 'bg-red-100 border-red-200'; // Very dry - red tint
    if (moisture < 0.25) return 'bg-yellow-200 border-yellow-300'; // Dry - yellow
    if (moisture < 0.35) return 'bg-green-100 border-green-200'; // Optimal - green
    if (moisture < 0.45) return 'bg-blue-100 border-blue-200'; // Moist - blue
    return 'bg-indigo-100 border-indigo-200'; // Very wet - indigo
  };

  // Helper to get health indicator color
  const getHealthIndicator = (health: number) => {
    if (health > 0.8) return 'bg-green-500';
    if (health > 0.6) return 'bg-green-300';
    if (health > 0.4) return 'bg-yellow-400';
    if (health > 0.2) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Farm</h2>
      <p className="text-sm text-gray-500 mb-4">
        NASA NDVI data shows crop health. Click a plot to select it.
      </p>
      
      <div className="grid grid-cols-6 gap-2 w-full max-w-3xl mx-auto">
        {plots.map(plot => (
          <div 
            key={plot.id} 
            onClick={() => onSelectPlot(plot.id)} 
            className={`aspect-square ${getSoilColor(plot.moisture, plot.soilHealth)} rounded-md border-2 ${
              selectedPlot === plot.id 
                ? 'border-blue-500 ring-2 ring-blue-300 shadow-lg' 
                : 'hover:border-gray-300'
            } flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-200 relative group`}
          >
            {/* Crop icon */}
            {plot.crop !== null && getCropIcon(plot)}
            
            {/* Health indicator (small colored dot) */}
            {plot.crop !== null && (
              <div 
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getHealthIndicator(plot.health)}`} 
                title={`Crop health: ${Math.round(plot.health * 100)}%`}
              ></div>
            )}
            
            {/* Plot coordinates */}
            <div className="absolute bottom-1 right-1 text-xs font-mono text-gray-500">
              {plot.x},{plot.y}
            </div>
            
            {/* Moisture indicator (small water drop) */}
            {plot.moisture < 0.15 && (
              <div className="absolute bottom-1 left-1 text-xs text-amber-500" title="Low moisture">
                💧
              </div>
            )}
            
            {/* Harvest ready indicator */}
            {plot.harvestReady && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                <div className="absolute inset-0 border-2 border-yellow-400 rounded opacity-50 animate-pulse"></div>
              </div>
            )}
            
            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {plot.crop ? (
                <>
                  <div>Plot {plot.x},{plot.y}</div>
                  <div>Health: {Math.round(plot.health * 100)}%</div>
                  <div>Moisture: {Math.round(plot.moisture * 100)}%</div>
                  <div>Soil: {Math.round(plot.soilHealth * 100)}%</div>
                </>
              ) : (
                <div>Empty Plot {plot.x},{plot.y}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Soil Moisture:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
            <span className="text-xs">Dry</span>
            <div className="w-3 h-3 rounded-full bg-amber-50"></div>
            <span className="text-xs">Optimal</span>
            <div className="w-3 h-3 rounded-full bg-blue-100"></div>
            <span className="text-xs">Wet</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {selectedPlot !== null 
            ? `Selected: Plot ${plots[selectedPlot].x},${plots[selectedPlot].y}` 
            : 'No plot selected'
          }
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 border-t border-gray-100 pt-2">
        <p>
          Tip: Press SPACE to advance to the next day. Watch your crops grow
          through different stages!
        </p>
      </div>
    </div>
  );
};

export default FarmMap;
