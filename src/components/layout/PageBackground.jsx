import React from 'react';
import { motion } from 'framer-motion';

const PageBackground = () => {
  return (
    <>
      {/* Enhanced Dot Pattern Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.2) 2px, transparent 0)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* Subtle Animated Gradients */}
      <div className="fixed inset-0 -z-20 overflow-hidden opacity-40 pointer-events-none">
        <motion.div 
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 50%)',
          }}
        />
        <motion.div 
          className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%]"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          style={{
            background: 'radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>
    </>
  );
};

export default PageBackground;
