import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a URL path for a given page name
 */
export function createPageUrl(pageName) {
  const pageMap = {
    'Home': '/',
    'Journey': '/journey',
    'Contacts': '/contacts',
    'Alerts': '/alerts',
    'Profile': '/profile',
    'TrackSOS': '/track-sos',
  };
  
  return pageMap[pageName] || `/${pageName.toLowerCase()}`;
}
