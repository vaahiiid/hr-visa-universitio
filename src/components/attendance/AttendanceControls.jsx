import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut } from 'lucide-react';

const AttendanceControls = ({ onClockIn, onClockOut, currentStatus, isLoading }) => {
  const isClockInDisabled = currentStatus === 'Clocked In' || currentStatus === 'Annual Leave' || currentStatus === 'Sick Leave';
  const isClockOutDisabled = currentStatus === 'Clocked Out' || currentStatus === 'Annual Leave' || currentStatus === 'Sick Leave';

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        size="lg"
        className={`w-full py-8 text-xl bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105`}
        onClick={onClockIn}
        disabled={isClockInDisabled || isLoading}
      >
        {isLoading && currentStatus === 'Clocked Out' ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <LogIn className="mr-2 h-6 w-6" />}
        Clock In
      </Button>
      <Button
        size="lg"
        variant="destructive"
        className={`w-full py-8 text-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105`}
        onClick={onClockOut}
        disabled={isClockOutDisabled || isLoading}
      >
        {isLoading && currentStatus === 'Clocked In' ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <LogOut className="mr-2 h-6 w-6" />}
        Clock Out
      </Button>
    </motion.div>
  );
};

export default AttendanceControls;