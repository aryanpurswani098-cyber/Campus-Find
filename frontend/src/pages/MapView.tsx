import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { MapPin } from 'lucide-react';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';

export const MapView: React.FC = () => {
  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: itemsApi.getLocations
  });

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">Campus Map</h1>
        <p className="text-cf-text-secondary mt-1">Discover lost and found items by location.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-cf-border relative overflow-hidden flex items-center justify-center">
        {/* Placeholder for an actual map integration like Google Maps or Mapbox */}
        <div className="absolute inset-0 bg-[#e5e3df] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        {isLoading ? (
          <SkeletonGrid count={1} type="card" />
        ) : (
          <div className="relative z-10 w-full h-full p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full content-center">
              {locations?.map((loc) => (
                <div key={loc.id} className="bg-white p-4 rounded-lg shadow-md border-t-4 border-cf-green hover:-translate-y-1 transition-transform cursor-pointer group">
                  <div className="flex items-center justify-center w-10 h-10 bg-cf-green/10 rounded-full mb-3 group-hover:bg-cf-green/20">
                    <MapPin className="w-5 h-5 text-cf-green" />
                  </div>
                  <h3 className="font-bold text-cf-text-primary text-sm">{loc.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{loc.building}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
