import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { 
  User, Bell, Shield, Moon, MapPin, Phone, Mail, 
  ChevronRight, LogOut, Clock, Settings, Info, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/ui/BottomNav';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    emergency_phone: '',
    home_address: '',
  });
  const [settings, setSettings] = useState({
    notifications: true,
    autoTracking: true,
    nightMode: true,
    shareLocation: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      const u = await base44.auth.me();
      setUser(u);
      setFormData({
        full_name: u?.full_name || '',
        emergency_phone: u?.emergency_phone || '',
        home_address: u?.home_address || '',
      });
    };
    loadUser();
  }, []);

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: (data) => {
      setUser(data);
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateUserMutation.mutate(formData);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent" />
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 
              flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.full_name || 'User'}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Personal Info */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-violet-400 hover:text-violet-300"
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
            {isEditing ? (
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Emergency Phone</Label>
                  <Input
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Home Address</Label>
                  <Input
                    value={formData.home_address}
                    onChange={(e) => setFormData({ ...formData, home_address: e.target.value })}
                    placeholder="Your home address"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            ) : (
              <>
                <SettingsRow
                  icon={User}
                  label="Full Name"
                  value={user?.full_name || 'Not set'}
                />
                <SettingsRow
                  icon={Mail}
                  label="Email"
                  value={user?.email || 'Not set'}
                />
                <SettingsRow
                  icon={Phone}
                  label="Emergency Phone"
                  value={user?.emergency_phone || 'Not set'}
                />
                <SettingsRow
                  icon={MapPin}
                  label="Home Address"
                  value={user?.home_address || 'Not set'}
                  isLast
                />
              </>
            )}
          </div>
        </section>

        {/* Safety Settings */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Safety Settings</h2>
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
            <SettingsToggle
              icon={Bell}
              label="Push Notifications"
              description="Get alerts for important updates"
              checked={settings.notifications}
              onChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
            <SettingsToggle
              icon={Shield}
              label="Auto Journey Tracking"
              description="Automatically detect journeys"
              checked={settings.autoTracking}
              onChange={(checked) => setSettings({ ...settings, autoTracking: checked })}
            />
            <SettingsToggle
              icon={Moon}
              label="Night Mode Alerts"
              description="Enhanced safety during night hours"
              checked={settings.nightMode}
              onChange={(checked) => setSettings({ ...settings, nightMode: checked })}
            />
            <SettingsToggle
              icon={MapPin}
              label="Share Location"
              description="Share location with contacts during journeys"
              checked={settings.shareLocation}
              onChange={(checked) => setSettings({ ...settings, shareLocation: checked })}
              isLast
            />
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Your Safety Stats</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
              <Clock className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-400">Journeys</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
              <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-400">Incidents</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-gray-400">Safe</p>
            </div>
          </div>
        </section>

        {/* About & Support */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
            <SettingsRow icon={Info} label="About Alertify" showArrow />
            <SettingsRow icon={Settings} label="App Settings" showArrow isLast />
          </div>
        </section>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-14 rounded-2xl bg-red-500/10 hover:bg-red-500/20 
            text-red-400 border border-red-500/20"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-sm text-gray-600">
          Alertify v1.0.0 • Your Safety Companion
        </p>
      </main>

      <BottomNav currentPage="Profile" />
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value, showArrow, isLast }) {
  return (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-gray-700/50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <span className="text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-500 text-sm">{value}</span>}
        {showArrow && <ChevronRight className="w-5 h-5 text-gray-600" />}
      </div>
    </div>
  );
}

function SettingsToggle({ icon: Icon, label, description, checked, onChange, isLast }) {
  return (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-gray-700/50' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="text-gray-300">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}