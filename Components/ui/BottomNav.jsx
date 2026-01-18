import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Map, Users, Bell, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: Map, label: 'Journey', page: 'Journey' },
  { icon: Users, label: 'Contacts', page: 'Contacts' },
  { icon: Bell, label: 'Alerts', page: 'Alerts' },
  { icon: User, label: 'Profile', page: 'Profile' },
];

export default function BottomNav({ currentPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 z-40">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative flex flex-col items-center gap-1 py-2 px-4"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full 
                      bg-gradient-to-r from-violet-500 to-purple-500"
                  />
                )}
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-violet-400' : 'text-gray-500'
                  }`} 
                />
                <span 
                  className={`text-xs transition-colors ${
                    isActive ? 'text-violet-400 font-medium' : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}