import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { matchesApi } from '../api/matches';
import { claimsApi } from '../api/claims';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { MatchCard } from '../components/features/MatchCard';
import { MapPin, Calendar, Clock, User, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../components/ui/Toast';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [claimData, setClaimData] = useState({ identifying_info: '', additional_notes: '' });
  const [activeImage, setActiveImage] = useState(0);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsApi.getItem(id!)
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', id],
    queryFn: () => matchesApi.getItemMatches(id!),
    enabled: !!item && (item.reporter.id === user?.id || user?.role === 'admin')
  });

  const claimMutation = useMutation({
    mutationFn: (data: any) => claimsApi.submitClaim({ ...data, item_id: id }),
    onSuccess: () => {
      showToast.success('Claim submitted successfully! Admin will review it shortly.');
      setClaimModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
    onError: () => {
      showToast.error('Failed to submit claim.');
    }
  });

  if (isLoading) return <div className="p-8 text-center">Loading item details...</div>;
  if (error || !item) return <EmptyState icon={AlertCircle} title="Item not found" />;

  const isOwner = item.reporter.id === user?.id;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Images Section */}
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
            <div className="aspect-square md:aspect-[4/3] relative">
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[activeImage]} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                  No images provided
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge variant={item.item_type} className="text-sm px-3 py-1 uppercase shadow-sm">
                  {item.item_type}
                </Badge>
              </div>
            </div>
            {item.images && item.images.length > 1 && (
              <div className="flex p-4 gap-2 overflow-x-auto">
                {item.images.map((url, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 ${activeImage === idx ? 'border-cf-green' : 'border-transparent'}`}
                  >
                    <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-cf-text-primary">{item.title}</h1>
                <Badge variant={item.status}>{item.status.toUpperCase()}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-cf-text-secondary">
                <div className="flex items-center"><Tag className="w-4 h-4 mr-2" />{item.category?.name}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{item.location?.name}</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{format(new Date(item.date_occurred), 'PPP')}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{item.time_approximate}</div>
                {(item.brand || item.color) && (
                  <div className="col-span-2 text-xs bg-gray-50 p-2 rounded">
                    {item.brand && <span className="mr-3"><strong>Brand:</strong> {item.brand}</span>}
                    {item.color && <span><strong>Color:</strong> {item.color}</span>}
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-cf-text-primary mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center border-t border-cf-border pt-6 mt-auto">
                <div className="w-10 h-10 bg-cf-green rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {item.reporter.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cf-text-primary">Reported by {item.reporter.name}</p>
                  <p className="text-xs text-cf-text-secondary">On {format(new Date(item.created_at), 'PPP')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-cf-border flex gap-4">
              {!isOwner && item.status === 'active' && item.item_type === 'found' && (
                <Button size="lg" className="w-full" onClick={() => setClaimModalOpen(true)}>
                  Claim This Item
                </Button>
              )}
              {!isOwner && item.status === 'active' && item.item_type === 'lost' && (
                <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600">
                  I Found This
                </Button>
              )}
              {isOwner && (
                <Button size="lg" variant="secondary" className="w-full" onClick={() => navigate('/my-items')}>
                  Manage My Item
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwner && matches && matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-cf-text-primary">Potential Matches ({matches.length})</h2>
          <div className="grid gap-4">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      <Modal isOpen={isClaimModalOpen} onClose={() => setClaimModalOpen(false)} title="Claim Item">
        <div className="space-y-4 py-2">
          <p className="text-sm text-cf-text-secondary mb-4">
            To claim this item, please provide specific identifying details that only the true owner would know (e.g., contents of a wallet, specific scratches, serial numbers).
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-cf-text-primary">Identifying Information *</label>
            <textarea
              className="w-full rounded-lg border border-cf-border px-4 py-2 focus:ring-cf-green min-h-[100px]"
              placeholder="What unique features prove this is yours?"
              value={claimData.identifying_info}
              onChange={e => setClaimData({...claimData, identifying_info: e.target.value})}
            />
          </div>
          <Input 
            label="Additional Notes (Optional)" 
            value={claimData.additional_notes}
            onChange={e => setClaimData({...claimData, additional_notes: e.target.value})}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setClaimModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => claimMutation.mutate(claimData)} 
              loading={claimMutation.isPending}
              disabled={!claimData.identifying_info}
            >
              Submit Claim
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
