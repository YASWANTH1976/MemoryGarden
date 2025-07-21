import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    temperature: 75,
    humidity: 60,
    sunlight: 80,
    windSpeed: 5,
    precipitation: 10,
    season: 'summer'
  });

  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newWeather: WeatherData = {
        temperature: 65 + Math.random() * 25,
        humidity: 40 + Math.random() * 40,
        sunlight: 60 + Math.random() * 40,
        windSpeed: Math.random() * 15,
        precipitation: Math.random() * 30,
        season: getCurrentSeason()
      };
      
      setCurrentWeather(newWeather);
      setWeatherHistory(prev => [...prev.slice(-23), newWeather]); // Keep last 24 hours
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  return { currentWeather, weatherHistory };
}