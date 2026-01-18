import React from 'react';
import { motion } from 'framer-motion';
import { Server, AlertTriangle, Lock, Smartphone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BackendRequiredNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 
        rounded-2xl p-6 border border-amber-500/30"
    >
      {/* Icon Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <Server className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Backend Functions Required</h3>
          <p className="text-sm text-amber-300">Enable to unlock SMS emergency alerts</p>
        </div>
      </div>

      {/* Why Required */}
      <div className="bg-gray-900/50 rounded-xl p-4 mb-4 space-y-3">
        <h4 className="text-sm font-semibold text-white mb-2">Why Backend Functions?</h4>
        
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 font-medium">Security Protection</p>
            <p className="text-xs text-gray-400">SMS API keys cannot be exposed in browser code</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 font-medium">Real SMS Delivery</p>
            <p className="text-xs text-gray-400">Server-side integration with Twilio/Fast2SMS/MSG91</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-300 font-medium">Reliable Alerts</p>
            <p className="text-xs text-gray-400">30-second automated SMS with live location updates</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-300 font-medium mb-2">What You'll Get:</p>
        <ul className="space-y-1 text-xs text-blue-200">
          <li>✅ Real SMS to mobile phones (Android/iOS)</li>
          <li>✅ Automatic location updates every 30 seconds</li>
          <li>✅ Google Maps links in every SMS</li>
          <li>✅ Works even if contacts don't have the app</li>
          <li>✅ Production-grade Twilio/Fast2SMS integration</li>
          <li>✅ Secure API key management</li>
        </ul>
      </div>

      {/* How to Enable */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-violet-300 font-medium mb-3">How to Enable:</p>
        <ol className="space-y-2 text-xs text-violet-200">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">1</span>
            <span>Go to your app <strong>Dashboard → Settings</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">2</span>
            <span>Find <strong>Backend Functions</strong> section</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">3</span>
            <span>Click <strong>Enable Backend Functions</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">4</span>
            <span>Return here and I'll set up SMS integration</span>
          </li>
        </ol>
      </div>

      {/* Action Button */}
      <Button
        className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600
          hover:from-amber-500 hover:to-orange-500 text-white font-semibold"
        onClick={() => window.open('https://docs.base44.com/backend-functions', '_blank')}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Learn More About Backend Functions
      </Button>

      {/* Temporary Alternative */}
      <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">Current Limitation:</strong> Without backend functions, 
          the app can only send email alerts. Enable backend functions to unlock real SMS delivery 
          to mobile phones.
        </p>
      </div>
    </motion.div>
  );
}