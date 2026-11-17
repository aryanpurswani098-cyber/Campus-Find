import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimsApi } from '../../api/claims';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';
import { format } from 'date-fns';

export const AdminClaims: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [activeClaim, setActiveClaim] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: claims, isLoading } = useQuery({
    queryKey: ['adminClaims', filter],
    queryFn: () => claimsApi.getAllClaims(filter === 'all' ? undefined : filter)
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string, status: string, notes?: string }) => 
      claimsApi.reviewClaim(id, { status, admin_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClaims'] });
      showToast.success('Claim reviewed successfully');
      setActiveClaim(null);
      setAdminNotes('');
    }
  });

  const tabs = ['all', 'pending', 'under_review', 'approved', 'rejected'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">Manage Claims</h1>
        <p className="text-cf-text-secondary mt-1">Review ownership claims for found items.</p>
      </div>

      <div className="flex space-x-1 border-b border-cf-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors capitalize ${
              filter === tab ? 'border-cf-green text-cf-green' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-cf-border text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Item</th>
                <th className="p-4">Claimant</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : claims?.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No claims found.</td></tr>
              ) : (
                claims?.map(claim => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-cf-text-primary truncate max-w-[200px]">{claim.item.title}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-700 font-medium">{claim.claimant.name}</p>
                      <p className="text-xs text-gray-500">{claim.claimant.email}</p>
                    </td>
                    <td className="p-4 text-gray-500">{format(new Date(claim.created_at), 'MMM d, yyyy')}</td>
                    <td className="p-4">
                      <Badge variant={claim.status === 'approved' ? 'recovered' : claim.status === 'rejected' ? 'rejected' : 'pending'}>
                        {claim.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="secondary" onClick={() => setActiveClaim(claim)}>Review</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!activeClaim} onClose={() => setActiveClaim(null)} title="Review Claim" size="lg">
        {activeClaim && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Item Details</h4>
                <p className="font-medium">{activeClaim.item.title}</p>
                <p className="text-sm mt-1">{activeClaim.item.description}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Claimant Identity</h4>
                <p className="font-medium">{activeClaim.claimant.name}</p>
                <p className="text-sm">{activeClaim.claimant.email}</p>
                <p className="text-sm text-gray-500">ID: {activeClaim.claimant.student_id}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-cf-text-primary mb-2">Provided Identifying Information</h4>
              <p className="text-sm bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-gray-800 whitespace-pre-line">
                {activeClaim.identifying_info}
              </p>
            </div>
            
            {activeClaim.additional_notes && (
              <div>
                <h4 className="text-sm font-semibold text-cf-text-primary mb-2">Additional Notes</h4>
                <p className="text-sm text-gray-700">{activeClaim.additional_notes}</p>
              </div>
            )}

            <div className="border-t border-cf-border pt-4">
              <Input 
                label="Admin Notes (Sent to user on decision)" 
                value={adminNotes} 
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Explain why approved or rejected..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="danger" 
                onClick={() => reviewMutation.mutate({ id: activeClaim.id, status: 'rejected', notes: adminNotes })}
                loading={reviewMutation.isPending}
              >
                Reject Claim
              </Button>
              <Button 
                variant="primary" 
                onClick={() => reviewMutation.mutate({ id: activeClaim.id, status: 'approved', notes: adminNotes })}
                loading={reviewMutation.isPending}
              >
                Approve & Mark Recovered
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
