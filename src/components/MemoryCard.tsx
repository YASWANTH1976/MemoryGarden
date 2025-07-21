import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Eye, Tag, Users } from 'lucide-react';
import { Memory } from '../types';
import { plantTypes } from '../data/plants';

interface MemoryCardProps {
  memory: Memory;
  onClick: () => void;
  onLike?: () => void;
  showStats?: boolean;
}

export function MemoryCard({ memory, onClick, onLike, showStats = false }: MemoryCardProps) {
  const plant = plantTypes[memory.plantType];
  const currentStage = plant.stages[Math.min(memory.growthStage, plant.stages.length - 1)];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-400 to-pink-400';
      case 'rare': return 'from-blue-400 to-indigo-400';
      case 'uncommon': return 'from-green-400 to-emerald-400';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${getRarityColor(plant.rarity)} p-0.5 rounded-xl cursor-pointer`}
      onClick={onClick}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 h-full">
        <div className="text-center mb-4">
          <motion.div 
            className="text-6xl mb-2"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {currentStage}
          </motion.div>
          <h3 className={`font-semibold ${plant.color} text-sm`}>
            {plant.type}
          </h3>
          <div className="text-xs text-gray-500 capitalize">
            {plant.rarity} • Mood: {memory.mood}/10
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 line-clamp-1">{memory.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{memory.description}</p>
          
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{memory.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(memory.date).toLocaleDateString()}
            </div>
          </div>
          
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {memory.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </span>
              ))}
              {memory.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{memory.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {memory.companions && memory.companions.length > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              <span>With {memory.companions.join(', ')}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-xs text-gray-500">
                Stage {memory.growthStage + 1}/{plant.stages.length}
              </div>
              {showStats && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {memory.likes}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                </div>
              )}
            </div>
            
            {onLike && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className="p-1 rounded-full hover:bg-red-50 transition-colors"
              >
                <Heart className="w-4 h-4 text-red-400 hover:text-red-500" />
              </motion.button>
            )}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((memory.growthStage + 1) / plant.stages.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}