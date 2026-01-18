import React from 'react';
import { motion } from 'framer-motion';
import { 
  HandMetal, Bell, MapPin, Clock, Shield, 
  Smartphone, Users, AlertCircle 
} from 'lucide-react';

export default function SOSInstructions() {
  const steps = [
    {
      icon: HandMetal,
      title: 'Press & Hold SOS Button',
      description: 'Hold the red button for 3 seconds to activate emergency mode',
      color: 'text-red-400'
    },
    {
      icon: MapPin,
      title: 'GPS Tracking Starts',
      description: 'Your live location is tracked and updated every few seconds',
      color: 'text-blue-400'
    },
    {
      icon: Bell,
      title: 'Contacts Alerted',
      description: 'All trusted contacts receive instant emergency notifications',
      color: 'text-violet-400'
    },
    {
      icon: Clock,
      title: 'Repeated Alerts Every 30s',
      description: 'Alerts continue automatically with your latest location',
      color: 'text-amber-400'
    },
    {
      icon: Smartphone,
      title: 'Shareable Tracking Link',
      description: 'Contacts can view your live location on a map in real-time',
      color: 'text-emerald-400'
    },
    {
      icon: Shield,
      title: 'Mark Safe to Stop',
      description: 'Tap "I\'m Safe" to stop all alerts and tracking instantly',
      color: 'text-green-400'
    },
  ];

  return (
    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">How SOS Works</h3>
          <p className="text-sm text-gray-400">Real-time emergency alert system</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-900/50 flex items-center justify-center flex-shrink-0">
              <step.icon className={`w-4 h-4 ${step.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-1">{step.title}</h4>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
            <span className="text-xs text-gray-600 font-mono">{index + 1}/6</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-300 font-medium mb-1">Important</p>
            <p className="text-xs text-red-400">
              Only use SOS in genuine emergencies. False alarms can desensitize your contacts 
              and waste emergency response resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}