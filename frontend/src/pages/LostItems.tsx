import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { ItemCard } from '../components/features/ItemCard';
import { SearchBar } from '../components/ui/SearchBar';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, MapPin, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LostItems: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [locationId, setLocationId] = useState<string>('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: itemsApi.getCategories
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: itemsApi.getLocations
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', 'lost', searchQuery, categoryId, locationId],
    queryFn: () => itemsApi.getItems({ 
      item_type: 'lost', 
      search: searchQuery || undefined,
      category_id: categoryId || undefined,
      location_id: locationId || undefined,
      status: 'active'
    })
  });

  const handleSearch = () => {
    setSearchQuery(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cf-text-primary flex items-center gap-2">
            Lost Items
            <span className="text-sm font-normal text-cf-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">
              {data?.total || 0}
            </span>
          </h1>
          <p className="text-cf-text-secondary mt-1">Browse items that have been reported lost.</p>
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            onClick={() => navigate('/items/lost')}
            className="px-4 py-2 bg-cf-green text-white rounded-lg font-medium shadow-sm"
          >
            Lost
          </button>
          <button 
            onClick={() => navigate('/items/found')}
            className="px-4 py-2 bg-white border border-cf-border text-cf-text-primary rounded-lg font-medium hover:bg-gray-50"
          >
            Found
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-cf-border space-y-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          onSearch={handleSearch} 
          placeholder="Search by title, brand, or description..." 
        />
        
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            className="text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:ring-cf-green focus:border-cf-green bg-white"
          >
            <option value="">All Categories</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select 
            value={locationId} 
            onChange={(e) => setLocationId(e.target.value)}
            className="text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:ring-cf-green focus:border-cf-green bg-white"
          >
            <option value="">All Locations</option>
            {locations?.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <EmptyState 
          icon={Search} 
          title="Failed to load items" 
          description="There was a problem connecting to the server. Please try again."
        />
      ) : !data?.items.length ? (
        <EmptyState 
          icon={Search} 
          title="No items found" 
          description="We couldn't find any lost items matching your current filters."
          action={{
            label: "Clear Filters",
            onClick: () => {
              setSearch('');
              setSearchQuery('');
              setCategoryId('');
              setLocationId('');
            }
          }}
        />
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.items.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onClick={() => navigate(`/items/${item.id}`)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
