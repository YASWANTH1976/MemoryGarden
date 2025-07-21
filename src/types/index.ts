export interface Memory {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  emotion: 'joy' | 'peaceful' | 'adventurous' | 'nostalgic' | 'romantic' | 'energetic';
  plantType: string;
  growthStage: number;
  weatherData?: WeatherData;
  tags: string[];
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  photos?: string[];
  audioNote?: string;
  mood: number; // 1-10 scale
  companions?: string[];
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  sunlight: number;
  windSpeed: number;
  precipitation: number;
  season: string;
}

export interface Plant {
  type: string;
  stages: string[];
  color: string;
  growthFactors: {
    temperature: number;
    humidity: number;
    sunlight: number;
    windSpeed: number;
    precipitation: number;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  benefits: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gardenTheme: 'classic' | 'tropical' | 'desert' | 'forest' | 'zen';
  level: number;
  experience: number;
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserPreferences {
  notifications: boolean;
  publicProfile: boolean;
  autoGrowth: boolean;
  weatherEffects: boolean;
  soundEffects: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface GardenStats {
  totalMemories: number;
  plantsGrown: number;
  averageMood: number;
  mostCommonEmotion: string;
  longestGrowthStreak: number;
  favoriteLocation: string;
  memoryTrends: {
    month: string;
    count: number;
    averageMood: number;
  }[];
}