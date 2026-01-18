import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { MessageSquare, Send, CheckCircle, Clock, Phone, AlertTriangle } from 'lucide-react';

const SMS_INTERVAL = 30000; // 30 seconds

export default function SMSAlertRepeater({ alert, contacts, currentLocation, onSMSUpdate }) {
  const [smsSent, setSmsSent] = useState(0);
  const [lastSent, setLastSent] = useState(null);
  const [nextIn, setNextIn] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState(null);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!alert || alert.status !== 'active' || contacts.length === 0) {
      clearIntervals();
      return;
    }

    // Send first SMS immediately
    sendSMS(false);

    // Then repeat every 30 seconds
    intervalRef.current = setInterval(() => {
      sendSMS(false);
    }, SMS_INTERVAL);

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

  const sendSMS = async (isFinalMessage = false) => {
    if (isSending && !isFinalMessage) return;
    
    setIsSending(true);
    setLastError(null);
    
    try {
      const location = currentLocation || { 
        latitude: alert.latitude, 
        longitude: alert.longitude 
      };

      // Get user info
      const user = await base44.auth.me();
      
      // Extract phone numbers from contacts
      const contactPhones = contacts
        .map(c => c.phone)
        .filter(phone => phone && phone.trim());

      if (contactPhones.length === 0) {
        setLastError('No valid phone numbers found in contacts');
        setIsSending(false);
        return;
      }

      // Call backend SendSOSSMS function directly
      try {
        const response = await base44.functions.SendSOSSMS({
          alertId: alert.id,
          contactPhones,
          latitude: location.latitude,
          longitude: location.longitude,
          userName: user.full_name || 'Alertify User',
          alertNumber: smsSent + 1,
          isFinalMessage
        });

        if (response.success) {
          if (!isFinalMessage) {
            setSmsSent((prev) => prev + 1);
            setLastSent(new Date());
            setNextIn(30);
          }
          
          if (onSMSUpdate) {
            onSMSUpdate({
              smsSent: smsSent + 1,
              lastSent: new Date(),
              success: true
            });
          }
        } else {
          setLastError(response.error || 'SMS failed to send');
        }
      } catch (funcError) {
        setLastError(funcError.message || 'Failed to send SMS');
      }
    } catch (error) {
      // Silent error handling in demo mode
      setLastError(error.message || 'Failed to send SMS');
    } finally {
      setIsSending(false);
    }
  };

  // Public method to send final "I'm safe" SMS
  useEffect(() => {
    if (alert?.status === 'resolved' && smsSent > 0) {
      sendSMS(true);
    }
  }, [alert?.status]);

  if (!alert || alert.status !== 'active') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </motion.div>
          <span className="text-blue-300 font-medium">SMS Alert System</span>
        </div>
        {isSending && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-1 text-xs text-blue-400"
          >
            <Send className="w-3 h-3" />
            Sending...
          </motion.div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Send className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">SMS Sent</p>
          <p className="text-lg font-bold text-white">{smsSent}</p>
        </div>

        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Phone className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">Contacts</p>
          <p className="text-lg font-bold text-white">{contacts.length}</p>
        </div>

        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">Next SMS</p>
          <p className="text-lg font-bold text-white">{nextIn}s</p>
        </div>
      </div>

      {/* Last Sent */}
      {lastSent && (
        <div className="flex items-center justify-center gap-2 text-xs text-blue-300 mb-3">
          <CheckCircle className="w-3 h-3" />
          Last SMS: {lastSent.toLocaleTimeString()}
        </div>
      )}

      {/* Error Display */}
      {lastError && (
        <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-300 font-medium">SMS Error</p>
              <p className="text-xs text-red-400 mt-1">{lastError}</p>
            </div>
          </div>
        </div>
      )}

      {/* SMS Preview */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl mb-3">
        <p className="text-xs text-blue-300 mb-2 font-medium">SMS Message:</p>
        <div className="text-xs text-white font-mono leading-relaxed">
          🚨 ALERTIFY SOS 🚨<br/>
          <br/>
          I am in danger. Please help immediately.<br/>
          <br/>
          📍 Live Location:<br/>
          https://maps.google.com/?q=...
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-blue-900/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}