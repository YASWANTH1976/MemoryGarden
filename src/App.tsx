import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Plus, BarChart3, Download, Settings, Search, Filter, Grid, List } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import { Memory, GardenStats as StatsType } from './types';
import { plantTypes, getPlantByEmotion, getRandomRarePlant } from './data/plants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeather } from './hooks/useWeather';

import { WeatherWidget } from './components/WeatherWidget';
import { MemoryCard } from './components/MemoryCard';
import { MemoryForm } from './components/MemoryForm';
import { GardenStats } from './components/GardenStats';
import { ExportOptions } from './components/ExportOptions';

function App() {
  const [memories, setMemories] = useLocalStorage<Memory[]>('memory-garden-memories', []);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmotion, setFilterEmotion] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'mood' | 'growth'>('date');
  
  const { currentWeather, weatherHistory } = useWeather();

  // Auto-grow plants based on weather conditions
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setMemories(prev => prev.map(memory => {
        const plant = plantTypes[memory.plantType];
        const weatherMatch = 
          (currentWeather.temperature / 100) * plant.growthFactors.temperature +
          (currentWeather.humidity / 100) * plant.growthFactors.humidity +
          (currentWeather.sunlight / 100) * plant.growthFactors.sunlight +
          (currentWeather.windSpeed / 15) * plant.growthFactors.windSpeed +
          (currentWeather.precipitation / 100) * plant.growthFactors.precipitation;
        
        const shouldGrow = Math.random() < weatherMatch * 0.08;
        const maxStage = plant.stages.length - 1;
        
        if (shouldGrow && memory.growthStage < maxStage) {
          const newStage = memory.growthStage + 1;
          if (newStage === maxStage) {
            toast.success(`🌟 Your ${plant.type} has fully bloomed!`, {
              duration: 4000,
              position: 'top-right',
            });
          }
          
          return {
            ...memory,
            growthStage: newStage,
            weatherData: currentWeather,
            updatedAt: new Date().toISOString()
          };
        }
        
        return {
          ...memory,
          weatherData: currentWeather
        };
      }));
    }, 8000);

    return () => clearInterval(growthInterval);
  }, [currentWeather, setMemories]);

  const addMemory = (memoryData: Omit<Memory, 'id' | 'plantType' | 'growthStage' | 'likes' | 'createdAt' | 'updatedAt'>) => {
    let plantType = getPlantByEmotion(memoryData.emotion);
    
    // Rare plant chance based on mood
    if (memoryData.mood >= 9 && Math.random() < 0.15) {
      plantType = getRandomRarePlant();
      toast.success('🎉 You discovered a rare plant!', {
        duration: 4000,
        position: 'top-right',
      });
    }
    
    const newMemory: Memory = {
      ...memoryData,
      id: Date.now().toString(),
      plantType,
      growthStage: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setMemories(prev => [...prev, newMemory]);
    setShowForm(false);
    
    toast.success('🌱 Memory planted successfully!', {
      duration: 3000,
      position: 'top-right',
    });
  };

  const likeMemory = (memoryId: string) => {
    setMemories(prev => prev.map(memory => 
      memory.id === memoryId 
        ? { ...memory, likes: memory.likes + 1, updatedAt: new Date().toISOString() }
        : memory
    ));
    toast.success('❤️ Memory liked!', { duration: 2000 });
  };

  // Calculate garden statistics
  const gardenStats: StatsType = {
    totalMemories: memories.length,
    plantsGrown: memories.filter(m => m.growthStage > 0).length,
    averageMood: memories.length > 0 ? memories.reduce((sum, m) => sum + m.mood, 0) / memories.length : 0,
    mostCommonEmotion: memories.length > 0 ? 
      Object.entries(memories.reduce((acc, m) => ({ ...acc, [m.emotion]: (acc[m.emotion] || 0) + 1 }), {} as Record<string, number>))
        .sort(([,a], [,b]) => b - a)[0][0] : '',
    longestGrowthStreak: Math.max(...memories.map(m => m.growthStage), 0),
    favoriteLocation: memories.length > 0 ?
      Object.entries(memories.reduce((acc, m) => ({ ...acc, [m.location]: (acc[m.location] || 0) + 1 }), {} as Record<string, number>))
        .sort(([,a], [,b]) => b - a)[0][0] : '',
    memoryTrends: []
  };

  // Filter and sort memories
  const filteredMemories = memories
    .filter(memory => {
      const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmotion = !filterEmotion || memory.emotion === filterEmotion;
      return matchesSearch && matchesEmotion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'mood':
          return b.mood - a.mood;
        case 'growth':
          return b.growthStage - a.growthStage;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Sprout className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Memory Garden</h1>
                <p className="text-sm text-gray-600">Where memories bloom into stories</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(true)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="View Statistics"
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExport(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Export Garden"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Plant Memory</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Weather Widget */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <WeatherWidget weather={currentWeather} weatherHistory={weatherHistory} />
      </div>

      {/* Search and Filter Controls */}
      {memories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Emotions</option>
                  <option value="joy">Joy</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="adventurous">Adventurous</option>
                  <option value="nostalgic">Nostalgic</option>
                  <option value="romantic">Romantic</option>
                  <option value="energetic">Energetic</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'mood' | 'growth')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="mood">Sort by Mood</option>
                  <option value="growth">Sort by Growth</option>
                </select>
                
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        {filteredMemories.length === 0 && memories.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sprout className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your garden awaits</h2>
            <p className="text-gray-600 mb-6">Plant your first summer memory and watch it grow into something beautiful</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full transition-colors duration-200"
            >
              Plant Your First Memory
            </motion.button>
          </motion.div>
        ) : filteredMemories.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No memories found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <motion.div
            className={`memory-grid ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {filteredMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => setSelectedMemory(memory)}
                  onLike={() => likeMemory(memory.id)}
                  showStats={true}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <MemoryForm
            onSubmit={addMemory}
            onClose={() => setShowForm(false)}
          />
        )}
        
        {showStats && (
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
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Garden Statistics</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <GardenStats memories={memories} stats={gardenStats} />
            </motion.div>
          </motion.div>
        )}
        
        {showExport && (
          <ExportOptions
            memories={memories}
            onClose={() => setShowExport(false)}
          />
        )}
        
        {selectedMemory && (
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
              <div className="text-center mb-6">
                <motion.div 
                  className="text-8xl mb-4"
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
                  {plantTypes[selectedMemory.plantType].stages[selectedMemory.growthStage]}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedMemory.title}</h2>
                <p className={`font-semibold ${plantTypes[selectedMemory.plantType].color}`}>
                  {plantTypes[selectedMemory.plantType].type}
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  {plantTypes[selectedMemory.plantType].rarity} • Mood: {selectedMemory.mood}/10
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Your Story</h3>
                  <p className="text-gray-600">{selectedMemory.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      📍 Location
                    </h4>
                    <p className="text-gray-600">{selectedMemory.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center mb-1">
                      📅 Date
                    </h4>
                    <p className="text-gray-600">{new Date(selectedMemory.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedMemory.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedMemory.companions && selectedMemory.companions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Companions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemory.companions.map((companion) => (
                        <span
                          key={companion}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {companion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Plant Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plantTypes[selectedMemory.plantType].benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Growth Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((selectedMemory.growthStage + 1) / plantTypes[selectedMemory.plantType].stages.length) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Stage {selectedMemory.growthStage + 1} of {plantTypes[selectedMemory.plantType].stages.length}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => likeMemory(selectedMemory.id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  ❤️ Like ({selectedMemory.likes})
                </button>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;