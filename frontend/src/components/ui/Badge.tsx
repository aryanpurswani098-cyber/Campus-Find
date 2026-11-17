import React from 'react';

export type BadgeVariant =
  | 'lost' | 'found' | 'pending' | 'claimed' | 'recovered'
  | 'matched' | 'verified' | 'flagged' | 'rejected'
  | 'active' | 'archived';  // item status variants

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    lost:      'bg-red-100 text-red-700 border border-red-200',
    found:     'bg-green-100 text-green-700 border border-green-200',
    pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    claimed:   'bg-blue-100 text-blue-700 border border-blue-200',
    recovered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    matched:   'bg-purple-100 text-purple-700 border border-purple-200',
    verified:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    flagged:   'bg-orange-100 text-orange-700 border border-orange-200',
    rejected:  'bg-red-100 text-red-700 border border-red-200',
    active:    'bg-green-100 text-green-700 border border-green-200',
    archived:  'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
