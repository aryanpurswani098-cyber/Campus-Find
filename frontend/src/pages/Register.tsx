import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, User, Hash } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/ui/Toast';
import { motion } from 'framer-motion';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      showToast.error("Passwords don't match");
      return;
    }
    
    registerUser.mutate(formData, {
      onSuccess: () => {
        showToast.success('Account created successfully!');
        navigate('/dashboard');
      },
      onError: (err: any) => {
        showToast.error(err.response?.data?.detail || 'Registration failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
        
        {/* Left Panel - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 bg-[url('/login-bg.jpg')] bg-cover bg-center" />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
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
              <h2 className="text-3xl font-bold text-cf-text-primary">Create Account</h2>
              <p className="mt-2 text-cf-text-secondary">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User className="w-5 h-5" />}
                required
              />
              <Input
                label="College Email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />
              <Input
                label="Student ID (Optional)"
                name="student_id"
                placeholder="12345678"
                value={formData.student_id}
                onChange={handleChange}
                leftIcon={<Hash className="w-5 h-5" />}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5" />}
                required
                minLength={8}
              />
              <Input
                label="Confirm Password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />

              <Button type="submit" className="w-full mt-6" size="lg" loading={registerUser.isPending}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-cf-border text-center">
              <p className="text-cf-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-cf-green hover:text-green-600">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
