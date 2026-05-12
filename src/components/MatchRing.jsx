import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const MatchRing = ({ score, size = 90, strokeWidth = 6, color }) => {
  const r = (size / 2) - strokeWidth;
  const c = 2 * Math.PI * r;
  const offset = c - (c * score / 100);
  
  const getColors = () => {
    if (color) return { stroke: color, glow: `${color}66` };
    if (score >= 75) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' };
    if (score >= 50) return { stroke: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' };
    if (score >= 30) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' };
  };

  const colors = getColors();

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={r} 
          className="stroke-white/5 fill-none" 
          strokeWidth={strokeWidth} 
        />
        <motion.circle 
          cx={size / 2} 
          cy={size / 2} 
          r={r} 
          className="fill-none" 
          strokeWidth={strokeWidth}
          stroke={colors.stroke}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <div className="font-black tracking-tighter" style={{ fontSize: size / 4, color: colors.stroke }}>
          <AnimatedNumber end={score} duration={2} />%
        </div>
      </div>
    </div>
  );
};

export default MatchRing;
