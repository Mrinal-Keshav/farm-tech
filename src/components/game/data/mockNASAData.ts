// Mock data to simulate NASA datasets

// Soil Moisture Active Passive (SMAP) data
export const soilMoistureData = {
  current: 0.28, // volumetric water content (0-0.5 range)
  history: [
    { date: '2023-01-01', value: 0.35 },
    { date: '2023-01-08', value: 0.32 },
    { date: '2023-01-15', value: 0.3 },
    { date: '2023-01-22', value: 0.28 },
    { date: '2023-01-29', value: 0.25 },
    { date: '2023-02-05', value: 0.22 },
    { date: '2023-02-12', value: 0.2 },
    { date: '2023-02-19', value: 0.31 },
    { date: '2023-02-26', value: 0.28 }
  ],
  optimal: {
    wheat: { min: 0.2, max: 0.3 },
    corn: { min: 0.22, max: 0.32 },
    soybeans: { min: 0.25, max: 0.35 },
    rice: { min: 0.3, max: 0.45 }
  }
};

// Global Precipitation Measurement (GPM) data
export const rainfallData = {
  forecast: [
    { day: 1, amount: 0, probability: 5 },
    { day: 2, amount: 0, probability: 10 },
    { day: 3, amount: 5, probability: 60 },
    { day: 4, amount: 12, probability: 80 },
    { day: 5, amount: 3, probability: 40 },
    { day: 6, amount: 0, probability: 15 },
    { day: 7, amount: 0, probability: 5 }
  ],
  historical: [
    { month: 'Jan', amount: 45 },
    { month: 'Feb', amount: 38 },
    { month: 'Mar', amount: 62 },
    { month: 'Apr', amount: 78 },
    { month: 'May', amount: 95 },
    { month: 'Jun', amount: 68 },
    { month: 'Jul', amount: 55 },
    { month: 'Aug', amount: 40 },
    { month: 'Sep', amount: 47 },
    { month: 'Oct', amount: 53 },
    { month: 'Nov', amount: 60 },
    { month: 'Dec', amount: 48 }
  ]
};

// Normalized Difference Vegetation Index (NDVI) data
export const vegetationData = {
  current: 0.65, // 0-1 range, higher is healthier
  fieldSections: [
    { id: 'A1', ndvi: 0.72, health: 'excellent' },
    { id: 'A2', ndvi: 0.68, health: 'good' },
    { id: 'A3', ndvi: 0.58, health: 'moderate' },
    { id: 'B1', ndvi: 0.64, health: 'good' },
    { id: 'B2', ndvi: 0.45, health: 'poor' },
    { id: 'B3', ndvi: 0.61, health: 'good' },
    { id: 'C1', ndvi: 0.69, health: 'good' },
    { id: 'C2', ndvi: 0.71, health: 'excellent' },
    { id: 'C3', ndvi: 0.52, health: 'moderate' }
  ],
  interpretation: {
    '0.0-0.2': 'Barren or dead vegetation',
    '0.2-0.4': 'Unhealthy vegetation',
    '0.4-0.6': 'Moderate vegetation health',
    '0.6-0.8': 'Healthy vegetation',
    '0.8-1.0': 'Very dense, healthy vegetation'
  }
};

// Temperature and Climate data (MERRA-2/POWER)
export const climateData = {
  current: {
    temperature: 24, // Celsius
    humidity: 65, // percentage
    windSpeed: 8 // km/h
  },
  forecast: [
    { day: 'Mon', high: 26, low: 18, condition: 'sunny' },
    { day: 'Tue', high: 27, low: 19, condition: 'sunny' },
    { day: 'Wed', high: 25, low: 18, condition: 'cloudy' },
    { day: 'Thu', high: 23, low: 17, condition: 'rain' },
    { day: 'Fri', high: 22, low: 16, condition: 'rain' },
    { day: 'Sat', high: 24, low: 17, condition: 'cloudy' },
    { day: 'Sun', high: 25, low: 18, condition: 'sunny' }
  ],
  growingDegreeData: [
    { month: 'Jan', value: 220 },
    { month: 'Feb', value: 240 },
    { month: 'Mar', value: 280 },
    { month: 'Apr', value: 340 },
    { month: 'May', value: 420 },
    { month: 'Jun', value: 490 },
    { month: 'Jul', value: 510 },
    { month: 'Aug', value: 495 },
    { month: 'Sep', value: 430 },
    { month: 'Oct', value: 360 },
    { month: 'Nov', value: 290 },
    { month: 'Dec', value: 240 }
  ]
};

