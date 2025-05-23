import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut } from 'lucide-react';

const AttendanceControls = ({ onClockIn, onClockOut, currentStatus, isLoading }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        size="lg"
        className={`w-full py-8 text-xl bg-[#22c55e] hover:bg-[#16a34a] text-white transition-all duration-300 ease-in-out transform hover:scale-105`}
        onClick={onClockIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-6 w-6" />
        )}
        Clock In
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={`w-full py-8 text-xl bg-destructive hover:bg-destructive/90 text-white border-destructive hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105`}
        onClick={onClockOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-6 w-6" />
        )}
        Clock Out
      </Button>
    </motion.div>
  );
};

export default AttendanceControls;