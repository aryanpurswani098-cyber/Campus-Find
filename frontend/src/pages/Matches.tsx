import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesApi } from '../api/matches';
import { MatchCard } from '../components/features/MatchCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';
import { Shield, ShieldOff, ShieldAlert } from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export const Matches: React.FC = () => {
  const [filter, setFilter] = useState('pending');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches', filter],
    queryFn: () => matchesApi.getMyMatches(filter === 'all' ? undefined : filter)
  });

  const dismissMutation = useMutation({
    mutationFn: matchesApi.dismissMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      showToast.success('Match dismissed');
    }
  });

  const tabs = [
    { id: 'all', label: 'All Matches' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'dismissed', label: 'Dismissed' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary flex items-center">
          <Shield className="w-6 h-6 mr-2 text-purple-500" />
          Potential Matches
        </h1>
        <p className="text-cf-text-secondary mt-1">Review AI-suggested matches for your items.</p>
      </div>

      <div className="flex space-x-1 border-b border-cf-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              filter === tab.id 
                ? 'border-cf-green text-cf-green' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonGrid count={3} type="card" />
      ) : matches && matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onDismiss={match.status === 'pending' ? () => dismissMutation.mutate(match.id) : undefined}
              onViewLost={(id) => navigate(`/items/${id}`)}
              onViewFound={(id) => navigate(`/items/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-cf-border p-8">
          <EmptyState 
            icon={filter === 'dismissed' ? ShieldOff : ShieldAlert} 
            title="No matches found" 
            description={
              filter === 'pending' 
                ? "You don't have any pending matches right now. We'll notify you if our AI finds something." 
                : `No ${filter} matches to display.`
            }
          />
        </div>
      )}
    </div>
  );
};