// Available crops data
export const cropData = [
  {
    id: 1,
    name: 'Wheat',
    growthDays: 120,
    growthStages: [
      { name: 'Seedling', days: 15, icon: '🌱' },
      { name: 'Vegetative', days: 30, icon: '🌿' },
      { name: 'Reproductive', days: 45, icon: '🌾' },
      { name: 'Mature', days: 30, icon: '🌾' }
    ],
    waterNeeds: 'medium',
    optimalTemp: { min: 15, max: 24 },
    optimalSoilMoisture: { min: 0.2, max: 0.3 },
    sustainabilityScore: 75,
    basePrice: 220,
    icon: '🌾',
    pestResistance: 'medium',
    droughtResistance: 'high'
  },
  {
    id: 2,
    name: 'Corn',
    growthDays: 90,
    growthStages: [
      { name: 'Seedling', days: 10, icon: '🌱' },
      { name: 'Vegetative', days: 35, icon: '🌿' },
      { name: 'Reproductive', days: 25, icon: '🌽' },
      { name: 'Mature', days: 20, icon: '🌽' }
    ],
    waterNeeds: 'high',
    optimalTemp: { min: 18, max: 28 },
    optimalSoilMoisture: { min: 0.22, max: 0.32 },
    sustainabilityScore: 65,
    basePrice: 180,
    icon: '🌽',
    pestResistance: 'low',
    droughtResistance: 'low'
  },
  {
    id: 3,
    name: 'Soybeans',
    growthDays: 100,
    growthStages: [
      { name: 'Seedling', days: 10, icon: '🌱' },
      { name: 'Vegetative', days: 30, icon: '🌿' },
      { name: 'Flowering', days: 30, icon: '🌸' },
      { name: 'Mature', days: 30, icon: '🫘' }
    ],
    waterNeeds: 'medium',
    optimalTemp: { min: 20, max: 30 },
    optimalSoilMoisture: { min: 0.25, max: 0.35 },
    sustainabilityScore: 80,
    basePrice: 320,
    icon: '🫘',
    pestResistance: 'medium',
    droughtResistance: 'medium'
  },
  {
    id: 4,
    name: 'Rice',
    growthDays: 120,
    growthStages: [
      { name: 'Seedling', days: 20, icon: '🌱' },
      { name: 'Tillering', days: 30, icon: '🌿' },
      { name: 'Reproductive', days: 40, icon: '🌾' },
      { name: 'Ripening', days: 30, icon: '🍚' }
    ],
    waterNeeds: 'very high',
    optimalTemp: { min: 22, max: 32 },
    optimalSoilMoisture: { min: 0.3, max: 0.45 },
    sustainabilityScore: 60,
    basePrice: 250,
    icon: '🍚',
    pestResistance: 'low',
    droughtResistance: 'very low'
  },
  {
    id: 5,
    name: 'Potatoes',
    growthDays: 80,
    growthStages: [
      { name: 'Sprout', days: 10, icon: '🌱' },
      { name: 'Vegetative', days: 30, icon: '🌿' },
      { name: 'Tuber', days: 30, icon: '🥔' },
      { name: 'Mature', days: 10, icon: '🥔' }
    ],
    waterNeeds: 'medium',
    optimalTemp: { min: 15, max: 20 },
    optimalSoilMoisture: { min: 0.22, max: 0.32 },
    sustainabilityScore: 85,
    basePrice: 200,
    icon: '🥔',
    pestResistance: 'high',
    droughtResistance: 'medium'
  }
];

