import React from 'react';
import { Item } from '../../types';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

interface ItemCardProps {
  item: Item;
  showMatchScore?: boolean;
  matchScore?: number;
  onClick?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, showMatchScore, matchScore, onClick }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden cursor-pointer flex p-4 gap-4 transition-colors hover:border-gray-300"
    >
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
        {item.images && item.images.length > 0 ? (
          <motion.img 
            whileHover={{ scale: 1.03 }}
            src={item.images[0]} 
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.src = '/placeholder.jpg'}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-cf-text-primary truncate" title={item.title}>
              {item.title}
            </h3>
            {item.category && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full shrink-0 ml-2">
                {item.category.name}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-cf-text-secondary space-x-3 mb-2">
            {item.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate max-w-[100px]">{item.location.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{format(new Date(item.date_occurred), 'MMM d')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <Badge variant={item.status === 'active' ? item.item_type : item.status}>
            {item.status === 'active' ? item.item_type.toUpperCase() : item.status.toUpperCase()}
          </Badge>
          
          {showMatchScore && matchScore !== undefined && (
            <Badge variant="matched" className="font-bold">
              {Math.round(matchScore * 100)}% Match
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};
