import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Heart, MapPin, Calendar, Award } from 'lucide-react';
import { Memory, GardenStats as StatsType } from '../types';

interface GardenStatsProps {
  memories: Memory[];
  stats: StatsType;
}

export function GardenStats({ memories, stats }: GardenStatsProps) {
  const emotionCounts = memories.reduce((acc, memory) => {
    acc[memory.emotion] = (acc[memory.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emotionColors = {
    joy: 'bg-yellow-400',
    peaceful: 'bg-purple-400',
    adventurous: 'bg-pink-400',
    nostalgic: 'bg-green-400',
    romantic: 'bg-red-400',
    energetic: 'bg-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
        Garden Analytics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.totalMemories}</div>
          <div className="text-sm text-gray-600">Total Memories</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.plantsGrown}</div>
          <div className="text-sm text-gray-600">Plants Grown</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.averageMood.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Mood</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.longestGrowthStreak}</div>
          <div className="text-sm text-gray-600">Growth Streak</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Heart className="w-4 h-4 mr-1" />
          Emotion Distribution
        </h4>
        <div className="space-y-2">
          {Object.entries(emotionCounts).map(([emotion, count]) => (
            <div key={emotion} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 capitalize">{emotion}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                <div
                  className={`h-2 rounded-full ${emotionColors[emotion as keyof typeof emotionColors]}`}
                  style={{ width: `${(count / memories.length) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">{count}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Favorite Location
          </h4>
          <p className="text-gray-600">{stats.favoriteLocation}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Most Common Emotion
          </h4>
          <p className="text-gray-600 capitalize">{stats.mostCommonEmotion}</p>
        </div>
      </div>
      
      {stats.memoryTrends.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Memory Trends
          </h4>
          <div className="flex space-x-1 h-16">
            {stats.memoryTrends.map((trend, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="bg-green-400 rounded-t"
                  style={{ height: `${(trend.count / Math.max(...stats.memoryTrends.map(t => t.count))) * 100}%` }}
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {trend.month.slice(0, 3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}