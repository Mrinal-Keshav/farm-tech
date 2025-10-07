import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Satellite,
  Cloud,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Sprout,
  MapPin,
  Calendar,
  Download
} from "lucide-react";

const Analysis = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [coords, setCoords] = useState<{ lat: number | null; lon: number | null }>({ lat: null, lon: null });
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string>('');
  const [liveWeather, setLiveWeather] = useState<{
    temperature?: number;
    humidity?: number;
    rainfall?: number;
    windSpeed?: number;
    uvIndex?: number;
    soilMoisture?: number; // placeholder if available later
    forecast?: Array<{ day: string; temp: number; rain: number; humidity: number }>
  }>({});

  // Attempt to use browser geolocation on mount
  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    setLoadingLive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
      },
      () => {
        setLoadingLive(false);
        setLiveError('Location permission denied. Enter coordinates to load live data.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch from Open-Meteo when coords available
  useEffect(() => {
    const fetchWeather = async () => {
      if (coords.lat == null || coords.lon == null) return;
      try {
        setLoadingLive(true);
        setLiveError('');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const forecast: Array<{ day: string; temp: number; rain: number; humidity: number }> = [];
        if (data?.daily?.time) {
          for (let i = 0; i < Math.min(5, data.daily.time.length); i++) {
            const date = new Date(data.daily.time[i]);
            forecast.push({
              day: days[date.getDay()],
              temp: Math.round(((data.daily.temperature_2m_max?.[i] ?? 0) + (data.daily.temperature_2m_min?.[i] ?? 0)) / 2),
              rain: Math.round(data.daily.precipitation_sum?.[i] ?? 0),
              humidity: Math.round(data.daily.relative_humidity_2m_mean?.[i] ?? 0)
            });
          }
        }
        setLiveWeather({
          temperature: Math.round(data?.current?.temperature_2m ?? 0),
          humidity: Math.round(data?.current?.relative_humidity_2m ?? 0),
          rainfall: Number(data?.current?.precipitation ?? 0),
          windSpeed: Math.round(data?.current?.wind_speed_10m ?? 0),
          uvIndex: Math.round(data?.current?.uv_index ?? 0),
          soilMoisture: undefined,
          forecast
        });
      } catch (e) {
        setLiveError('Failed to load live weather.');
      } finally {
        setLoadingLive(false);
      }
    };
    fetchWeather();
  }, [coords.lat, coords.lon]);

  const weatherData = {
    current: {
      temperature: liveWeather.temperature ?? 24,
      humidity: liveWeather.humidity ?? 65,
      rainfall: liveWeather.rainfall ?? 2.3,
      windSpeed: liveWeather.windSpeed ?? 12,
      uvIndex: liveWeather.uvIndex ?? 6,
      soilMoisture: liveWeather.soilMoisture ?? 78
    },
    forecast: liveWeather.forecast ?? [
      { day: 'Mon', temp: 26, rain: 0, humidity: 60 },
      { day: 'Tue', temp: 28, rain: 5, humidity: 70 },
      { day: 'Wed', temp: 25, rain: 12, humidity: 80 },
      { day: 'Thu', temp: 23, rain: 8, humidity: 75 },
      { day: 'Fri', temp: 27, rain: 0, humidity: 55 }
    ]
  };

  const cropAnalysis = [
    {
      name: 'Tomatoes',
      health: 92,
      growth: 'Excellent',
      stage: 'Flowering',
      expectedHarvest: '15 days',
      yield: '+18%',
      status: 'healthy',
      recommendations: ['Increase watering frequency', 'Monitor for pests']
    },
    {
      name: 'Corn',
      health: 78,
      growth: 'Good',
      stage: 'Vegetative',
      expectedHarvest: '45 days',
      yield: '+5%',
      status: 'attention',
      recommendations: ['Apply nitrogen fertilizer', 'Check soil pH']
    },
    {
      name: 'Wheat',
      health: 85,
      growth: 'Very Good',
      stage: 'Grain Filling',
      expectedHarvest: '22 days',
      yield: '+12%',
      status: 'healthy',
      recommendations: ['Reduce irrigation', 'Prepare for harvest']
    }
  ];

  const soilData = {
    ph: 6.8,
    nitrogen: 85,
    phosphorus: 72,
    potassium: 90,
    organicMatter: 3.2,
    moisture: 78,
    temperature: 18
  };

  const satelliteImages = [
    { date: '2024-01-15', type: 'NDVI', vegetation: 0.78, coverage: '98%' },
    { date: '2024-01-10', type: 'RGB', vegetation: 0.75, coverage: '96%' },
    { date: '2024-01-05', type: 'Infrared', vegetation: 0.72, coverage: '94%' }
  ];

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'text-primary';
    if (health >= 70) return 'text-earth-gold';
    return 'text-destructive';
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy': return { variant: 'default' as const, icon: CheckCircle };
      case 'attention': return { variant: 'secondary' as const, icon: AlertTriangle };
      case 'warning': return { variant: 'destructive' as const, icon: AlertTriangle };
      default: return { variant: 'outline' as const, icon: CheckCircle };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Farm Analysis</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered insights using satellite data and real-time local weather
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Satellite className="w-3 h-3" />
              Satellite Data Active
            </Badge>
            <Button variant="outline" size="sm" onClick={() => {
              if ('geolocation' in navigator) {
                setLoadingLive(true);
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                    setLoadingLive(false);
                  },
                  () => {
                    setLoadingLive(false);
                    setLiveError('Location permission denied. Enter coordinates below.');
                  }
                );
              }
            }}>
              <Download className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
          </div>
        </div>

        {(liveError || loadingLive || coords.lat == null) && (
          <div className="mb-6 p-4 bg-accent rounded-lg flex flex-col gap-3">
            {liveError && <div className="text-sm text-destructive">{liveError}</div>}
            {loadingLive && <div className="text-sm text-muted-foreground">Fetching live weather…</div>}
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Enter latitude/longitude:</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="px-2 py-1 border rounded-md bg-background text-sm w-32"
                  placeholder="Latitude"
                  onChange={(e) => setCoords(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                />
                <input
                  className="px-2 py-1 border rounded-md bg-background text-sm w-32"
                  placeholder="Longitude"
                  onChange={(e) => setCoords(prev => ({ ...prev, lon: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.temperature}°C</div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.humidity}%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Cloud className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.rainfall}mm</div>
              <div className="text-xs text-muted-foreground">Rainfall</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wind className="w-6 h-6 text-gray-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.windSpeed} km/h</div>
              <div className="text-xs text-muted-foreground">Wind Speed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.uvIndex}</div>
              <div className="text-xs text-muted-foreground">UV Index</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sprout className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{weatherData.current.soilMoisture}%</div>
              <div className="text-xs text-muted-foreground">Soil Moisture</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crops">Crop Analysis</TabsTrigger>
            <TabsTrigger value="soil">Soil Health</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
          </TabsList>

          {/* Crop Analysis Tab */}
          <TabsContent value="crops" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select 
                value={selectedCrop} 
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Crops</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="corn">Corn</option>
                <option value="wheat">Wheat</option>
              </select>
              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="season">This Season</option>
              </select>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {cropAnalysis.map((crop, index) => {
                const badgeInfo = getHealthBadge(crop.status);
                const BadgeIcon = badgeInfo.icon;
                
                return (
                  <Card key={index} className="hover:shadow-soft transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{crop.name}</CardTitle>
                        <Badge variant={badgeInfo.variant} className="flex items-center gap-1">
                          <BadgeIcon className="w-3 h-3" />
                          {crop.growth}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Health Score</span>
                          <span className={`font-bold ${getHealthColor(crop.health)}`}>
                            {crop.health}%
                          </span>
                        </div>
                        <Progress value={crop.health} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Stage</span>
                          <div className="font-medium text-foreground">{crop.stage}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Harvest</span>
                          <div className="font-medium text-foreground">{crop.expectedHarvest}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Yield Change</span>
                          <div className={`font-medium flex items-center gap-1 ${
                            crop.yield.startsWith('+') ? 'text-primary' : 'text-destructive'
                          }`}>
                            {crop.yield.startsWith('+') ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {crop.yield}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">AI Recommendations</span>
                        <ul className="space-y-1">
                          {crop.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Soil Health Tab */}
          <TabsContent value="soil" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Soil Composition</CardTitle>
                  <CardDescription>Current nutrient levels and pH balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">pH Level</span>
                      <span className="font-bold text-foreground">{soilData.ph}</span>
                    </div>
                    <Progress value={((soilData.ph - 6) / 2) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">Optimal range: 6.0 - 7.5</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nitrogen (N)</span>
                      <span className="font-bold text-primary">{soilData.nitrogen}%</span>
                    </div>
                    <Progress value={soilData.nitrogen} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Phosphorus (P)</span>
                      <span className="font-bold text-earth-gold">{soilData.phosphorus}%</span>
                    </div>
                    <Progress value={soilData.phosphorus} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Potassium (K)</span>
                      <span className="font-bold text-primary">{soilData.potassium}%</span>
                    </div>
                    <Progress value={soilData.potassium} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Factors</CardTitle>
                  <CardDescription>Physical soil conditions and moisture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-xl font-bold text-foreground">{soilData.moisture}%</div>
                      <div className="text-sm text-muted-foreground">Moisture</div>
                    </div>
                    <div className="text-center">
                      <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-xl font-bold text-foreground">{soilData.temperature}°C</div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                    </div>
                  </div>
                  
                  <div className="bg-accent p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Organic Matter</h4>
                    <div className="text-2xl font-bold text-primary mb-1">{soilData.organicMatter}%</div>
                    <div className="text-sm text-muted-foreground">Excellent level for crop growth</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Recommendations</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span>Maintain current nitrogen levels</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-earth-gold" />
                        <span>Consider phosphorus supplement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span>Soil moisture is optimal</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                  <CardDescription>Weather predictions for optimal farm planning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div className="font-medium text-foreground">{day.day}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span>{day.temp}°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Cloud className="w-4 h-4 text-blue-500" />
                            <span>{day.rain}mm</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <span>{day.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Alerts</CardTitle>
                  <CardDescription>Important weather conditions to monitor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Cloud className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Rain Expected</div>
                      <div className="text-sm text-blue-700">Moderate rainfall expected Wednesday. Good for crops, check drainage.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Sun className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-900">High UV Index</div>
                      <div className="text-sm text-yellow-700">UV index reaching 8+ this weekend. Consider protective measures for sensitive crops.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Optimal Conditions</div>
                      <div className="text-sm text-green-700">Perfect weather for harvest activities Monday-Tuesday.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Satellite Tab */}
          <TabsContent value="satellite" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-primary" />
                    Recent Satellite Images
                  </CardTitle>
                  <CardDescription>High-resolution imagery from space data providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {satelliteImages.map((image, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{image.date}</span>
                        </div>
                        <Badge variant="outline">{image.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Vegetation Index</span>
                          <div className="font-bold text-primary">{image.vegetation}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Coverage</span>
                          <div className="font-bold text-foreground">{image.coverage}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 h-32 bg-gradient-nature rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MapPin className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm">Satellite Image Placeholder</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vegetation Analysis</CardTitle>
                  <CardDescription>AI-powered crop health assessment from satellite data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">0.78</div>
                    <div className="text-muted-foreground">Current NDVI Score</div>
                    <div className="text-sm text-green-600 mt-1">Excellent vegetation health</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Crop Coverage</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Health Score</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Growth Rate</span>
                        <span className="font-medium">112%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>

                  <div className="bg-accent p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Key Insights</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span>Vegetation density increased 12% this month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        <span>No signs of disease or pest damage</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-earth-gold" />
                        <span>Monitor southwest corner for irrigation needs</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;