import React from 'react';
import { cn } from '@/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default',
  disabled,
  children,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    ghost: 'hover:bg-gray-800 hover:text-white',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-700 bg-transparent text-white hover:bg-gray-800',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;
