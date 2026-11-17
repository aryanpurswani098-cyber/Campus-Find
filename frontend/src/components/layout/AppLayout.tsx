import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[240px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-cf-border z-20 flex items-center justify-between px-4">
        <div className="font-bold text-lg text-cf-text-primary">CampusFind</div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -mr-2 text-cf-text-primary"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#111318] z-40 md:hidden shadow-xl"
            >
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full pt-16 md:pt-0 relative">
        <motion.div
          key={window.location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
          className="p-4 md:p-8 max-w-7xl mx-auto min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};
