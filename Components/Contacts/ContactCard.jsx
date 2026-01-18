import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Star, Trash2, Edit2, Users } from 'lucide-react';

const relationshipIcons = {
  family: '👨‍👩‍👧',
  friend: '👋',
  partner: '❤️',
  colleague: '💼',
  other: '👤'
};

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
];

export default function ContactCard({ contact, onEdit, onDelete, index = 0 }) {
  const colorClass = avatarColors[index % avatarColors.length];
  const initials = contact.name ? contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50
        hover:border-gray-600/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClass} 
          flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{contact.name}</h3>
            {contact.is_primary && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-400 truncate">{contact.phone}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">
              {relationshipIcons[contact.relationship] || '👤'} {contact.relationship || 'Contact'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(contact)}
            className="p-2 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 
              hover:text-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(contact)}
            className="p-2 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-red-500/20 
              hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
        <a
          href={`tel:${contact.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
            bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
              bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        )}
      </div>
    </motion.div>
  );
}