import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, color = 'var(--primary)' }) => {
  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative shadow-inner">
      <motion.div 
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
  );
};

export default ProgressBar;
