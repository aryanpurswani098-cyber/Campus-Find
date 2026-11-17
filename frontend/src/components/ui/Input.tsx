import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && <label className="block text-sm font-medium text-cf-text-primary mb-1">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-lg border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-cf-border focus:ring-cf-green'
            } bg-white px-4 py-2 ${leftIcon ? 'pl-10' : ''} ${
              rightIcon ? 'pr-10' : ''
            } text-cf-text-primary focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && !error && <p className="mt-1 text-sm text-cf-text-secondary">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
