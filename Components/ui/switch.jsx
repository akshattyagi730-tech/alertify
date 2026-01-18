import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

const Switch = React.forwardRef(({ 
  className, 
  checked = false, 
  onCheckedChange,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-violet-500' : 'bg-gray-700',
        className
      )}
      ref={ref}
      {...props}
    >
      <motion.span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform'
        )}
        animate={{
          x: checked ? 20 : 2,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
});

Switch.displayName = 'Switch';

export { Switch };
export default Switch;
