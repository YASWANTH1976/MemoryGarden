import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Tag, Users, Camera, Mic, Heart } from 'lucide-react';
import { Memory } from '../types';

interface MemoryFormProps {
  onSubmit: (memory: Omit<Memory, 'id' | 'plantType' | 'growthStage' | 'likes' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function MemoryForm({ onSubmit, onClose }: MemoryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    emotion: '' as Memory['emotion'],
    tags: [] as string[],
    companions: [] as string[],
    mood: 5,
    isPublic: false
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [currentCompanion, setCurrentCompanion] = useState('');

  const emotions = [
    { value: 'joy', label: 'Joyful & Energetic', emoji: '🌻', color: 'text-yellow-500' },
    { value: 'peaceful', label: 'Peaceful & Calm', emoji: '🪻', color: 'text-purple-500' },
    { value: 'adventurous', label: 'Adventurous & Excited', emoji: '🌸', color: 'text-pink-500' },
    { value: 'nostalgic', label: 'Nostalgic & Reflective', emoji: '🌳', color: 'text-green-600' },
    { value: 'romantic', label: 'Romantic & Loving', emoji: '🌹', color: 'text-red-500' },
    { value: 'energetic', label: 'High Energy & Intense', emoji: '🌵', color: 'text-green-500' }
  ];

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCompanion = () => {
    if (currentCompanion.trim() && !formData.companions.includes(currentCompanion.trim())) {
      setFormData(prev => ({
        ...prev,
        companions: [...prev.companions, currentCompanion.trim()]
      }));
      setCurrentCompanion('');
    }
  };

  const removeCompanion = (companionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter(companion => companion !== companionToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.emotion) return;
    
    onSubmit({
      ...formData,
      season: 'summer' as const
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Plant a New Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Memory Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Beach day with friends"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tell your story</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Describe what made this moment special..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Santa Monica Beach, CA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">How did it make you feel?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emotions.map((emotion) => (
                <motion.label
                  key={emotion.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.emotion === emotion.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="emotion"
                    value={emotion.value}
                    checked={formData.emotion === emotion.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, emotion: e.target.value as Memory['emotion'] }))}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{emotion.emoji}</span>
                  <div>
                    <div className={`font-medium ${emotion.color}`}>{emotion.label}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              Mood Level: {formData.mood}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Who was with you?
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentCompanion}
                onChange={(e) => setCurrentCompanion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompanion())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add a companion..."
              />
              <button
                type="button"
                onClick={addCompanion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.companions.map((companion) => (
                <span
                  key={companion}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {companion}
                  <button
                    type="button"
                    onClick={() => removeCompanion(companion)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this memory public (others can see and like it)
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.emotion}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Plant Memory
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}