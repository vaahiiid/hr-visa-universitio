import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Power, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import LoginForm from '@/components/LoginForm'; 
import AttendanceStatus from '@/components/attendance/AttendanceStatus';
import AttendanceControls from '@/components/attendance/AttendanceControls';
import AttendanceHistoryList from '@/components/attendance/AttendanceHistoryList';
import { useEmployeeAttendance } from '@/hooks/useEmployeeAttendance';

const EMPLOYEE_ATTENDANCE_SESSION_KEY_PREFIX = "employeeAttendanceLoggedIn_";

const EmployeeAttendancePage = ({ onLogout }) => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(false);

  const {
    employee,
    attendanceRecords,
    currentStatus,
    loading,
    actionLoading,
    fetchEmployeeDetails,
    fetchAttendanceRecords,
    determineCurrentStatus,
    handleClockIn,
    handleClockOut,
  } = useEmployeeAttendance(employeeId);

  useEffect(() => {
    const sessionKey = `${EMPLOYEE_ATTENDANCE_SESSION_KEY_PREFIX}${employeeId}`;
    const sessionLoggedIn = sessionStorage.getItem(sessionKey) === `true`;
    if (sessionLoggedIn) {
      setLoggedIn(true);
    }
  }, [employeeId]);
  
  useEffect(() => {
    if (!loggedIn || !employeeId) return;

    const loadData = async () => {
      const empDetails = await fetchEmployeeDetails();
      if (empDetails) {
        const attRecords = await fetchAttendanceRecords();
        determineCurrentStatus(attRecords);
      } else {
        toast({ title: 'Access Denied', description: 'Could not load employee data.', variant: 'destructive' });
        navigate("/login"); 
      }
    };
    loadData();
  }, [loggedIn, employeeId, fetchEmployeeDetails, fetchAttendanceRecords, determineCurrentStatus, navigate, toast]);

  const handleEmployeeLogin = () => {
    setLoggedIn(true);
    const sessionKey = `${EMPLOYEE_ATTENDANCE_SESSION_KEY_PREFIX}${employeeId}`;
    sessionStorage.setItem(sessionKey, `true`);
  };
  
  const handleLogoutClick = () => {
    const sessionKey = `${EMPLOYEE_ATTENDANCE_SESSION_KEY_PREFIX}${employeeId}`;
    sessionStorage.removeItem(sessionKey);
    if (onLogout) onLogout(); 
    else navigate('/login'); 
  };

  if (!loggedIn) {
    return <LoginForm onLogin={handleEmployeeLogin} isEmployeeLogin={true} />;
  }

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white p-4 md:p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
          <CardHeader className="text-center border-b border-slate-700 pb-6">
            <motion.img 
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3fc2bcbf-9ff5-4dd1-b724-ac34eb3d196e/2a0983f9ffbd6d222994de9f3e4c1c9f.png" 
              alt="Universitio Logo" 
              className="h-16 w-auto mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center">
              <User className="mr-3 h-8 w-8" /> {employee.name}
            </CardTitle>
            <CardDescription className="text-slate-400 flex items-center justify-center mt-1">
              <Briefcase className="mr-2 h-4 w-4" /> {employee.position}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <AttendanceStatus currentStatus={currentStatus.status} />
            <AttendanceControls
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              currentStatus={currentStatus.status}
              isLoading={actionLoading}
            />
            <AttendanceHistoryList attendanceRecords={attendanceRecords} />
          </CardContent>
          <CardFooter className="border-t border-slate-700 pt-6 flex justify-between items-center">
             <p className="text-xs text-slate-500">Employee Portal &copy; {new Date().getFullYear()} Universitio</p>
            <Button variant="ghost" onClick={handleLogoutClick} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
              <Power className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmployeeAttendancePage;