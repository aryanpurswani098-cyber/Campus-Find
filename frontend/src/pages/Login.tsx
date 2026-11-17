import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast.error('Please fill in all fields');
      return;
    }
    
    login.mutate({ email, password }, {
      onSuccess: () => {
        showToast.success('Welcome back!');
        navigate('/dashboard');
      },
      onError: () => {
        showToast.error('Invalid credentials');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Panel - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 bg-[url('/login-bg.jpg')] bg-cover bg-center" />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-8"
          >
            <div className="text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center text-cf-green font-bold text-2xl mb-8">
                <MapPin className="w-8 h-8 mr-2" />
                CampusFind
              </div>
              <h2 className="text-3xl font-bold text-cf-text-primary">Sign In</h2>
              <p className="mt-2 text-cf-text-secondary">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <Input
                label="College Email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />
              
              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-5 h-5" />}
                  required
                />
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-cf-green hover:text-green-600">Forgot password?</a>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-cf-border text-center">
              <p className="text-cf-text-secondary">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-cf-green hover:text-green-600">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
