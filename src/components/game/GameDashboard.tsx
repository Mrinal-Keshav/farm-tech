import React, { useCallback, useEffect, useState } from 'react';
import FarmMap from './FarmMap';
import DataPanel from './DataPanel';
import ControlPanel from './ControlPanel';
import ScoreDisplay from './ScoreDisplay';
import EventsSystem from './EventsSystem';
import { NotificationsContainer } from './Notification';
import MissionsPanel from './MissionsPanel';
import MarketPanel from './MarketPanel';
import TractorRun from './minigames/TractorRun';
import RealWorldData from './RealWorldData';
import { initialFarmState, cropData, soilMoistureData, rainfallData, vegetationData, climateData, randomEvents, missions } from './data/mockNASAData';
import { Calendar, Clock, Menu, X, Layers, Award, ShoppingCart, Gamepad2, MapPin, Zap, Users, Share2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../App';
import { useNavigate } from 'react-router-dom';

// Unique ID generator for notifications
const generateId = () => Math.random().toString(36).substring(2, 11);

// Game speed multipliers
const GAME_SPEEDS = [
  { multiplier: 1, label: '1x' },
  { multiplier: 2, label: '2x' },
  { multiplier: 4, label: '4x' },
  { multiplier: 8, label: '8x' },
  { multiplier: 16, label: '16x' },
  { multiplier: 32, label: '32x' }
];

const GameDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [farmState, setFarmState] = useState(initialFarmState);
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [activeDataTab, setActiveDataTab] = useState('soil');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'missions' | 'market' | 'community' | null>(null);
  const [showMinigame, setShowMinigame] = useState(false);
  const [showRealWorldData, setShowRealWorldData] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(0); // Index in GAME_SPEEDS array
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);

  // Function to add notification
  const addNotification = useCallback((notification: any) => {
    setNotifications(prev => [...prev, {
      ...notification,
      id: generateId()
    }]);
  }, []);

  // Function to dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Handle real-world weather updates
  const handleWeatherUpdate = useCallback((weatherData: any) => {
    // Notify user about real-world conditions
    addNotification({
      type: 'info',
      title: 'Local Weather Update',
      message: `Current conditions at ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.conditions}`,
      icon: weatherData.rainfall > 0 ? '🌧️' : weatherData.temperature > 20 ? '☀️' : '⛅',
      duration: 6000
    });

    // Potentially affect game state based on real weather
    if (weatherData.rainfall > 10) {
      addNotification({
        type: 'warning',
        title: 'Heavy Rain Alert',
        message: 'Local weather indicates heavy rainfall. Consider adjusting your irrigation schedule.',
        icon: '🌧️',
        duration: 8000
      });
    } else if (weatherData.temperature > 30) {
      addNotification({
        type: 'warning',
        title: 'Heat Alert',
        message: 'Local weather indicates high temperatures. Crops may need extra water.',
        icon: '🔥',
        duration: 8000
      });
    }
  }, [addNotification]);

  // Handle real-world soil updates
  const handleSoilUpdate = useCallback((soilData: any) => {
    // Optional: Update game mechanics based on real soil conditions
    // For example, give tips based on local soil moisture
    if (soilData.moisture < 0.2) {
      addNotification({
        type: 'info',
        title: 'Local Soil Conditions',
        message: 'Your local area has dry soil conditions. Consider this when planning irrigation.',
        icon: '🌱',
        duration: 6000
      });
    }
  }, [addNotification]);

  // Function to check for random events
  const checkForRandomEvents = useCallback(() => {
    // Only trigger events on certain days or with certain probability
    if (farmState.day % 10 === 0 || Math.random() < 0.05) {
      const eligibleEvents = randomEvents.filter(event => 
        event.seasons.includes(farmState.season) && Math.random() * 100 < event.probability
      );
      
      if (eligibleEvents.length > 0) {
        const randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
        // Add event to active events
        setFarmState(prev => ({
          ...prev,
          activeEvents: [...prev.activeEvents, {
            ...randomEvent,
            daysLeft: randomEvent.duration
          }]
        }));

        // Create notification for event
        addNotification({
          type: randomEvent.severity === 'positive' ? 'success' : 'warning',
          title: randomEvent.name,
          message: randomEvent.description,
          icon: <span className="text-xl">{randomEvent.icon}</span>,
          duration: 8000
        });

        // Apply event effects
        applyEventEffects(randomEvent);
      }
    }
  }, [farmState.day, farmState.season, addNotification]);

  // Apply effects of an event
  const applyEventEffects = (event: any) => {
    switch (event.id) {
      case 1:
        // Drought
        setFarmState(prev => {
          const newPlots = prev.plots.map(plot => ({
            ...plot,
            moisture: Math.max(0.05, plot.moisture * 0.7)
          }));
          return {
            ...prev,
            plots: newPlots
          };
        });
        break;
      case 2:
        // Heavy Rain
        setFarmState(prev => {
          const newPlots = prev.plots.map(plot => ({
            ...plot,
            moisture: Math.min(0.5, plot.moisture * 1.4)
          }));
          return {
            ...prev,
            plots: newPlots
          };
        });
        break;
      case 3:
        // Pest Outbreak
        setFarmState(prev => {
          const newPlots = prev.plots.map(plot => {
            if (plot.crop !== null) {
              return {
                ...plot,
                health: Math.max(0.3, plot.health * 0.8)
              };
            }
            return plot;
          });
          return {
            ...prev,
            plots: newPlots
          };
        });
        break;
      case 4:
        // Market Boom
        setFarmState(prev => {
          const newPrices = {
            ...prev.marketPrices
          };
          Object.keys(newPrices).forEach(crop => {
            newPrices[crop] = Math.floor(newPrices[crop] * 1.3);
          });
          return {
            ...prev,
            marketPrices: newPrices
          };
        });
        break;
      case 5:
        // Market Crash
        setFarmState(prev => {
          const newPrices = {
            ...prev.marketPrices
          };
          Object.keys(newPrices).forEach(crop => {
            newPrices[crop] = Math.floor(newPrices[crop] * 0.75);
          });
          return {
            ...prev,
            marketPrices: newPrices
          };
        });
        break;
      // Add more cases for other events
    }
  };

  // Update active events duration
  const updateActiveEvents = useCallback(() => {
    setFarmState(prev => {
      const updatedEvents = prev.activeEvents.map(event => ({
        ...event,
        daysLeft: event.daysLeft ? event.daysLeft - 1 : 0
      })).filter(event => (event.daysLeft || 0) > 0);

      // Notify about ending events
      prev.activeEvents.forEach(event => {
        if ((event.daysLeft || 0) === 1) {
          addNotification({
            type: 'info',
            title: `${event.name} Ending`,
            message: `The effects of ${event.name} will end tomorrow.`,
            icon: <span className="text-xl">{event.icon}</span>
          });
        }
      });

      return {
        ...prev,
        activeEvents: updatedEvents
      };
    });
  }, [addNotification]);

  // Function to update crop growth
  const updateCropGrowth = useCallback(() => {
    setFarmState(prev => {
      const newPlots = prev.plots.map(plot => {
        if (plot.crop !== null) {
          const crop = cropData.find(c => c.id === plot.crop);
          if (!crop) return plot;

          // Calculate growth rate based on conditions and game speed
          let growthRate = 1.0 * GAME_SPEEDS[gameSpeed].multiplier;
          
          // Adjust growth rate based on moisture
          const optimalMoisture = crop.optimalSoilMoisture;
          if (plot.moisture < optimalMoisture.min) {
            // Too dry - slower growth
            growthRate *= 0.5;
          } else if (plot.moisture > optimalMoisture.max) {
            // Too wet - slower growth
            growthRate *= 0.7;
          }

          // Check for events that affect growth
          const perfectGrowingEvent = prev.activeEvents.find(e => e.id === 6);
          if (perfectGrowingEvent) {
            growthRate *= 1.25;
          }

          // Update crop age and check for growth stage changes
          const newAge = plot.cropAge + growthRate;
          let newGrowthStage = plot.growthStage;
          let harvestReady = plot.harvestReady;

          // Check if crop has progressed to next growth stage
          let daysInCurrentStage = 0;
          for (let i = 0; i < plot.growthStage; i++) {
            daysInCurrentStage += crop.growthStages[i].days;
          }
          const daysInNextStage = daysInCurrentStage + crop.growthStages[plot.growthStage].days;

          if (newAge >= daysInNextStage && newGrowthStage < crop.growthStages.length - 1) {
            newGrowthStage += 1;
            // Notify about growth stage change (less frequent at higher speeds)
            if (Math.random() < 0.3 / GAME_SPEEDS[gameSpeed].multiplier) {
              addNotification({
                type: 'info',
                title: 'Crop Growth',
                message: `Your ${crop.name} has entered the ${crop.growthStages[newGrowthStage].name} stage!`,
                icon: <span className="text-xl">{crop.growthStages[newGrowthStage].icon}</span>
              });
            }
          }

          // Check if crop is ready for harvest
          if (newAge >= crop.growthDays && !harvestReady) {
            harvestReady = true;
            addNotification({
              type: 'success',
              title: 'Harvest Ready',
              message: `Your ${crop.name} is ready to harvest!`,
              icon: <span className="text-xl">{crop.icon}</span>
            });
          }

          // Reduce moisture over time (scaled by game speed)
          let newMoisture = plot.moisture - 0.02 * growthRate / GAME_SPEEDS[gameSpeed].multiplier;

          // Adjust moisture reduction based on events
          const droughtEvent = prev.activeEvents.find(e => e.id === 1);
          if (droughtEvent) {
            newMoisture -= 0.01 * GAME_SPEEDS[gameSpeed].multiplier;
          }

          const rainEvent = prev.activeEvents.find(e => e.id === 2);
          if (rainEvent) {
            newMoisture += 0.03 * GAME_SPEEDS[gameSpeed].multiplier;
          }

          // Keep moisture within bounds
          newMoisture = Math.max(0.05, Math.min(0.5, newMoisture));

          return {
            ...plot,
            cropAge: newAge,
            growthStage: newGrowthStage,
            harvestReady,
            moisture: newMoisture,
            // Reduce health if moisture is too low
            health: newMoisture < optimalMoisture.min ? Math.max(0.3, plot.health - 0.05) : plot.health
          };
        }

        return {
          ...plot,
          moisture: Math.max(0.05, plot.moisture - 0.01 * GAME_SPEEDS[gameSpeed].multiplier) // Natural evaporation
        };
      });

      return {
        ...prev,
        plots: newPlots
      };
    });
  }, [addNotification, gameSpeed]);

  // Simulate advancing time
  const advanceDay = useCallback(() => {
    // Update game state for a new day
    updateCropGrowth();
    updateActiveEvents();
    checkForRandomEvents();

    setFarmState(prev => {
      const newDay = prev.day + 1;
      let newSeason = prev.season;
      let newYear = prev.year;

      // Simple season change logic
      if (newDay > 30) {
        if (newSeason === 'Spring') newSeason = 'Summer';
        else if (newSeason === 'Summer') newSeason = 'Fall';
        else if (newSeason === 'Fall') newSeason = 'Winter';
        else {
          newSeason = 'Spring';
          newYear += 1;
        }

        addNotification({
          type: 'info',
          title: 'Season Change',
          message: `Welcome to ${newSeason}! Adjust your farming strategy for the new season.`,
          duration: 7000
        });

        return {
          ...prev,
          day: 1,
          season: newSeason,
          year: newYear
        };
      }

      return {
        ...prev,
        day: newDay
      };
    });
  }, [updateCropGrowth, updateActiveEvents, checkForRandomEvents, addNotification]);

  // Auto-advance functionality
  useEffect(() => {
    if (!autoAdvanceEnabled) return;

    const speedMultiplier = GAME_SPEEDS[gameSpeed].multiplier;
    const intervalTime = Math.max(100, 1000 / speedMultiplier); // Minimum 100ms interval
    
    const interval = setInterval(() => {
      advanceDay();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [autoAdvanceEnabled, gameSpeed, advanceDay]);

  // Manual advance with spacebar (only when auto-advance is disabled)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !showMinigame && !autoAdvanceEnabled) {
        e.preventDefault();
        advanceDay();
      }
      
      // Exit minigame with Escape
      if (e.code === 'Escape' && showMinigame) {
        setShowMinigame(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceDay, showMinigame, autoAdvanceEnabled]);

  // Toggle game speed
  const cycleGameSpeed = () => {
    setGameSpeed(prev => (prev + 1) % GAME_SPEEDS.length);
  };

  // Toggle auto-advance
  const toggleAutoAdvance = () => {
    setAutoAdvanceEnabled(prev => !prev);
  };

  // Handle planting crops
  const plantCrop = (cropId: number) => {
    if (selectedPlot === null) return;
    const crop = cropData.find(c => c.id === cropId);
    if (!crop) return;

    const cost = 500;
    if (farmState.money < cost) {
      addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: `You need $${cost} to plant ${crop.name}.`,
        duration: 4000
      });
      return;
    }

    setFarmState(prev => {
      const newPlots = [...prev.plots];
      newPlots[selectedPlot] = {
        ...newPlots[selectedPlot],
        crop: cropId,
        cropAge: 0,
        growthStage: 0,
        plantedDate: prev.day,
        harvestReady: false
      };

      // Update stats
      const newStats = {
        ...prev.stats,
        totalPlanted: prev.stats.totalPlanted + 1
      };

      return {
        ...prev,
        plots: newPlots,
        money: prev.money - cost,
        stats: newStats
      };
    });

    addNotification({
      type: 'success',
      title: 'Crop Planted',
      message: `You planted ${crop.name}. Keep it watered for optimal growth!`,
      icon: <span className="text-xl">{crop.icon}</span>,
      duration: 3000
    });
  };

  // Handle irrigation
  const irrigatePlot = () => {
    if (selectedPlot === null) return;

    const cost = 100;
    if (farmState.money < cost) {
      addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: `You need $${cost} to irrigate this plot.`,
        duration: 4000
      });
      return;
    }

    setFarmState(prev => {
      const newPlots = [...prev.plots];
      newPlots[selectedPlot] = {
        ...newPlots[selectedPlot],
        moisture: Math.min(0.45, newPlots[selectedPlot].moisture + 0.15),
        lastWatered: prev.day
      };

      // Calculate sustainability impact
      const sustainabilityChange = newPlots[selectedPlot].moisture > 0.4 ? -2 : 0;

      return {
        ...prev,
        plots: newPlots,
        sustainability: Math.max(0, Math.min(100, prev.sustainability + sustainabilityChange)),
        money: prev.money - cost
      };
    });

    addNotification({
      type: 'info',
      title: 'Plot Irrigated',
      message: 'You added water to your plot. Check soil moisture levels to avoid overwatering.',
      icon: '💧',
      duration: 3000
    });
  };

  // Handle fertilizing
  const fertilizePlot = () => {
    if (selectedPlot === null) return;

    const cost = 150;
    if (farmState.money < cost) {
      addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: `You need $${cost} to fertilize this plot.`,
        duration: 4000
      });
      return;
    }

    setFarmState(prev => {
      const newPlots = [...prev.plots];
      newPlots[selectedPlot] = {
        ...newPlots[selectedPlot],
        soilHealth: Math.min(0.9, newPlots[selectedPlot].soilHealth + 0.1),
        health: Math.min(0.9, newPlots[selectedPlot].health + 0.1),
        lastFertilized: prev.day
      };

      return {
        ...prev,
        plots: newPlots,
        sustainability: Math.max(0, Math.min(100, prev.sustainability - 1)),
        money: prev.money - cost
      };
    });

    addNotification({
      type: 'info',
      title: 'Plot Fertilized',
      message: 'You added fertilizer to improve crop growth and soil health.',
      duration: 3000
    });
  };

  // Handle harvesting
  const harvestPlot = () => {
    if (selectedPlot === null) return;

    const plot = farmState.plots[selectedPlot];
    if (!plot.crop || !plot.harvestReady) {
      addNotification({
        type: 'warning',
        title: 'Cannot Harvest',
        message: 'This crop is not ready for harvest yet.',
        duration: 3000
      });
      return;
    }

    const crop = cropData.find(c => c.id === plot.crop);
    if (!crop) return;

    // Calculate yield based on health
    const yieldMultiplier = 0.5 + plot.health * 0.5;
    const harvestYield = Math.floor(yieldMultiplier * 10);

    setFarmState(prev => {
      // Update inventory
      const newInventory = {
        ...prev.inventory
      };
      const cropName = crop.name.toLowerCase();
      newInventory[cropName] = (newInventory[cropName] || 0) + harvestYield;

      // Update plots
      const newPlots = [...prev.plots];
      newPlots[selectedPlot] = {
        ...newPlots[selectedPlot],
        crop: null,
        cropAge: 0,
        growthStage: 0,
        harvestReady: false,
        plantedDate: null,
        // Soil health slightly reduced after harvest
        soilHealth: Math.max(0.5, plot.soilHealth - 0.1)
      };

      // Update stats
      const newStats = {
        ...prev.stats,
        totalHarvested: prev.stats.totalHarvested + 1
      };

      return {
        ...prev,
        plots: newPlots,
        inventory: newInventory,
        yield: prev.yield + harvestYield,
        stats: newStats
      };
    });

    addNotification({
      type: 'success',
      title: 'Harvest Complete',
      message: `You harvested ${harvestYield} units of ${crop.name}!`,
      icon: <span className="text-xl">{crop.icon}</span>,
      duration: 4000
    });
  };

  // Handle selling crops
  const sellCrops = (cropName: string, amount: number) => {
    const price = farmState.marketPrices[cropName] || 0;
    const totalValue = price * amount;

    setFarmState(prev => {
      const newInventory = {
        ...prev.inventory
      };
      newInventory[cropName] -= amount;

      // Update stats
      const newStats = {
        ...prev.stats,
        totalEarned: prev.stats.totalEarned + totalValue
      };

      return {
        ...prev,
        inventory: newInventory,
        money: prev.money + totalValue,
        stats: newStats
      };
    });

    addNotification({
      type: 'success',
      title: 'Crops Sold',
      message: `You sold ${amount} ${cropName} for $${totalValue}.`,
      icon: '💰',
      duration: 4000
    });
  };

  // Handle accepting missions
  const acceptMission = (missionId: number) => {
    setFarmState(prev => ({
      ...prev,
      activeMissions: [...prev.activeMissions, missionId]
    }));

    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      addNotification({
        type: 'info',
        title: 'Mission Accepted',
        message: `You've accepted the "${mission.title}" mission.`,
        icon: '🎯',
        duration: 4000
      });
    }
  };

  // Handle claiming mission rewards
  const claimMissionReward = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setFarmState(prev => ({
      ...prev,
      activeMissions: prev.activeMissions.filter(id => id !== missionId),
      completedMissions: [...prev.completedMissions, missionId],
      money: prev.money + mission.reward
    }));

    addNotification({
      type: 'success',
      title: 'Mission Complete',
      message: `You've completed "${mission.title}" and earned $${mission.reward}!`,
      icon: '🏆',
      duration: 5000
    });
  };

  // Toggle side panel
  const toggleSidePanel = (panel: 'missions' | 'market' | 'community') => {
    if (activeSidePanel === panel) {
      setActiveSidePanel(null);
      setSidebarOpen(false);
    } else {
      setActiveSidePanel(panel);
      setSidebarOpen(true);
    }
  };

  // Share farm progress to community
  const shareToCommunity = () => {
    const post = {
      id: generateId(),
      author: {
        name: user?.name || 'Anonymous Farmer',
        location: 'Your Farm',
        verified: true
      },
      content: `Just achieved ${farmState.sustainability}% sustainability score! My crops are growing well with ${farmState.yield} total yield. The AI recommendations are really helping! 🌱`,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: ['sustainability', 'ai-recommendations', 'crop-yield'],
      category: 'Success Stories'
    };
    
    setCommunityPosts(prev => [post, ...prev]);
    
    addNotification({
      type: 'success',
      title: 'Shared to Community!',
      message: 'Your farm progress has been shared with the farming community.',
      icon: '👥',
      duration: 4000
    });
  };

  // Handle minigame score updates
  const handleMinigameScore = (score: number) => {
    // Give money reward based on minigame score
    if (score > 0) {
      const reward = score * 50; // $50 per crop collected
      setFarmState(prev => ({
        ...prev,
        money: prev.money + reward
      }));

      addNotification({
        type: 'success',
        title: 'Tractor Run Reward',
        message: `You earned $${reward} from your tractor run!`,
        icon: '🎮',
        duration: 4000
      });
    }
  };

  // Toggle real-world data display
  const toggleRealWorldData = () => {
    setShowRealWorldData(prev => !prev);
  };

  // Add progress to missions for demo purposes
  const missionsWithProgress = missions.map(mission => {
    if (farmState.activeMissions.includes(mission.id)) {
      return {
        ...mission,
        progress: Math.floor(Math.random() * 100)
      };
    }
    return mission;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Notifications */}
      <NotificationsContainer notifications={notifications} onDismiss={dismissNotification} />
      
      {/* Minigame */}
      {showMinigame && (
        <div className="fixed inset-0 z-50">
          <TractorRun onClose={() => setShowMinigame(false)} onScoreUpdate={handleMinigameScore} />
        </div>
      )}
      
      {/* Top bar with game info */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-green-700">FarmSphere</h1>
          <div className="flex items-center space-x-1 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {farmState.season}, Year {farmState.year}, Day {farmState.day}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            ${farmState.money.toLocaleString()}
          </div>
        </div>
        
        <div className="flex space-x-3">
          {/* Game Speed Controls */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-md p-1">
            <button 
              onClick={toggleAutoAdvance}
              className={`flex items-center px-2 py-1 rounded text-sm transition-colors ${
                autoAdvanceEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={autoAdvanceEnabled ? 'Pause Auto-Advance' : 'Enable Auto-Advance'}
            >
              {autoAdvanceEnabled ? '⏸️' : '▶️'}
            </button>
            
            <button 
              onClick={cycleGameSpeed}
              className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                GAME_SPEEDS[gameSpeed].multiplier > 1 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={`Game Speed: ${GAME_SPEEDS[gameSpeed].label}`}
            >
              <Zap className="h-3 w-3 mr-1" />
              {GAME_SPEEDS[gameSpeed].label}
              {autoAdvanceEnabled && ' ⚡'}
            </button>
          </div>

          <button onClick={toggleRealWorldData} className={`flex items-center px-3 py-1.5 rounded-md transition-colors text-sm ${showRealWorldData ? 'bg-green-500 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}>
            <MapPin className="h-4 w-4 mr-1" />
            Local Data
          </button>
          
          <button onClick={() => setShowMinigame(true)} className="flex items-center px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors text-sm">
            <Gamepad2 className="h-4 w-4 mr-1" />
            Tractor Run
          </button>
          
          <button onClick={() => toggleSidePanel('missions')} className={`flex items-center px-3 py-1.5 rounded-md transition-colors text-sm ${activeSidePanel === 'missions' ? 'bg-blue-500 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'}`}>
            <Award className="h-4 w-4 mr-1" />
            Missions
          </button>
          
          <button onClick={() => toggleSidePanel('market')} className={`flex items-center px-3 py-1.5 rounded-md transition-colors text-sm ${activeSidePanel === 'market' ? 'bg-green-500 text-white' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Market
          </button>

          <button onClick={() => toggleSidePanel('community')} className={`flex items-center px-3 py-1.5 rounded-md transition-colors text-sm ${activeSidePanel === 'community' ? 'bg-purple-500 text-white' : 'bg-purple-50 hover:bg-purple-100 text-purple-700'}`}>
            <Users className="h-4 w-4 mr-1" />
            Community
          </button>

          <button onClick={shareToCommunity} className="flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md transition-colors text-sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share Progress
          </button>

          <button onClick={() => navigate('/community')} className="flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Full Community
          </button>
          
          <button 
            onClick={advanceDay} 
            className="flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors text-sm" 
            title={autoAdvanceEnabled ? 'Auto-advance enabled' : 'Press SPACE to advance day'}
            disabled={autoAdvanceEnabled}
          >
            <Clock className="h-4 w-4 mr-1" />
            Next Day
          </button>
        </div>
      </div>

      {/* Main game area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Farm map */}
        <div className="flex-1 overflow-auto p-4">
          {/* Real-world data display */}
          {showRealWorldData && <RealWorldData onWeatherUpdate={handleWeatherUpdate} onSoilUpdate={handleSoilUpdate} />}
          
          {/* Active events display */}
          {farmState.activeEvents.length > 0 && <EventsSystem activeEvents={farmState.activeEvents} />}
          
          <FarmMap 
            plots={farmState.plots} 
            cropData={cropData} 
            selectedPlot={selectedPlot} 
            onSelectPlot={setSelectedPlot} 
          />
        </div>

        {/* Right panel - Data and controls (scrollable column) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-auto">
          {/* Scores */}
          <ScoreDisplay sustainability={farmState.sustainability} yield={farmState.yield} resilience={farmState.resilience} />
          
          {/* Data tabs */}
          <div className="border-t border-b border-gray-200">
            <div className="flex">
              <button className={`flex-1 py-2 text-sm font-medium ${activeDataTab === 'soil' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600'}`} onClick={() => setActiveDataTab('soil')}>
                Soil Data
              </button>
              <button className={`flex-1 py-2 text-sm font-medium ${activeDataTab === 'weather' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600'}`} onClick={() => setActiveDataTab('weather')}>
                Weather
              </button>
              <button className={`flex-1 py-2 text-sm font-medium ${activeDataTab === 'crops' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600'}`} onClick={() => setActiveDataTab('crops')}>
                Crop Health
              </button>
            </div>
          </div>
          
          {/* Data panel (no internal scrolling) */}
          <div className="p-4">
            <DataPanel 
              activeTab={activeDataTab} 
              soilData={soilMoistureData} 
              weatherData={rainfallData} 
              cropHealthData={vegetationData} 
              climateData={climateData} 
              selectedPlot={selectedPlot !== null ? farmState.plots[selectedPlot] : null} 
            />
          </div>
          
          {/* Real-world data above controls (compact) */}
          <div className="p-4 border-t border-gray-200">
            {showRealWorldData && (
              <div className="mb-4">
                <RealWorldData onWeatherUpdate={handleWeatherUpdate} onSoilUpdate={handleSoilUpdate} />
              </div>
            )}
            {/* Control panel directly below data, not overlapping */}
            <ControlPanel 
              selectedPlot={selectedPlot !== null ? farmState.plots[selectedPlot] : null} 
              crops={cropData} 
              onPlantCrop={plantCrop} 
              onIrrigate={irrigatePlot} 
              onFertilize={fertilizePlot} 
              onHarvest={harvestPlot} 
              disabled={selectedPlot === null} 
              money={farmState.money} 
            />
          </div>
        </div>

        {/* Side panel (Market/Missions/Community) */}
        {sidebarOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">
                {activeSidePanel === 'missions' ? 'Missions' : 
                 activeSidePanel === 'market' ? 'Market' : 'Community'}
              </h2>
              <button onClick={() => {
                setSidebarOpen(false);
                setActiveSidePanel(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {activeSidePanel === 'missions' && (
                <MissionsPanel 
                  missions={missionsWithProgress} 
                  activeMissions={farmState.activeMissions} 
                  completedMissions={farmState.completedMissions} 
                  onAcceptMission={acceptMission} 
                  onClaimReward={claimMissionReward} 
                />
              )}
              {activeSidePanel === 'market' && (
                <MarketPanel 
                  marketPrices={farmState.marketPrices} 
                  inventory={farmState.inventory} 
                  cropData={cropData} 
                  onSell={sellCrops} 
                />
              )}
              {activeSidePanel === 'community' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Community Feed</h3>
                    <button 
                      onClick={shareToCommunity}
                      className="flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md transition-colors text-sm"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                  
                  {communityPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No community posts yet.</p>
                      <p className="text-sm">Share your farm progress to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communityPosts.map((post) => (
                        <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {post.author.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{post.author.name}</div>
                              <div className="text-xs text-gray-500">{post.timestamp}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.tags.map((tag: string, index: number) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <button className="flex items-center gap-1 hover:text-red-500">
                              <span>❤️</span>
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-500">
                              <MessageSquare className="h-3 w-3" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-500">
                              <Share2 className="h-3 w-3" />
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDashboard;