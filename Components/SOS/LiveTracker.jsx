import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Activity, Wifi, WifiOff, Clock } from 'lucide-react';

export default function LiveTracker({ alert, onLocationUpdate }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (!alert || alert.status !== 'active') {
      stopTracking();
      return;
    }

    startTracking();

    return () => {
      stopTracking();
    };
  }, [alert]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      return;
    }

    setIsTracking(true);

    // High accuracy tracking
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: new Date().toISOString()
        };

        setCurrentPosition(locationData);
        setAccuracy(position.coords.accuracy);
        setUpdateCount(prev => prev + 1);
        setLastUpdate(new Date());

        // Send to parent for database storage
        if (onLocationUpdate) {
          onLocationUpdate(locationData);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsTracking(false);
      },
      options
    );
  };

  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
  };

  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isTracking ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <span className="text-red-400 font-medium text-sm">Live Tracking Active</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 font-medium text-sm">Tracking Stopped</span>
            </>
          )}
        </div>
        <Wifi className={`w-4 h-4 ${isTracking ? 'text-emerald-400' : 'text-gray-600'}`} />
      </div>

      {/* Location Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Updates</p>
          <p className="text-sm font-bold text-white">{updateCount}</p>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <Navigation className="w-4 h-4 text-violet-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Accuracy</p>
          <p className="text-sm font-bold text-white">
            {accuracy ? `${Math.round(accuracy)}m` : '--'}
          </p>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Last Update</p>
          <p className="text-xs font-mono text-white">
            {lastUpdate ? formatTime(lastUpdate) : '--:--'}
          </p>
        </div>
      </div>

      {/* Current Position */}
      {currentPosition && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-red-300 mb-1">Live Location</p>
              <p className="text-xs font-mono text-white truncate">
                {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
              </p>
              <a
                href={`https://www.google.com/maps?q=${currentPosition.latitude},${currentPosition.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 underline mt-1 inline-block"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}