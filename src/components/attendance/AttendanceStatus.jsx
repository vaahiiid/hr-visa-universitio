import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import WorkTimer from './WorkTimer';

const AttendanceStatus = ({ currentStatus, clockInTime }) => {
  return (
    <motion.div 
      className="text-center p-6 bg-muted rounded-lg shadow-sm border border-border/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center">
        <Clock className="mr-2 h-6 w-6 text-primary" /> Latest Action
      </h3>
      <p className={`text-3xl font-bold ${
        currentStatus === 'Clocked In' 
          ? 'text-success' 
          : currentStatus === 'Clocked Out' 
          ? 'text-destructive' 
          : 'text-warning'
      }`}>
        {currentStatus}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {format(new Date(), 'h:mm a, MMMM do')}
      </p>
      {currentStatus === 'Clocked In' && clockInTime && (
        <WorkTimer startTime={clockInTime} />
      )}
    </motion.div>
  );
};

export default AttendanceStatus;