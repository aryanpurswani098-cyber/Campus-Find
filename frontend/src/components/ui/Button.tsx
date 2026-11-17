import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Using a motion div wrapping a button avoids Framer Motion / React DOM type conflicts
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, leftIcon, rightIcon, children, className = '', onClick, type = 'button', ...rest }, ref) => {

    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cf-green select-none';

    const variants = {
      primary:   'bg-cf-green text-white hover:bg-green-600',
      secondary: 'bg-white border border-cf-border text-cf-text-primary hover:bg-gray-50',
      ghost:     'bg-transparent text-cf-text-secondary hover:bg-gray-100 hover:text-cf-text-primary',
      danger:    'bg-red-500 text-white hover:bg-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={isDisabled ? {} : { y: -1.5, scale: 1.01 }}
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        disabled={isDisabled}
        onClick={onClick}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
