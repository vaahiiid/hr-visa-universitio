import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const WorkTimer = ({ startTime }) => {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      if (!startTime) return;

      const now = new Date();
      const start = new Date(startTime);
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDuration(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!startTime) return null;

  return (
    <div className="mt-4 text-center">
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10">
        <Timer className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-lg font-mono font-semibold text-primary">
          {duration}
        </span>
      </div>
    </div>
  );
};

export default WorkTimer; 