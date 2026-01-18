import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function JourneyTracker({ journey, onEndJourney, onSOS }) {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('tracking');

  useEffect(() => {
    if (!journey?.started_at) return;
    
    const startTime = new Date(journey.started_at).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [journey?.started_at]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedProgress = journey?.estimated_duration 
    ? Math.min((elapsed / 60 / journey.estimated_duration) * 100, 100)
    : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl 
        rounded-3xl p-6 border border-gray-700/50"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-emerald-500"
          />
          <span className="text-emerald-400 font-medium">Live Tracking Active</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Destination */}
      <div className="bg-gray-800/50 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Heading to</p>
            <p className="text-white font-semibold truncate">{journey?.destination_name || 'Unknown destination'}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(estimatedProgress)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${estimatedProgress}%` }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Safety Status */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Route Status</span>
          </div>
          <p className="text-white font-semibold">On Track</p>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Speed</span>
          </div>
          <p className="text-white font-semibold">Normal</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onEndJourney}
          className="flex-1 h-14 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 
            text-emerald-400 border border-emerald-500/30"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          I'm Safe
        </Button>
        <Button
          onClick={onSOS}
          className="flex-1 h-14 rounded-2xl bg-red-500/20 hover:bg-red-500/30 
            text-red-400 border border-red-500/30"
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          SOS
        </Button>
      </div>
    </motion.div>
  );
}