import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { itemsApi } from '../api/items';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ImageUploader } from '../components/ui/ImageUploader';
import { showToast } from '../components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const ReportLost: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    brand: '',
    color: '',
    description: '',
    location_id: '',
    date_occurred: new Date().toISOString().split('T')[0],
    time_approximate: 'morning',
    images: [] as string[]
  });

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: itemsApi.getCategories });
  const { data: locations } = useQuery({ queryKey: ['locations'], queryFn: itemsApi.getLocations });

  const createMutation = useMutation({
    mutationFn: (data: any) => itemsApi.createItem({ ...data, item_type: 'lost' }),
    onSuccess: (data) => {
      showToast.success('Lost item reported successfully!');
      navigate(`/items/${data.id}`);
    },
    onError: () => {
      showToast.error('Failed to report item');
    }
  });

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.category_id || !formData.description)) {
      showToast.error('Please fill in all required fields');
      return;
    }
    if (step === 2 && !formData.location_id) {
      showToast.error('Please select a location');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  const steps = ['Details', 'Location', 'Time', 'Photos', 'Review'];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cf-text-primary">Report Lost Item</h1>
        <p className="text-cf-text-secondary">Provide details to help us find your missing belonging.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        {steps.map((label, idx) => {
          const s = idx + 1;
          const isActive = s === step;
          const isDone = s < step;
          return (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                ${isActive ? 'bg-cf-green text-white ring-4 ring-cf-green/20' : 
                  isDone ? 'bg-cf-green text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {isDone ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-cf-green' : 'text-gray-500'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-cf-border min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <Input label="What did you lose? *" placeholder="e.g. Blue Hydro Flask" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div>
                  <label className="block text-sm font-medium text-cf-text-primary mb-1">Category *</label>
                  <select 
                    className="w-full rounded-lg border border-cf-border px-4 py-2 focus:ring-cf-green focus:border-cf-green"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Brand (Optional)" placeholder="e.g. Apple" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                  <Input label="Color (Optional)" placeholder="e.g. Black" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cf-text-primary mb-1">Description *</label>
                  <textarea 
                    className="w-full rounded-lg border border-cf-border px-4 py-2 focus:ring-cf-green focus:border-cf-green min-h-[100px]"
                    placeholder="Provide any identifying details, scratches, or contents..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-cf-text-primary mb-1">Where did you last see it? *</label>
                  <select 
                    className="w-full rounded-lg border border-cf-border px-4 py-2 focus:ring-cf-green focus:border-cf-green"
                    value={formData.location_id}
                    onChange={e => setFormData({...formData, location_id: e.target.value})}
                  >
                    <option value="">Select a location</option>
                    {locations?.map(l => <option key={l.id} value={l.id}>{l.name} - {l.building}</option>)}
                  </select>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Input 
                  type="date" 
                  label="When did you lose it? *" 
                  value={formData.date_occurred} 
                  onChange={e => setFormData({...formData, date_occurred: e.target.value})} 
                  max={new Date().toISOString().split('T')[0]}
                />
                <div>
                  <label className="block text-sm font-medium text-cf-text-primary mb-1">Approximate Time</label>
                  <select 
                    className="w-full rounded-lg border border-cf-border px-4 py-2 focus:ring-cf-green focus:border-cf-green"
                    value={formData.time_approximate}
                    onChange={e => setFormData({...formData, time_approximate: e.target.value})}
                  >
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 10 PM)</option>
                    <option value="night">Night (10 PM - 6 AM)</option>
                    <option value="unknown">Not Sure</option>
                  </select>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-sm text-cf-text-secondary mb-4">Upload clear photos if you have any (e.g. past photos of the item). This helps our AI match it faster.</p>
                <ImageUploader onImagesChange={(urls) => setFormData({...formData, images: urls})} maxImages={3} />
              </>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Review Your Report</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Item</span><span className="font-medium">{formData.title}</span></div>
                  <div><span className="text-gray-500 block">Category</span><span className="font-medium">{categories?.find(c=>c.id===formData.category_id)?.name}</span></div>
                  <div><span className="text-gray-500 block">Date</span><span className="font-medium">{formData.date_occurred}</span></div>
                  <div><span className="text-gray-500 block">Location</span><span className="font-medium">{locations?.find(l=>l.id===formData.location_id)?.name}</span></div>
                </div>
                <div><span className="text-gray-500 block text-sm">Description</span><p className="text-sm bg-gray-50 p-2 rounded">{formData.description}</p></div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between pt-6 border-t border-cf-border">
          <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={step === 1 || createMutation.isPending}>
            Back
          </Button>
          {step < 5 ? (
            <Button onClick={handleNext}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit} loading={createMutation.isPending}>Submit Report</Button>
          )}
        </div>
      </div>
    </div>
  );
};
