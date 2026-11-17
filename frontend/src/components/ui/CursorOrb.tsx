import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';

export const CursorOrb: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse positions
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Main core spring (fast, slightly elastic)
  const coreX = useSpring(mouseX, { stiffness: 400, damping: 25, mass: 0.5 });
  const coreY = useSpring(mouseY, { stiffness: 400, damping: 25, mass: 0.5 });

  // Outer ring spring (slower, more fluid)
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.8 });

  // Trail springs
  const trail1X = useSpring(mouseX, { stiffness: 100, damping: 25, mass: 1 });
  const trail1Y = useSpring(mouseY, { stiffness: 100, damping: 25, mass: 1 });
  
  const trail2X = useSpring(mouseX, { stiffness: 60, damping: 30, mass: 1.2 });
  const trail2Y = useSpring(mouseY, { stiffness: 60, damping: 30, mass: 1.2 });

  // Continuous floating rotation base
  const rotationBase = useMotionValue(0);
  const rotationReverse = useMotionValue(0);
  
  useAnimationFrame((t) => {
    rotationBase.set(t / 20); // Continually increasing rotation
    rotationReverse.set(-(t / 15));
  });

  useEffect(() => {
    // Check constraints
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = window.innerWidth < 768;
    
    if (mediaQuery.matches || isMobile) return;
    
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 24);
      mouseY.set(e.clientY - 24);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
      
      {/* --- Trail Particle 2 --- */}
      <motion.div
        style={{ x: trail2X, y: trail2Y }}
        className="absolute top-0 left-0 w-3 h-3 ml-[18px] mt-[18px] rounded-full bg-cf-green/40 blur-[2px]"
      />

      {/* --- Trail Particle 1 --- */}
      <motion.div
        style={{ x: trail1X, y: trail1Y }}
        className="absolute top-0 left-0 w-5 h-5 ml-[14px] mt-[14px] rounded-full bg-[#4ade80]/50 blur-[3px]"
      />

      {/* --- Outer Ring (Glassy / Futuristic) --- */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          scale: isClicked ? 1.4 : 1,
          rotate: rotationReverse,
        }}
        className="absolute top-0 left-0 w-16 h-16 -ml-2 -mt-2 rounded-full border border-[#4ade80]/30 border-t-[#4ade80]/80 border-b-transparent shadow-[0_0_15px_rgba(74,222,128,0.3)] backdrop-blur-sm transition-transform duration-150"
      />

      {/* --- Inner Core (Energy Orb) --- */}
      <motion.div
        style={{
          x: coreX,
          y: coreY,
          scale: isClicked ? 0.8 : 1,
          rotate: rotationBase
        }}
        className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center transition-transform duration-100"
      >
        <div className="absolute inset-2 bg-[#22C55E] rounded-full blur-[8px] opacity-80" />
        <div className="absolute inset-3 bg-gradient-to-tr from-[#22C55E] to-[#86EFac] rounded-full opacity-90 shadow-[inset_0_0_8px_rgba(255,255,255,0.8)]" />

        <motion.div 
          initial={false}
          animate={isClicked ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 border-2 border-[#86EFac] rounded-full"
        />
      </motion.div>
    </div>
  );
};
