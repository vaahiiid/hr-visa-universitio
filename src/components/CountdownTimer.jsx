import React, { useState, useEffect } from "react";
import { differenceInDays, differenceInSeconds, addDays } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiryDateTime = new Date(expiryDate);
      
      if (expiryDateTime <= now) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalDays: 0,
          expired: true,
        };
      }

      const totalSeconds = differenceInSeconds(expiryDateTime, now);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const totalDays = differenceInDays(expiryDateTime, now);

      return {
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        expired: false,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  const getStatusVariant = () => {
    if (timeLeft.expired) return "danger";
    if (timeLeft.totalDays <= 30) return "danger";
    if (timeLeft.totalDays <= 90) return "warning";
    return "success";
  };

  const getStatusText = () => {
    if (timeLeft.expired) return "Expired";
    if (timeLeft.totalDays <= 30) return "Critical";
    if (timeLeft.totalDays <= 90) return "Warning";
    return "Valid";
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Visa Expires:</span>
        <Badge variant={getStatusVariant()}>
          {getStatusText()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-4 gap-1 text-center">
        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.days}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {timeLeft.days}
          </motion.div>
          <div className="countdown-label">Days</div>
        </motion.div>
        
        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.hours}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {timeLeft.hours}
          </motion.div>
          <div className="countdown-label">Hours</div>
        </motion.div>
        
        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.minutes}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {timeLeft.minutes}
          </motion.div>
          <div className="countdown-label">Mins</div>
        </motion.div>
        
        <motion.div 
          className="countdown-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.seconds}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {timeLeft.seconds}
          </motion.div>
          <div className="countdown-label">Secs</div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountdownTimer;