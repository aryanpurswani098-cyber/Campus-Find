import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Check, X, Trash2 } from 'lucide-react';
import { showToast } from '../../components/ui/Toast';

export const AdminReports: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['adminItems', filter],
    queryFn: () => adminApi.getAdminItems({ verification: filter === 'all' ? undefined : filter })
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => adminApi.verifyItem(id, { verification: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems'] });
      showToast.success('Item verification updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.adminDeleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems'] });
      showToast.success('Item deleted');
      setDeleteId(null);
    }
  });

  const tabs = ['all', 'pending', 'verified', 'flagged', 'rejected'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">Manage Reports</h1>
        <p className="text-cf-text-secondary mt-1">Verify user reports to maintain platform quality.</p>
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
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-cf-border text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Item</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status / Verif</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : items?.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No reports found for this filter.</td></tr>
              ) : (
                items?.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-200 shrink-0 overflow-hidden">
                          {item.images?.[0] && <img src={item.images[0]} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-cf-text-primary truncate max-w-[200px]" title={item.title}>{item.title}</p>
                          <p className="text-xs text-gray-500 uppercase">{item.item_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{item.reporter.name}</td>
                    <td className="p-4 text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="p-4 space-y-1">
                      <Badge variant={item.status}>{item.status}</Badge><br/>
                      <Badge variant={item.verification}>{item.verification}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {item.verification === 'pending' && (
                        <>
                          <Button size="sm" variant="secondary" className="text-cf-green" onClick={() => verifyMutation.mutate({id: item.id, status: 'verified'})}><Check className="w-4 h-4"/></Button>
                          <Button size="sm" variant="secondary" className="text-red-500" onClick={() => verifyMutation.mutate({id: item.id, status: 'rejected'})}><X className="w-4 h-4"/></Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteId(item.id)}><Trash2 className="w-4 h-4"/></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Item"
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};
