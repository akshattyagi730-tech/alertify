import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils';

const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-50 w-full max-w-lg mx-4"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AlertDialogContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDialogHeader = ({ className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    />
  );
};

const AlertDialogTitle = ({ className, ...props }) => {
  return (
    <h2
      className={cn('text-lg font-semibold text-white', className)}
      {...props}
    />
  );
};

const AlertDialogDescription = ({ className, ...props }) => {
  return (
    <p
      className={cn('text-sm text-gray-400', className)}
      {...props}
    />
  );
};

const AlertDialogFooter = ({ className, ...props }) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
};

const AlertDialogAction = ({ className, onClick, children, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 py-2',
        'bg-violet-500 text-white font-semibold',
        'hover:bg-violet-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel = ({ className, onClick, children, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 py-2',
        'bg-gray-800 text-white border border-gray-700 font-semibold',
        'hover:bg-gray-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
