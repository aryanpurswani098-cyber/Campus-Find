import React from 'react';
import { Match } from '../../types';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface MatchCardProps {
  match: Match;
  onDismiss?: (id: string) => void;
  onViewLost?: (id: string) => void;
  onViewFound?: (id: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onDismiss, onViewLost, onViewFound }) => {
  const scorePercent = Math.round(match.score * 100);
  let scoreColor = 'text-green-500';
  if (match.confidence_level === 'medium') scoreColor = 'text-amber-500';
  if (match.confidence_level === 'low') scoreColor = 'text-red-500';

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden transition-colors hover:border-gray-300"
    >
      <div className="flex flex-col md:flex-row">
        {/* Lost Item Side */}
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-cf-border bg-gray-50/50">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 block">Lost Item</span>
          <div className="flex gap-3">
            <img 
              src={match.lost_item.images?.[0] || '/placeholder.jpg'} 
              className="w-16 h-16 rounded-md object-cover" 
              alt={match.lost_item.title} 
              onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
            />
            <div>
              <h4 className="font-medium text-cf-text-primary">{match.lost_item.title}</h4>
              <p className="text-sm text-cf-text-secondary line-clamp-2 mt-1">{match.lost_item.description}</p>
            </div>
          </div>
        </div>

        {/* Score Center */}
        <div className="flex flex-col items-center justify-center p-4 bg-white relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`text-3xl font-bold ${scoreColor}`}
          >
            {scorePercent}%
          </motion.div>
          <span className="text-xs text-gray-500 uppercase font-medium tracking-wide">Match</span>
        </div>

        {/* Found Item Side */}
        <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-cf-border bg-cf-green/5">
          <span className="text-xs font-semibold text-cf-green-600 uppercase tracking-wider mb-2 block">Found Item</span>
          <div className="flex gap-3">
            <img 
              src={match.found_item.images?.[0] || '/placeholder.jpg'} 
              className="w-16 h-16 rounded-md object-cover" 
              alt={match.found_item.title}
              onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
            />
            <div>
              <h4 className="font-medium text-cf-text-primary">{match.found_item.title}</h4>
              <p className="text-sm text-cf-text-secondary line-clamp-2 mt-1">{match.found_item.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border-t border-cf-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Match Reasons</h5>
          <ul className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {match.match_reasons.map((reason, idx) => (
              <li key={idx} className="flex items-center">
                <Check className="w-4 h-4 text-cf-green mr-2 shrink-0" />
                <span className="truncate" title={reason}>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={() => onDismiss(match.id)} leftIcon={<X className="w-4 h-4" />}>
              Dismiss
            </Button>
          )}
          {onViewLost && (
            <Button variant="secondary" size="sm" onClick={() => onViewLost(match.lost_item.id)}>
              View Lost
            </Button>
          )}
          {onViewFound && (
            <Button variant="primary" size="sm" onClick={() => onViewFound(match.found_item.id)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Found
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
