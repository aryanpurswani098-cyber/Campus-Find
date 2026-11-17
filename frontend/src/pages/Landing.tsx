import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ShieldCheck, Users, UserCheck, HeartHandshake, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0d14] font-sans flex flex-col relative overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Image & Overlays */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b101a] via-[#0b101a]/90 md:via-[#0b101a]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b101a] to-transparent" />

        {/* Navbar */}
        <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 md:px-16 py-6 md:py-8">
          <div className="flex items-center text-white font-bold text-xl md:text-2xl tracking-tight z-50">
            <div className="w-8 h-8 mr-2 bg-white rounded-full flex items-center justify-center relative">
               <MapPin className="w-5 h-5 text-[#22C55E]" fill="#22C55E" />
            </div>
            CampusFind
          </div>
          
          <div className="hidden md:flex items-center space-x-12 text-sm font-medium">
            <div className="relative text-white flex flex-col items-center">
              <span>Home</span>
              <div className="absolute -bottom-2 w-6 h-0.5 bg-cf-green rounded-full" />
            </div>
            <Link to="/items/lost" className="text-gray-300 hover:text-white transition-colors">Lost & Found</Link>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2.5 rounded-full border border-gray-600 text-white text-sm font-medium hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2.5 rounded-full bg-[#86EFac] text-[#064E3B] text-sm font-bold hover:bg-[#4ade80] transition-colors">
              Sign Up
            </Link>
          </div>

          <button 
            className="md:hidden text-white z-50 p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-40 bg-[#0b101a] flex flex-col items-center justify-center space-y-8 md:hidden"
            >
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-white">Home</Link>
              <Link to="/items/lost" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-gray-300">Lost & Found</Link>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium text-gray-300">How it Works</a>
              
              <div className="flex flex-col w-full max-w-xs space-y-4 pt-8">
                <Link to="/login" className="w-full py-4 rounded-full border border-gray-600 text-white text-center text-lg font-medium">
                  Login
                </Link>
                <Link to="/register" className="w-full py-4 rounded-full bg-[#86EFac] text-[#064E3B] text-center text-lg font-bold">
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-16 max-w-3xl pb-20 pt-10 md:pt-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
          >
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-6"
            >
              <span className="text-white">Lost Something?</span><br />
              <span className="text-[#4ade80]">Found Something?</span><br />
              <span className="text-[#4ade80]">We'll Help You Reconnect.</span>
            </motion.h1>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
              className="text-gray-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light"
            >
              CampusFind is your college's smart lost and found platform. Report, search and get notified when your item is found.
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } }}
              className="flex flex-col sm:flex-row items-center gap-5"
            >
              <Link to={isAuthenticated ? "/report/lost" : "/login"} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#86EFac] text-[#064E3B] font-bold flex items-center justify-center hover:bg-[#4ade80] transition-transform hover:scale-105 active:scale-95">
                  <Search className="w-5 h-5 mr-3" />
                  Report Lost Item
                </button>
              </Link>
              
              <Link to={isAuthenticated ? "/report/found" : "/login"} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-gray-400 text-white font-medium flex items-center justify-center hover:bg-white/10 transition-transform hover:scale-105 active:scale-95">
                  <Search className="w-5 h-5 mr-3" />
                  Report Found Item
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* Decorative Text (Right Side) */}
        <div className="hidden lg:block absolute right-32 top-1/3 z-10 transform -rotate-12 opacity-90 pointer-events-none">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1, y: [0, -10, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: 0.8 },
              scale: { duration: 1, delay: 0.8, type: "spring" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
            }}
            src="/arrow.png" 
            alt="Arrow" 
            className="absolute -top-24 right-4 w-28 h-28 object-contain transform rotate-[70deg]"
          />
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="font-caveat text-white/90 text-4xl leading-relaxed italic" style={{ fontFamily: 'cursive' }}
          >
            Same Campus<br/>
            Same People<br/>
            Better Together
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 border-t border-white/10 bg-[#0b101a]/60 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Stat 1 */}
              <div className="flex items-center md:justify-center pt-4 md:pt-0">
                <div className="w-14 h-14 rounded-full bg-[#131d2b] flex items-center justify-center mr-5 shrink-0">
                  <Users className="w-6 h-6 text-[#4ade80]" />
                </div>
                <div>
                  <div className="text-white text-3xl font-bold tracking-tight">2,458</div>
                  <div className="text-gray-400 text-sm mt-1">Items Found</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center md:justify-center pt-6 md:pt-0 pl-0 md:pl-12">
                <div className="w-14 h-14 rounded-full bg-[#131d2b] flex items-center justify-center mr-5 shrink-0">
                  <UserCheck className="w-6 h-6 text-[#4ade80]" />
                </div>
                <div>
                  <div className="text-white text-3xl font-bold tracking-tight">1,892</div>
                  <div className="text-gray-400 text-sm mt-1">Students Helped</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center md:justify-center pt-6 md:pt-0 pl-0 md:pl-12">
                <div className="w-14 h-14 rounded-full bg-[#131d2b] flex items-center justify-center mr-5 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#4ade80]" />
                </div>
                <div>
                  <div className="text-white text-3xl font-bold tracking-tight">98%</div>
                  <div className="text-gray-400 text-sm mt-1">Recovery Rate</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION --- */}
      <div className="bg-white w-full">
        <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto text-cf-text-primary">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight text-gray-900">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">Our intelligent matching system does the heavy lifting so you don't have to scroll through endless lists.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true, margin: "-50px" }} className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-cf-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-cf-green" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900">1. Report</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">Quickly log what you lost or found with photos and location details.</p>
            </motion.div>
            
            <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900">2. Match</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">Our algorithm instantly compares your report against the database to find potential matches.</p>
            </motion.div>
            
            <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }} className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8">
                <HeartHandshake className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-900">3. Recover</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">Submit a secure claim, verify ownership, and reunite with your belongings safely.</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 text-center text-gray-500 bg-white">
          <div className="flex items-center justify-center text-cf-green font-bold text-xl mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            CampusFind
          </div>
          <p className="text-sm">© {new Date().getFullYear()} CampusFind. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};


