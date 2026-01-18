import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Phone, X } from 'lucide-react';

export default function SOSButton({ onTrigger, size = 'large' }) {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const holdDuration = 1500; // 1.5 seconds to trigger
  let progressTimer = null;

  const handlePressStart = () => {
    setIsPressed(true);
    setHoldProgress(0);
    
    const startTime = Date.now();
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / holdDuration) * 100, 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        clearInterval(progressTimer);
        setShowConfirm(true);
        setIsPressed(false);
      }
    }, 16);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    setHoldProgress(0);
    if (progressTimer) clearInterval(progressTimer);
  };

  const confirmSOS = () => {
    setShowConfirm(false);
    onTrigger?.();
  };

  const cancelSOS = () => {
    setShowConfirm(false);
    setHoldProgress(0);
  };

  const buttonSize = size === 'large' ? 'w-48 h-48' : 'w-32 h-32';
  const iconSize = size === 'large' ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <>
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing rings */}
        <motion.div
          className={`absolute ${buttonSize} rounded-full bg-red-500/20`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute ${buttonSize} rounded-full bg-red-500/30`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />

        {/* Progress ring */}
        {isPressed && (
          <svg 
            className={`absolute ${buttonSize} -rotate-90`}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * holdProgress / 100)}
            />
          </svg>
        )}

        {/* Main button */}
        <motion.button
          className={`relative ${buttonSize} rounded-full bg-gradient-to-br from-red-500 to-red-700 
            shadow-[0_0_60px_rgba(239,68,68,0.5)] flex items-center justify-center
            border-4 border-red-400/50 overflow-hidden`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full" />
          <div className="flex flex-col items-center gap-2 z-10">
            <Shield className={`${iconSize} text-white drop-shadow-lg`} />
            <span className="text-white font-bold text-lg tracking-wider">SOS</span>
          </div>
        </motion.button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full border border-red-500/30"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Phone className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Send SOS Alert?</h3>
                <p className="text-gray-400 mb-8">
                  This will alert all your trusted contacts with your current location.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={cancelSOS}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gray-800 text-white font-semibold
                      border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSOS}
                    className="flex-1 py-4 px-6 rounded-2xl bg-red-500 text-white font-bold
                      hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Send Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}