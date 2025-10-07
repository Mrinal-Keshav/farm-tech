import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Cloud, 
  Wind, 
  Sun,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface RealWorldDataProps {
  onWeatherUpdate: (weatherData: any) => void;
  onSoilUpdate: (soilData: any) => void;
}

const RealWorldData: React.FC<RealWorldDataProps> = ({ onWeatherUpdate, onSoilUpdate }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [soilData, setSoilData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Dhaka, Bangladesh');

  // Mock real-world data (in real app, this would come from APIs)
  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockWeather = {
      location: location,
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      rainfall: Math.floor(Math.random() * 20), // 0-20mm
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      pressure: Math.floor(Math.random() * 20) + 1000, // 1000-1020 hPa
      uvIndex: Math.floor(Math.random() * 8) + 1, // 1-8
      timestamp: new Date().toLocaleString()
    };
    
    setWeatherData(mockWeather);
    onWeatherUpdate(mockWeather);
    setLoading(false);
  };

  const fetchSoilData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockSoil = {
      location: location,
      moisture: Math.random() * 0.4 + 0.1, // 0.1-0.5
      temperature: Math.floor(Math.random() * 10) + 15, // 15-25°C
      ph: (Math.random() * 2 + 5).toFixed(1), // 5.0-7.0
      nutrients: {
        nitrogen: Math.floor(Math.random() * 50) + 20, // 20-70 ppm
        phosphorus: Math.floor(Math.random() * 30) + 10, // 10-40 ppm
        potassium: Math.floor(Math.random() * 100) + 50 // 50-150 ppm
      },
      organicMatter: (Math.random() * 3 + 2).toFixed(1), // 2.0-5.0%
      timestamp: new Date().toLocaleString()
    };
    
    setSoilData(mockSoil);
    onSoilUpdate(mockSoil);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeatherData();
    fetchSoilData();
  }, []);

  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'partly cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-600" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 0.2) return { status: 'Dry', color: 'text-red-600', bg: 'bg-red-50' };
    if (moisture < 0.3) return { status: 'Low', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (moisture < 0.4) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-50' };
    return { status: 'Optimal', color: 'text-green-700', bg: 'bg-green-100' };
  };

  const getNutrientStatus = (value: number, type: string) => {
    const ranges: any = {
      nitrogen: { low: 20, optimal: 40, high: 60 },
      phosphorus: { low: 15, optimal: 25, high: 35 },
      potassium: { low: 80, optimal: 120, high: 140 }
    };
    
    const range = ranges[type];
    if (value < range.low) return { status: 'Low', color: 'text-red-600' };
    if (value > range.high) return { status: 'High', color: 'text-orange-600' };
    return { status: 'Optimal', color: 'text-green-600' };
  };

  return (
    <div className="space-y-4 mb-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MapPin className="h-5 w-5" />
              Real-World Data Integration
            </CardTitle>
            <Button 
              onClick={() => {
                fetchWeatherData();
                fetchSoilData();
              }}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weather Data */}
          {weatherData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Weather Conditions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(weatherData.conditions)}
                    <div>
                      <div className="text-lg font-bold">{weatherData.temperature}°C</div>
                      <div className="text-sm text-gray-600">{weatherData.conditions}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>Humidity: {weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CloudRain className="h-4 w-4 text-blue-600" />
                      <span>Rainfall: {weatherData.rainfall}mm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>Wind: {weatherData.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Data */}
              {soilData && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Soil Conditions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Moisture:</span>
                      <Badge className={`${getMoistureStatus(soilData.moisture).bg} ${getMoistureStatus(soilData.moisture).color}`}>
                        {getMoistureStatus(soilData.moisture).status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">pH Level:</span>
                      <span className="text-sm font-medium">{soilData.ph}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temperature:</span>
                      <span className="text-sm font-medium">{soilData.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Organic Matter:</span>
                      <span className="text-sm font-medium">{soilData.organicMatter}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nutrient Analysis */}
          {soilData && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Nutrient Analysis</h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(soilData.nutrients).map(([nutrient, value]) => {
                  const status = getNutrientStatus(value as number, nutrient);
                  return (
                    <div key={nutrient} className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium capitalize">{nutrient}</div>
                      <div className="text-lg font-bold">{value} ppm</div>
                      <div className={`text-xs ${status.color}`}>{status.status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">AI Recommendations</h4>
            <div className="space-y-2">
              {weatherData && weatherData.rainfall > 10 && (
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800">Heavy Rain Expected</div>
                    <div className="text-blue-700">Consider delaying irrigation and protect crops from waterlogging.</div>
                  </div>
                </div>
              )}
              
              {soilData && soilData.moisture < 0.2 && (
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-orange-800">Low Soil Moisture</div>
                    <div className="text-orange-700">Consider irrigation to maintain optimal soil moisture levels.</div>
                  </div>
                </div>
              )}
              
              {weatherData && weatherData.temperature > 30 && (
                <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-red-800">High Temperature Alert</div>
                    <div className="text-red-700">Monitor crop stress and consider additional watering.</div>
                  </div>
                </div>
              )}
              
              {soilData && soilData.nutrients.nitrogen < 30 && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-yellow-800">Nitrogen Deficiency</div>
                    <div className="text-yellow-700">Consider applying nitrogen-rich fertilizer to improve crop growth.</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Last updated: {weatherData?.timestamp || 'Loading...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealWorldData;
