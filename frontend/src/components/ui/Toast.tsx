import toast, { ToastBar, Toaster as HotToaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export const Toaster = () => (
  <HotToaster
    position="bottom-right"
    toastOptions={{
      duration: 4000,
      className: 'bg-white text-cf-text-primary shadow-lg border border-cf-border rounded-lg',
      success: {
        icon: <CheckCircle className="w-5 h-5 text-cf-green" />,
      },
      error: {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      },
    }}
  />
);

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message, { icon: <Info className="w-5 h-5 text-blue-500" /> }),
  match: (message: string) => toast(message, { icon: <AlertCircle className="w-5 h-5 text-purple-500" /> }),
};
