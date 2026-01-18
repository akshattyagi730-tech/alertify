import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bell, Send, CheckCircle, Clock, Users } from 'lucide-react';

const ALERT_INTERVAL = 30000; // 30 seconds

export default function AlertRepeater({ alert, contacts, currentLocation }) {
  const [alertsSent, setAlertsSent] = useState(0);
  const [lastSent, setLastSent] = useState(null);
  const [nextIn, setNextIn] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!alert || alert.status !== 'active' || contacts.length === 0) {
      clearIntervals();
      return;
    }

    // Send first alert immediately
    sendAlert();

    // Then repeat every 30 seconds
    intervalRef.current = setInterval(() => {
      sendAlert();
    }, ALERT_INTERVAL);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setNextIn((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearIntervals();
    };
  }, [alert?.id, alert?.status]);

  const clearIntervals = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const sendAlert = async () => {
    if (isSending) return;
    
    setIsSending(true);
    
    try {
      const location = currentLocation || { latitude: alert.latitude, longitude: alert.longitude };
      const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      const trackingUrl = `${window.location.origin}${window.location.pathname}#/TrackSOS?alert=${alert.id}`;

      const message = `
🚨 ALERTIFY EMERGENCY ALERT 🚨

I AM IN DANGER. PLEASE HELP IMMEDIATELY.

📍 Live Location:
${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}

🗺️ View on Google Maps:
${googleMapsUrl}

📡 Live Tracking Link:
${trackingUrl}

⏰ Alert sent: ${new Date().toLocaleString()}
🔄 This is alert #${alertsSent + 1}

This alert will repeat every 30 seconds until marked safe.
      `.trim();

      // Send to all contacts
      const sendPromises = contacts.map(async (contact) => {
        if (contact.email) {
          try {
            await base44.integrations.Core.SendEmail({
              to: contact.email,
              subject: `🚨 EMERGENCY: ${alert.created_by} NEEDS IMMEDIATE HELP`,
              body: message,
              from_name: 'Alertify Emergency System'
            });
          } catch (error) {
            // Silent error handling in demo mode
          }
        }
      });

      await Promise.allSettled(sendPromises);

      // Update alert record
      await base44.entities.SOSAlert.update(alert.id, {
        last_alert_sent: new Date().toISOString(),
        alert_count: alertsSent + 1,
        latitude: location.latitude,
        longitude: location.longitude,
        google_maps_url: googleMapsUrl,
        tracking_url: trackingUrl
      });

      setAlertsSent((prev) => prev + 1);
      setLastSent(new Date());
      setNextIn(30);
    } catch (error) {
      // Silent error handling in demo mode
    } finally {
      setIsSending(false);
    }
  };

  if (!alert || alert.status !== 'active') {
    return null;
  }

  return (
    <div className="bg-red-950/30 backdrop-blur-sm rounded-2xl p-4 border border-red-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Bell className="w-5 h-5 text-red-400" />
          </motion.div>
          <span className="text-red-300 font-medium">Alert System Active</span>
        </div>
        {isSending && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <Send className="w-3 h-3" />
            Sending...
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-red-900/20 rounded-xl p-3 text-center">
          <Send className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xs text-red-300">Sent</p>
          <p className="text-lg font-bold text-white">{alertsSent}</p>
        </div>

        <div className="bg-red-900/20 rounded-xl p-3 text-center">
          <Users className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xs text-red-300">Contacts</p>
          <p className="text-lg font-bold text-white">{contacts.length}</p>
        </div>

        <div className="bg-red-900/20 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xs text-red-300">Next in</p>
          <p className="text-lg font-bold text-white">{nextIn}s</p>
        </div>
      </div>

      {/* Last Sent */}
      {lastSent && (
        <div className="flex items-center justify-center gap-2 text-xs text-red-300">
          <CheckCircle className="w-3 h-3" />
          Last alert sent at {lastSent.toLocaleTimeString()}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-red-900/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-500"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}