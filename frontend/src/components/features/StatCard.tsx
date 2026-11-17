import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color = 'text-cf-green', trend }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 1000;
      const incrementTime = 20;
      const steps = duration / incrementTime;
      const increment = end / steps;

      if (end === 0) return;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setDisplayValue(end);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="bg-white p-6 rounded-xl border border-cf-border shadow-sm flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-medium text-cf-text-secondary">{label}</h4>
        <div className={`p-2 rounded-lg bg-gray-50 ${color.replace('text-', 'bg-').replace('-500', '-50')} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl font-bold text-cf-text-primary"
        >
          {displayValue}
        </motion.span>
        {trend && (
          <span className="text-xs font-medium text-cf-green">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
