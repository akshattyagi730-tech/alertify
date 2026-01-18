import React from 'react';
import { motion } from 'framer-motion';

export default function StatusCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  color = 'violet',
  delay = 0 
}) {
  const colorClasses = {
    violet: {
      bg: 'from-violet-500/10 to-purple-500/10',
      border: 'border-violet-500/20',
      icon: 'bg-violet-500/20 text-violet-400',
      title: 'text-violet-300',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/20',
      icon: 'bg-emerald-500/20 text-emerald-400',
      title: 'text-emerald-300',
    },
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-400',
      title: 'text-blue-300',
    },
    orange: {
      bg: 'from-orange-500/10 to-amber-500/10',
      border: 'border-orange-500/20',
      icon: 'bg-orange-500/20 text-orange-400',
      title: 'text-orange-300',
    },
    red: {
      bg: 'from-red-500/10 to-rose-500/10',
      border: 'border-red-500/20',
      icon: 'bg-red-500/20 text-red-400',
      title: 'text-red-300',
    },
  };

  const colors = colorClasses[color] || colorClasses.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl p-4 
        border ${colors.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className={`text-xs ${colors.title} mb-1`}>{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}