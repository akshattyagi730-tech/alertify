import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, Navigation, Clock, Shield, ChevronRight, 
  Play, Square, AlertTriangle, CheckCircle, Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/ui/BottomNav';
import DestinationSearch from '@/components/journey/DestinationSearch';
import JourneyTracker from '@/components/journey/JourneyTracker';
import SafeRouteMap from '@/components/map/SafeRouteMap';
import SOSActiveAlert from '@/components/alerts/SOSActiveAlerts';

export default function Journey() {
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  
  const queryClient = useQueryClient();

  // Get user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        // Default to NYC if location denied
        setUserLocation([40.7128, -74.0060]);
      }
    );
  }, []);

  const { data: journeys = [] } = useQuery({
    queryKey: ['journeys'],
    queryFn: () => base44.entities.Journey.list('-created_date', 10),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.TrustedContact.list(),
  });

  const activeJourney = journeys.find(j => j.status === 'active');

  const startJourneyMutation = useMutation({
    mutationFn: (data) => base44.entities.Journey.create({
      ...data,
      status: 'active',
      started_at: new Date().toISOString(),
      start_lat: userLocation?.[0],
      start_lng: userLocation?.[1],
      estimated_duration: 30, // Default 30 min
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      setSelectedDestination(null);
    },
  });

  const endJourneyMutation = useMutation({
    mutationFn: (id) => base44.entities.Journey.update(id, {
      status: 'completed',
      ended_at: new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: (data) => base44.entities.SOSAlert.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setActiveAlert(data);
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: (id) => base44.entities.SOSAlert.update(id, { 
      status: 'resolved',
      resolved_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setActiveAlert(null);
    },
  });

  const handleSelectDestination = (dest) => {
    setSelectedDestination(dest);
    setShowSearch(false);
  };

  const handleStartJourney = () => {
    if (selectedDestination) {
      startJourneyMutation.mutate(selectedDestination);
    }
  };

  const handleSOSTrigger = () => {
    createAlertMutation.mutate({
      trigger_type: 'manual',
      latitude: userLocation?.[0] || 0,
      longitude: userLocation?.[1] || 0,
      location_name: 'Current Location',
      journey_id: activeJourney?.id,
      contacts_notified: contacts.map(c => c.id),
    });
  };

  const recentJourneys = journeys.filter(j => j.status === 'completed').slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Active Alert */}
      <AnimatePresence>
        {activeAlert && (
          <SOSActiveAlert
            alert={activeAlert}
            contacts={contacts}
            onResolve={() => resolveAlertMutation.mutate(activeAlert.id)}
            onCancel={() => resolveAlertMutation.mutate(activeAlert.id)}
          />
        )}
      </AnimatePresence>

      {/* Destination Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <DestinationSearch
            onSelectDestination={handleSelectDestination}
            onClose={() => setShowSearch(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent" />
        <div className="relative px-6 pt-12 pb-6">
          <h1 className="text-2xl font-bold mb-2">Journey Tracker</h1>
          <p className="text-gray-400">Travel safely with real-time tracking</p>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-64 rounded-2xl overflow-hidden border border-gray-800"
        >
          <SafeRouteMap
            userLocation={userLocation}
            destination={
              activeJourney 
                ? [activeJourney.destination_lat, activeJourney.destination_lng]
                : selectedDestination 
                  ? [selectedDestination.destination_lat, selectedDestination.destination_lng]
                  : null
            }
            showRoute={!!(activeJourney || selectedDestination)}
          />
        </motion.div>

        {/* Active Journey */}
        {activeJourney ? (
          <JourneyTracker
            journey={activeJourney}
            onEndJourney={() => endJourneyMutation.mutate(activeJourney.id)}
            onSOS={handleSOSTrigger}
          />
        ) : selectedDestination ? (
          /* Destination Selected - Start Journey */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Destination</p>
                <h3 className="font-semibold text-lg">{selectedDestination.destination_name}</h3>
              </div>
              <button
                onClick={() => setSelectedDestination(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Change
              </button>
            </div>

            {/* Route Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/50 rounded-xl">
                <Route className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Distance</p>
                <p className="font-semibold">2.4 km</p>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">ETA</p>
                <p className="font-semibold">28 min</p>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-xl">
                <Shield className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                <p className="text-xs text-gray-400">Safety</p>
                <p className="font-semibold text-emerald-400">Good</p>
              </div>
            </div>

            <Button
              onClick={handleStartJourney}
              disabled={startJourneyMutation.isPending}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600
                hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {startJourneyMutation.isPending ? 'Starting...' : 'Start Safe Journey'}
            </Button>
          </motion.div>
        ) : (
          /* No Journey - Search for Destination */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowSearch(true)}
              className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50
                hover:border-violet-500/30 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center
                  group-hover:bg-violet-500/30 transition-colors">
                  <Navigation className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Where are you going?</p>
                  <p className="font-semibold">Enter your destination</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </button>
          </motion.div>
        )}

        {/* Recent Journeys */}
        {recentJourneys.length > 0 && !activeJourney && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Recent Journeys</h2>
            <div className="space-y-3">
              {recentJourneys.map((journey, index) => (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-xl p-4 border border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{journey.destination_name}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(journey.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-full">
                      Completed
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav currentPage="Journey" />
    </div>
  );
}