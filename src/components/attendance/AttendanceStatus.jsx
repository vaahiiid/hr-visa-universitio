import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const AttendanceStatus = ({ currentStatus }) => {
  return (
    <motion.div 
      className="text-center p-6 bg-slate-700/50 rounded-lg shadow-inner"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-xl font-semibold text-slate-300 mb-2 flex items-center justify-center">
        <Clock className="mr-2 h-6 w-6" /> Current Status
      </h3>
      <p className={`text-3xl font-bold ${currentStatus === 'Clocked In' ? 'text-green-400' : currentStatus === 'Clocked Out' ? 'text-red-400' : 'text-yellow-400'}`}>
        {currentStatus}
      </p>
      {(currentStatus === 'Annual Leave' || currentStatus === 'Sick Leave') && (
        <p className="text-sm text-slate-400 mt-1">({format(new Date(), 'eeee, MMMM do')})</p>
      )}
    </motion.div>
  );
};

export default AttendanceStatus;