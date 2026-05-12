import React, { useEffect, useRef, useState } from 'react';

// Simple animated counter — no external library needed
export default function AnimatedNumber({ end = 0, duration = 1.5, decimals = 0, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const target = Number(end) || 0;
    const startTime = performance.now();
    startRef.current = startTime;

    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, decimals]);

  return <>{decimals > 0 ? display.toFixed(decimals) : display}{suffix}</>;
}
