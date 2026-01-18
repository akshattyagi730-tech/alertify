import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Bell, AlertTriangle, Shield, CheckCircle, Clock, 
  MapPin, XCircle, Zap
} from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';

const alertTypeLabels = {
  manual: 'Manual SOS',
  auto_motion: 'Unusual Motion',
  auto_deviation: 'Route Deviation',
  auto_stop: 'Unexpected Stop',
};

const statusConfig = {
  active: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Active',
  },
  resolved: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    label: 'Resolved',
  },
  false_alarm: {
    icon: XCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    label: 'False Alarm',
  },
};

export default function Alerts() {
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['all-alerts'],
    queryFn: () => base44.entities.SOSAlert.list('-created_date'),
  });

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const pastAlerts = alerts.filter(a => a.status !== 'active');

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-amber-600/10 to-transparent" />
        <div className="relative px-6 pt-12 pb-6">
          <h1 className="text-2xl font-bold mb-2">Alert History</h1>
          <p className="text-gray-400">Your safety alerts and notifications</p>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              Active Alerts
            </h2>
            <div className="space-y-3">
              {activeAlerts.map((alert, index) => (
                <AlertCard key={alert.id} alert={alert} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Past Alerts */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Past Alerts</h2>
          {pastAlerts.length > 0 ? (
            <div className="space-y-3">
              {pastAlerts.map((alert, index) => (
                <AlertCard key={alert.id} alert={alert} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 
                flex items-center justify-center">
                <Shield className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No alerts yet</h3>
              <p className="text-gray-500">
                Your alert history will appear here
              </p>
            </motion.div>
          )}
        </section>

        {/* Safety Stats */}
        {alerts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Safety Statistics</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-gray-400">Total Alerts</span>
                </div>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-gray-400">Resolved</span>
                </div>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.status === 'resolved').length}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav currentPage="Alerts" />
    </div>
  );
}

function AlertCard({ alert, index }) {
  const config = statusConfig[alert.status] || statusConfig.resolved;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${config.bg} rounded-2xl p-4 border ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
          <StatusIcon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white">
              {alertTypeLabels[alert.trigger_type] || 'SOS Alert'}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
              {config.label}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(alert.created_date), 'MMM d, h:mm a')}
            </div>
            {alert.location_name && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {alert.location_name}
              </div>
            )}
          </div>

          {alert.resolved_at && (
            <p className="text-xs text-gray-500">
              Resolved at {format(new Date(alert.resolved_at), 'h:mm a')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}