import { Plant } from '../types';

export const plantTypes: Record<string, Plant> = {
  sunflower: {
    type: 'Sunflower of Joy',
    stages: ['🌱', '🌿', '🌻', '🌻✨', '🌻🌟'],
    color: 'text-yellow-500',
    growthFactors: { temperature: 0.8, humidity: 0.3, sunlight: 0.9, windSpeed: 0.2, precipitation: 0.4 },
    rarity: 'common',
    description: 'A bright flower that thrives in happiness and warm memories',
    benefits: ['Boosts mood', 'Attracts positive energy', 'Grows quickly in summer']
  },
  lavender: {
    type: 'Lavender of Peace',
    stages: ['🌱', '🌿', '🪻', '🪻💜', '🪻✨'],
    color: 'text-purple-500',
    growthFactors: { temperature: 0.6, humidity: 0.4, sunlight: 0.7, windSpeed: 0.3, precipitation: 0.3 },
    rarity: 'uncommon',
    description: 'A calming herb that flourishes in moments of tranquility',
    benefits: ['Promotes relaxation', 'Enhances meditation', 'Improves sleep quality']
  },
  wildflower: {
    type: 'Wildflower of Adventure',
    stages: ['🌱', '🌿', '🌸', '🌸🦋', '🌸🌈'],
    color: 'text-pink-500',
    growthFactors: { temperature: 0.7, humidity: 0.6, sunlight: 0.8, windSpeed: 0.5, precipitation: 0.6 },
    rarity: 'common',
    description: 'A free-spirited bloom that loves exploration and new experiences',
    benefits: ['Encourages creativity', 'Boosts confidence', 'Attracts opportunities']
  },
  oak: {
    type: 'Oak of Nostalgia',
    stages: ['🌱', '🌿', '🌳', '🌳🍂', '🌳👑'],
    color: 'text-green-600',
    growthFactors: { temperature: 0.5, humidity: 0.7, sunlight: 0.6, windSpeed: 0.4, precipitation: 0.8 },
    rarity: 'rare',
    description: 'A wise tree that grows stronger with cherished memories',
    benefits: ['Provides wisdom', 'Strengthens roots', 'Offers protection']
  },
  rose: {
    type: 'Rose of Romance',
    stages: ['🌱', '🌿', '🌹', '🌹💕', '🌹👑'],
    color: 'text-red-500',
    growthFactors: { temperature: 0.7, humidity: 0.5, sunlight: 0.8, windSpeed: 0.2, precipitation: 0.5 },
    rarity: 'uncommon',
    description: 'A passionate flower that blooms in moments of love and connection',
    benefits: ['Enhances relationships', 'Attracts love', 'Boosts charisma']
  },
  cactus: {
    type: 'Cactus of Energy',
    stages: ['🌱', '🌿', '🌵', '🌵⚡', '🌵🔥'],
    color: 'text-green-500',
    growthFactors: { temperature: 0.9, humidity: 0.1, sunlight: 0.9, windSpeed: 0.3, precipitation: 0.1 },
    rarity: 'rare',
    description: 'A resilient plant that thrives in high-energy, intense moments',
    benefits: ['Increases endurance', 'Boosts energy', 'Builds resilience']
  },
  cherry: {
    type: 'Cherry Blossom of Renewal',
    stages: ['🌱', '🌿', '🌸', '🌸🌸', '🌸✨'],
    color: 'text-pink-400',
    growthFactors: { temperature: 0.6, humidity: 0.6, sunlight: 0.7, windSpeed: 0.4, precipitation: 0.7 },
    rarity: 'legendary',
    description: 'A mystical tree that represents new beginnings and transformation',
    benefits: ['Promotes growth', 'Brings renewal', 'Attracts good fortune']
  }
};

export const getPlantByEmotion = (emotion: string): string => {
  const mapping = {
    joy: 'sunflower',
    peaceful: 'lavender',
    adventurous: 'wildflower',
    nostalgic: 'oak',
    romantic: 'rose',
    energetic: 'cactus'
  };
  return mapping[emotion as keyof typeof mapping] || 'sunflower';
};

export const getRandomRarePlant = (): string => {
  const rarePlants = Object.keys(plantTypes).filter(
    key => plantTypes[key].rarity === 'rare' || plantTypes[key].rarity === 'legendary'
  );
  return rarePlants[Math.floor(Math.random() * rarePlants.length)];
};