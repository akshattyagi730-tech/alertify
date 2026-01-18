import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function AddContactModal({ isOpen, onClose, onSave, editContact }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'friend',
    is_primary: false,
    notify_on_journey: true
  });

  useEffect(() => {
    if (editContact) {
      setFormData({
        name: editContact.name || '',
        phone: editContact.phone || '',
        email: editContact.email || '',
        relationship: editContact.relationship || 'friend',
        is_primary: editContact.is_primary || false,
        notify_on_journey: editContact.notify_on_journey !== false
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        relationship: 'friend',
        is_primary: false,
        notify_on_journey: true
      });
    }
  }, [editContact, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editContact?.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto
              border-t sm:border border-gray-800"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 p-6 pb-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editContact ? 'Edit Contact' : 'Add Trusted Contact'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="pl-12 bg-gray-800 border-gray-700 text-white h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-gray-300">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    required
                    className="pl-12 bg-gray-800 border-gray-700 text-white h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-300">Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    type="email"
                    className="pl-12 bg-gray-800 border-gray-700 text-white h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Relationship */}
              <div className="space-y-2">
                <Label className="text-gray-300">Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="family">👨‍👩‍👧 Family</SelectItem>
                    <SelectItem value="friend">👋 Friend</SelectItem>
                    <SelectItem value="partner">❤️ Partner</SelectItem>
                    <SelectItem value="colleague">💼 Colleague</SelectItem>
                    <SelectItem value="other">👤 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-white font-medium">Primary Contact</p>
                      <p className="text-sm text-gray-400">First to be notified in emergencies</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Journey Notifications</p>
                      <p className="text-sm text-gray-400">Notify when I start a journey</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.notify_on_journey}
                    onCheckedChange={(checked) => setFormData({ ...formData, notify_on_journey: checked })}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600
                  hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-lg mt-4"
              >
                {editContact ? 'Update Contact' : 'Add Contact'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}