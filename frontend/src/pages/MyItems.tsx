import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Archive, Trash2, CheckCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/ui/Toast';

export const MyItems: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['myItems'],
    queryFn: () => itemsApi.getMyItems()
  });

  const deleteMutation = useMutation({
    mutationFn: itemsApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myItems'] });
      showToast.success('Item deleted');
    }
  });

  const markRecoveredMutation = useMutation({
    mutationFn: itemsApi.markRecovered,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myItems'] });
      showToast.success('Marked as recovered');
    }
  });

  const filteredItems = items?.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'lost' || filter === 'found') return item.item_type === filter;
    return item.status === filter;
  });

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'lost', label: 'Lost' },
    { id: 'found', label: 'Found' },
    { id: 'recovered', label: 'Recovered' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">My Items</h1>
        <p className="text-cf-text-secondary mt-1">Manage all the items you've reported.</p>
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
        <SkeletonGrid count={4} type="list" />
      ) : filteredItems && filteredItems.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden divide-y divide-cf-border">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Archive className="w-8 h-8 text-gray-300 m-4" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-cf-text-primary truncate">{item.title}</h3>
                  <Badge variant={item.item_type} className="uppercase">{item.item_type}</Badge>
                  <Badge variant={item.status} className="uppercase">{item.status}</Badge>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span>Reported {format(new Date(item.created_at), 'MMM d, yyyy')}</span>
                  {item.match_count > 0 && item.status === 'active' && (
                    <span className="text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">
                      {item.match_count} Match{item.match_count > 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/items/${item.id}`)} leftIcon={<Eye className="w-4 h-4"/>}>
                  View
                </Button>
                {item.status === 'active' && (
                  <Button variant="secondary" size="sm" onClick={() => markRecoveredMutation.mutate(item.id)} leftIcon={<CheckCircle className="w-4 h-4"/>}>
                    Mark Recovered
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-cf-border p-8">
          <EmptyState 
            icon={Archive} 
            title="No items found" 
            description="You haven't reported any items in this category."
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Item"
        message="Are you sure you want to delete this report? This action cannot be undone and will remove any potential matches."
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
