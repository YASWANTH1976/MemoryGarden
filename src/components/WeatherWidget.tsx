import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData;
  weatherHistory: WeatherData[];
}

export function WeatherWidget({ weather, weatherHistory }: WeatherWidgetProps) {
  const getWeatherIcon = () => {
    if (weather.precipitation > 20) return <Droplets className="w-6 h-6 text-blue-500" />;
    if (weather.sunlight > 70) return <Sun className="w-6 h-6 text-yellow-500" />;
    return <Cloud className="w-6 h-6 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {getWeatherIcon()}
          <span className="ml-2">Garden Conditions</span>
        </h3>
        <div className="text-sm text-gray-500 capitalize">{weather.season}</div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
          <Sun className="w-5 h-5 text-yellow-500 mb-1" />
          <span className="text-xs text-gray-600">Sunlight</span>
          <span className="font-semibold text-yellow-600">{Math.round(weather.sunlight)}%</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-xs text-gray-600">Humidity</span>
          <span className="font-semibold text-blue-600">{Math.round(weather.humidity)}%</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
          <Thermometer className="w-5 h-5 text-red-500 mb-1" />
          <span className="text-xs text-gray-600">Temperature</span>
          <span className="font-semibold text-red-600">{Math.round(weather.temperature)}°F</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <Wind className="w-5 h-5 text-gray-500 mb-1" />
          <span className="text-xs text-gray-600">Wind</span>
          <span className="font-semibold text-gray-600">{Math.round(weather.windSpeed)} mph</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
          <Droplets className="w-5 h-5 text-indigo-500 mb-1" />
          <span className="text-xs text-gray-600">Rain</span>
          <span className="font-semibold text-indigo-600">{Math.round(weather.precipitation)}%</span>
        </div>
      </div>
      
      {weatherHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">24-Hour Trend</h4>
          <div className="flex space-x-1 h-8">
            {weatherHistory.slice(-12).map((w, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-200 to-green-400 rounded-sm"
                style={{ 
                  height: `${(w.sunlight / 100) * 100}%`,
                  opacity: 0.3 + (i / 12) * 0.7
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}