import React from 'react';
import { motion } from 'framer-motion';

export default function AIOrb() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0">
      {/* Outer Core Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 rounded-full blur-[120px]"
      />
      
      {/* Inner Pulsing Orb */}
      <motion.div 
        animate={{ 
          scale: [0.8, 1, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-full blur-[80px]"
      />

      {/* Holographic Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 border border-white/5 rounded-full"
          style={{ margin: `${i * 100}px`, opacity: 0.1 - i * 0.03 }}
        />
      ))}
    </div>
  );
}
