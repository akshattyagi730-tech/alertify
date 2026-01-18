import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, MapPin, Clock, Activity, AlertTriangle, 
  CheckCircle, Navigation, RefreshCw, Phone
} from 'lucide-react';
import SafeRouteMap from '@/components/map/SafeRouteMap';
import { Button } from '@/components/ui/button';

export default function TrackSOS() {
  const [alertId, setAlertId] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Get alert ID from URL
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('alert');
    setAlertId(id);
  }, []);

  const { data: alert, refetch: refetchAlert } = useQuery({
    queryKey: ['sos-alert', alertId],
    queryFn: async () => {
      if (!alertId) return null;
      const alerts = await base44.entities.SOSAlert.filter({ id: alertId });
      return alerts[0] || null;
    },
    enabled: !!alertId,
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds
  });

  const { data: locationUpdates = [] } = useQuery({
    queryKey: ['location-updates', alertId],
    queryFn: async () => {
      if (!alertId) return [];
      return await base44.entities.LocationUpdate.filter(
        { alert_id: alertId },
        '-timestamp',
        20
      );
    },
    enabled: !!alertId,
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const { data: user } = useQuery({
    queryKey: ['alert-user', alert?.created_by],
    queryFn: async () => {
      if (!alert?.created_by) return null;
      const users = await base44.entities.User.filter({ email: alert.created_by });
      return users[0] || null;
    },
    enabled: !!alert?.created_by,
  });

  useEffect(() => {
    if (locationUpdates.length > 0) {
      setLastUpdate(new Date(locationUpdates[0].timestamp));
    }
  }, [locationUpdates]);

  const latestLocation = locationUpdates[0] || alert;
  const currentPosition = latestLocation 
    ? [latestLocation.latitude, latestLocation.longitude]
    : null;

  const getTimeSince = (date) => {
    if (!date) return 'Unknown';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const handleRefresh = () => {
    refetchAlert();
  };

  if (!alertId) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Tracking Link</h1>
          <p className="text-gray-400">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-12 h-12 text-violet-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-400">Loading alert...</p>
        </div>
      </div>
    );
  }

  const isActive = alert.status === 'active';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="relative">
        <div className={`absolute inset-0 ${
          isActive 
            ? 'bg-gradient-to-br from-red-600/30 via-red-600/10' 
            : 'bg-gradient-to-br from-emerald-600/20 via-emerald-600/10'
        } to-transparent`} />
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {isActive ? '🚨 Emergency Alert Active' : '✅ Alert Resolved'}
              </h1>
              <p className="text-gray-400">
                Tracking {user?.full_name || 'User'}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>

          {/* Status Bar */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isActive 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-emerald-500/20 border border-emerald-500/30'
          }`}>
            {isActive ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="text-red-400 text-sm font-medium">
                  Live Tracking • Updates every 5s
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">
                  Person Marked Safe
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 pb-6 space-y-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-96 rounded-2xl overflow-hidden border border-gray-800"
        >
          {currentPosition && (
            <SafeRouteMap
              userLocation={currentPosition}
              destination={null}
              showRoute={false}
            />
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Location Updates</span>
            </div>
            <p className="text-2xl font-bold">{locationUpdates.length}</p>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-400">Last Update</span>
            </div>
            <p className="text-lg font-bold">{getTimeSince(lastUpdate)}</p>
          </div>
        </div>

        {/* Current Location */}
        {latestLocation && (
          <div className={`rounded-2xl p-4 border ${
            isActive 
              ? 'bg-red-500/10 border-red-500/20' 
              : 'bg-gray-800/50 border-gray-700/50'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActive ? 'bg-red-500/20' : 'bg-gray-700/50'
              }`}>
                <MapPin className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm mb-1 ${isActive ? 'text-red-300' : 'text-gray-400'}`}>
                  {isActive ? 'Live Location' : 'Last Known Location'}
                </p>
                <p className="text-sm font-mono text-white mb-2">
                  {latestLocation.latitude.toFixed(6)}, {latestLocation.longitude.toFixed(6)}
                </p>
                {latestLocation.accuracy && (
                  <p className="text-xs text-gray-500">
                    Accuracy: ±{Math.round(latestLocation.accuracy)}m
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps?q=${latestLocation.latitude},${latestLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm hover:underline mt-2 inline-flex items-center gap-1 ${
                    isActive ? 'text-red-400' : 'text-violet-400'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Alert Info */}
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
          <h3 className="font-semibold mb-3">Alert Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`font-medium ${
                isActive ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {isActive ? 'Active Emergency' : 'Resolved'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Started</span>
              <span className="text-white">
                {new Date(alert.created_date).toLocaleString()}
              </span>
            </div>
            {alert.resolved_at && (
              <div className="flex justify-between">
                <span className="text-gray-400">Resolved</span>
                <span className="text-white">
                  {new Date(alert.resolved_at).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Alerts Sent</span>
              <span className="text-white">{alert.alert_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Emergency Call */}
        {isActive && (
          <motion.a
            href="tel:911"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 p-4 bg-red-500 hover:bg-red-600 
              rounded-2xl text-white font-bold text-lg transition-colors"
          >
            <Phone className="w-6 h-6" />
            Call Emergency Services
          </motion.a>
        )}

        {/* Auto Refresh Toggle */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <RefreshCw className="w-3 h-3" />
          Auto-refresh every 5 seconds
        </div>
      </main>
    </div>
  );
}