import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

const SelectContext = React.createContext(null);

const Select = ({ value, onValueChange, children, ...props }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, selectedValue, handleValueChange }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within Select');
  const { open, setOpen, selectedValue } = context;
  const triggerRef = useRef(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(triggerRef.current);
      } else {
        ref.current = triggerRef.current;
      }
    }
  }, [ref]);

  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-gray-700',
        'bg-gray-800 px-3 py-2 text-sm text-white',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children || <SelectValue />}
      <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')} />
    </button>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder = 'Select...' }) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within Select');
  const { selectedValue } = context;
  return <span>{selectedValue || placeholder}</span>;
};

SelectValue.displayName = 'SelectValue';

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');
  const { open, setOpen } = context;
  const contentRef = useRef(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(contentRef.current);
      } else {
        ref.current = contentRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-700',
            'bg-gray-800 p-1 shadow-lg',
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');
  const { handleValueChange, selectedValue } = context;
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      onClick={() => handleValueChange(value)}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm',
        'outline-none transition-colors',
        isSelected ? 'bg-violet-500/20 text-violet-400' : 'text-gray-300 hover:bg-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SelectItem.displayName = 'SelectItem';

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