// Random events data
export const randomEvents = [
  {
    id: 1,
    name: 'Drought',
    description: 'NASA satellite data indicates a drought is affecting your region. Crops need more water than usual.',
    effect: 'All plots lose 30% moisture. Water costs increase by 50% for 10 days.',
    severity: 'high',
    duration: 10,
    icon: '☀️',
    probability: 5, // percentage chance per season
    seasons: ['Summer']
  },
  {
    id: 2,
    name: 'Heavy Rain',
    description: 'NASA GPM data shows heavy rainfall approaching. Some fields may flood.',
    effect: 'All plots gain 40% moisture. Some crops may be damaged by excess water.',
    severity: 'medium',
    duration: 5,
    icon: '🌧️',
    probability: 10,
    seasons: ['Spring', 'Fall']
  },
  {
    id: 3,
    name: 'Pest Outbreak',
    description: 'Satellite imagery shows signs of pest activity in your region.',
    effect: 'Crop health decreases by 20% unless treated with pesticides.',
    severity: 'medium',
    duration: 7,
    icon: '🐛',
    probability: 15,
    seasons: ['Spring', 'Summer']
  },
  {
    id: 4,
    name: 'Market Boom',
    description: 'Global food shortages have increased demand for your crops.',
    effect: 'All crop prices increase by 30% for 15 days.',
    severity: 'positive',
    duration: 15,
    icon: '📈',
    probability: 8,
    seasons: ['Winter', 'Spring', 'Summer', 'Fall']
  },
  {
    id: 5,
    name: 'Market Crash',
    description: 'Overproduction has led to a surplus in the market.',
    effect: 'All crop prices decrease by 25% for 12 days.',
    severity: 'high',
    duration: 12,
    icon: '📉',
    probability: 7,
    seasons: ['Fall', 'Winter']
  },
  {
    id: 6,
    name: 'Perfect Growing Conditions',
    description: 'NASA climate data shows ideal growing conditions for the next period.',
    effect: 'All crops grow 25% faster for 8 days.',
    severity: 'positive',
    duration: 8,
    icon: '🌈',
    probability: 10,
    seasons: ['Spring', 'Summer']
  },
  {
    id: 7,
    name: 'Early Frost',
    description: 'NASA temperature data indicates an unexpected early frost.',
    effect: 'Crops in early growth stages may be damaged or destroyed.',
    severity: 'high',
    duration: 3,
    icon: '❄️',
    probability: 12,
    seasons: ['Fall']
  },
  {
    id: 8,
    name: 'Heatwave',
    description: 'NASA temperature data predicts an extended heatwave.',
    effect: 'Water evaporates 50% faster. Crops may wither without extra irrigation.',
    severity: 'high',
    duration: 6,
    icon: '🔥',
    probability: 15,
    seasons: ['Summer']
  }
];

// Missions and objectives
export const missions = [
  {
    id: 1,
    title: 'Sustainable Start',
    description: 'Maintain a sustainability score above 75 for 30 days',
    reward: 2000,
    type: 'sustainability',
    target: 75,
    duration: 30,
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'Crop Diversity',
    description: 'Grow at least 3 different crop types simultaneously',
    reward: 3000,
    type: 'diversity',
    target: 3,
    difficulty: 'medium'
  },
  {
    id: 3,
    title: 'Water Conservation',
    description: 'Keep average soil moisture between 25-30% for 20 days',
    reward: 2500,
    type: 'water',
    target: { min: 0.25, max: 0.3 },
    duration: 20,
    difficulty: 'medium'
  },
  {
    id: 4,
    title: 'Bountiful Harvest',
    description: 'Harvest 10 plots of crops in a single season',
    reward: 5000,
    type: 'harvest',
    target: 10,
    difficulty: 'hard'
  },
  {
    id: 5,
    title: 'Weather the Storm',
    description: 'Survive a major weather event with minimal crop loss',
    reward: 4000,
    type: 'resilience',
    difficulty: 'hard'
  },
  {
    id: 6,
    title: 'Market Master',
    description: 'Sell crops for a total of 10,000 during a market boom',
    reward: 3000,
    type: 'market',
    target: 10000,
    difficulty: 'medium'
  }
];

// Initial farm state
export const initialFarmState = {
  size: { width: 6, height: 6 }, // 6x6 grid
  plots: Array(36).fill(null).map((_, index) => ({
    id: index,
    x: index % 6,
    y: Math.floor(index / 6),
    crop: null,
    cropAge: 0,
    growthStage: 0,
    health: Math.random() * 0.3 + 0.6, // 0.6-0.9 range
    soilHealth: Math.random() * 0.3 + 0.6, // 0.6-0.9 range
    moisture: Math.random() * 0.15 + 0.2, // 0.2-0.35 range
    plantedDate: null,
    harvestReady: false,
    lastWatered: null,
    lastFertilized: null
  })),
  livestock: [],
  equipment: [
    { id: 1, name: 'Basic Tractor', efficiency: 1.0, fuelUsage: 'high' },
    { id: 2, name: 'Irrigation System', efficiency: 1.0, waterEfficiency: 'standard' }
  ],
  sustainability: 70,
  yield: 0,
  resilience: 60,
  day: 1,
  season: 'Spring',
  year: 1,
  money: 10000,
  level: 1,
  xp: 0,
  activeEvents: [],
  completedMissions: [],
  activeMissions: [1, 2], // Starting missions
  unlockedResearch: [],
  marketPrices: {
    wheat: 220,
    corn: 180,
    soybeans: 320,
    rice: 250,
    potatoes: 200
  },
  inventory: {
    wheat: 0,
    corn: 0,
    soybeans: 0,
    rice: 0,
    potatoes: 0
  },
  stats: {
    totalHarvested: 0,
    totalEarned: 0,
    totalPlanted: 0,
    weatherEventsSurvived: 0
  }
};

