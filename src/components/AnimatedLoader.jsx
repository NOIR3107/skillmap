import React from 'react';
import { motion } from 'framer-motion';

const messages = ["Analyzing skills...", "Matching career paths...", "Generating roadmap..."];

const AnimatedLoader = () => {
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative w-16 h-16 mb-6">
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-primary/20"
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.div 
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg font-medium text-white/80"
      >
        {messages[msgIndex]}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLoader;
