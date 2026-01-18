import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Star, X, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const recentDestinations = [
  { id: 1, name: 'Home', address: '123 Main St, Downtown', lat: 40.7128, lng: -74.0060 },
  { id: 2, name: 'University Campus', address: '456 College Ave', lat: 40.7282, lng: -73.9942 },
  { id: 3, name: 'City Library', address: '789 Library Blvd', lat: 40.7484, lng: -73.9857 },
];

const savedPlaces = [
  { id: 1, name: 'Mom\'s House', address: '321 Family Lane', lat: 40.7580, lng: -73.9855 },
  { id: 2, name: 'Gym', address: '555 Fitness St', lat: 40.7614, lng: -73.9776 },
];

export default function DestinationSearch({ onSelectDestination, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // Simulated search delay
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleSelectDestination = (dest) => {
    onSelectDestination({
      destination_name: dest.name,
      destination_lat: dest.lat,
      destination_lng: dest.lng,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-950 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Where are you heading?"
              autoFocus
              className="pl-12 bg-gray-800 border-gray-700 text-white h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Location */}
        <Button
          onClick={() => handleSelectDestination({ 
            name: 'Current Location', 
            lat: 0, 
            lng: 0 
          })}
          variant="outline"
          className="w-full h-14 justify-start gap-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10
            border-violet-500/30 text-violet-400 hover:bg-violet-500/20 rounded-2xl"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <span>Use Current Location</span>
        </Button>

        {/* Saved Places */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Saved Places
          </h3>
          <div className="space-y-2">
            {savedPlaces.map((place) => (
              <motion.button
                key={place.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectDestination(place)}
                className="w-full p-4 bg-gray-800/50 rounded-2xl text-left 
                  border border-gray-700/50 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{place.name}</p>
                    <p className="text-sm text-gray-400">{place.address}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Destinations */}
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Destinations
          </h3>
          <div className="space-y-2">
            {recentDestinations.map((dest) => (
              <motion.button
                key={dest.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectDestination(dest)}
                className="w-full p-4 bg-gray-800/50 rounded-2xl text-left 
                  border border-gray-700/50 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{dest.name}</p>
                    <p className="text-sm text-gray-400">{dest.address}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}