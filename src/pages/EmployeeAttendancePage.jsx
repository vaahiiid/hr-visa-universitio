import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Power, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import AttendanceStatus from '@/components/attendance/AttendanceStatus';
import AttendanceControls from '@/components/attendance/AttendanceControls';
import AttendanceHistoryList from '@/components/attendance/AttendanceHistoryList';
import { useEmployeeAttendance } from '@/hooks/useEmployeeAttendance';

const EmployeeAttendancePage = ({ onLogout }) => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const {
    employee,
    attendanceRecords,
    currentStatus,
    loading: attendanceLoading,
    actionLoading,
    fetchEmployeeDetails,
    fetchAttendanceRecords,
    determineCurrentStatus,
    handleClockIn,
    handleClockOut,
  } = useEmployeeAttendance(employeeId);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const loadData = async () => {
        const empDetails = await fetchEmployeeDetails();
        if (empDetails) {
          const attRecords = await fetchAttendanceRecords();
          determineCurrentStatus(attRecords);
        } else {
          toast({ 
            title: 'Access Denied', 
            description: 'Could not load employee data.', 
            variant: 'destructive' 
          });
          navigate("/login");
        }
      };
      
      await loadData();
      setLoading(false);
    };

    checkSession();
  }, [employeeId, fetchEmployeeDetails, fetchAttendanceRecords, determineCurrentStatus, navigate, toast]);

  const handleLogoutClick = async () => {
    try {
      await supabase.auth.signOut();
      if (onLogout) onLogout();
      else navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (loading || attendanceLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Attendance Data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 to-red-700 text-white p-4">
        <User className="h-16 w-16 text-white/70 mb-4" />
        <p className="text-xl">Employee data not found or access denied.</p>
        <Button onClick={() => navigate('/login')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-6"
      >
        <Card className="bg-card border-border shadow-2xl">
          <CardHeader className="text-center border-b border-border/30 pb-6">
            <motion.div
              className="bg-primary/5 p-4 rounded-full inline-block mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3fc2bcbf-9ff5-4dd1-b724-ac34eb3d196e/2a0983f9ffbd6d222994de9f3e4c1c9f.png" 
                alt="Universitio Logo" 
                className="h-16 w-auto"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center">
              <User className="mr-3 h-8 w-8" /> {employee.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center justify-center mt-1">
              <Briefcase className="mr-2 h-4 w-4" /> {employee.position}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <AttendanceStatus 
              currentStatus={currentStatus.status} 
              clockInTime={currentStatus.clockInTime}
            />
            <AttendanceControls
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              currentStatus={currentStatus.status}
              isLoading={actionLoading}
            />
            <AttendanceHistoryList attendanceRecords={attendanceRecords} />
          </CardContent>
          <CardFooter className="border-t border-border/30 pt-6 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Employee Portal &copy; {new Date().getFullYear()} Universitio</p>
            <Button 
              variant="outline" 
              onClick={handleLogoutClick} 
              className="text-primary hover:bg-primary/5 hover:text-primary/90"
            >
              <Power className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmployeeAttendancePage;