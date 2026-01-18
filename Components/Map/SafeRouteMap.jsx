import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lightbulb, Users } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.DivIcon({
  html: `<div style="
    width: 24px; 
    height: 24px; 
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
  "></div>`,
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destinationIcon = new L.DivIcon({
  html: `<div style="
    width: 24px; 
    height: 24px; 
    background: linear-gradient(135deg, #10b981, #059669);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.5);
  "></div>`,
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

export default function SafeRouteMap({ 
  userLocation, 
  destination, 
  showRoute = true,
  dangerZones = [],
  safeZones = []
}) {
  const [routePoints, setRoutePoints] = useState([]);
  const defaultCenter = [40.7128, -74.0060];
  const center = userLocation || defaultCenter;

  // Generate a simulated safe route
  useEffect(() => {
    if (userLocation && destination) {
      const points = [];
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const lat = userLocation[0] + (destination[0] - userLocation[0]) * (i / steps);
        const lng = userLocation[1] + (destination[1] - userLocation[1]) * (i / steps);
        // Add slight curve for more natural route
        const offset = Math.sin((i / steps) * Math.PI) * 0.002;
        points.push([lat + offset, lng]);
      }
      setRoutePoints(points);
    }
  }, [userLocation, destination]);

  // Sample danger zones for demo
  const sampleDangerZones = [
    { center: [40.7150, -74.0080], radius: 100, level: 'high' },
    { center: [40.7200, -73.9980], radius: 150, level: 'medium' },
  ];

  const sampleSafeZones = [
    { center: [40.7180, -74.0020], radius: 80, name: 'Police Station' },
    { center: [40.7250, -73.9950], radius: 100, name: '24h Store' },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: '#1a1a2e' }}
      >
        <MapUpdater center={center} />
        
        {/* Dark mode tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Danger zones */}
        {sampleDangerZones.map((zone, idx) => (
          <Circle
            key={`danger-${idx}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.level === 'high' ? '#ef4444' : '#f97316',
              fillColor: zone.level === 'high' ? '#ef4444' : '#f97316',
              fillOpacity: 0.2,
              weight: 2,
              dashArray: '5, 5'
            }}
          />
        ))}

        {/* Safe zones */}
        {sampleSafeZones.map((zone, idx) => (
          <Circle
            key={`safe-${idx}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <Popup className="dark-popup">
              <div className="text-sm font-medium">{zone.name}</div>
            </Popup>
          </Circle>
        ))}

        {/* Route */}
        {showRoute && routePoints.length > 0 && (
          <>
            {/* Route shadow */}
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#8b5cf6',
                weight: 8,
                opacity: 0.3,
              }}
            />
            {/* Main route */}
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: '#8b5cf6',
                weight: 4,
                opacity: 1,
              }}
            />
          </>
        )}

        {/* User location */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Destination */}
        {destination && (
          <Marker position={destination} icon={destinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 
          border border-gray-700/50 space-y-2"
      >
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-gray-300">Your Route</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-300">Safe Zones</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-300">Avoid Areas</span>
        </div>
      </motion.div>
    </div>
  );
}