import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Clock, CheckCircle, AlertTriangle, Phone } from 'lucide-react';

export default function SMSStatusPanel({ alert, smsSent, lastSMSTime, nextSMSIn }) {
  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </motion.div>
          <span className="text-blue-300 font-medium">SMS Alert System</span>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1 text-xs text-blue-400"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          Active
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Send className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">SMS Sent</p>
          <p className="text-lg font-bold text-white">{smsSent || 0}</p>
        </div>

        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Phone className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">Contacts</p>
          <p className="text-lg font-bold text-white">{alert?.contacts_notified?.length || 0}</p>
        </div>

        <div className="bg-blue-900/20 rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-blue-300">Next SMS</p>
          <p className="text-lg font-bold text-white">{nextSMSIn || 30}s</p>
        </div>
      </div>

      {/* Last SMS Info */}
      {lastSMSTime && (
        <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
          <CheckCircle className="w-3 h-3" />
          Last SMS: {new Date(lastSMSTime).toLocaleTimeString()}
        </div>
      )}

      {/* SMS Preview */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-300 mb-2 font-medium">SMS Message Preview:</p>
        <div className="text-xs text-white font-mono leading-relaxed">
          🚨 ALERTIFY SOS 🚨<br/>
          I am in danger. Please help immediately.<br/>
          <br/>
          📍 Live Location:<br/>
          https://maps.google.com/?q=...
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300">
          Real SMS messages are being sent to all trusted contacts' mobile phones every 30 seconds until you mark yourself safe.
        </p>
      </div>
    </div>
  );
}