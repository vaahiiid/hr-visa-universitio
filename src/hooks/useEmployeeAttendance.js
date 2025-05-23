import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';

export const useEmployeeAttendance = (employeeId) => {
  const { toast } = useToast();
  const [employee, setEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState({ status: 'Clocked Out', recordId: null });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEmployeeDetails = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .select('id, name, position')
      .eq('id', employeeId)
      .single();
    setLoading(false);
    if (error) {
      toast({ title: 'Error fetching employee details', description: error.message, variant: 'destructive' });
      return null;
    }
    setEmployee(data);
    return data;
  }, [employeeId, toast]);

  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('attendance_date', { ascending: false })
      .order('clock_in_time', { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: 'Error fetching attendance records', description: error.message, variant: 'destructive' });
      return [];
    }
    setAttendanceRecords(data);
    return data;
  }, [employeeId, toast]);

  const determineCurrentStatus = useCallback((records) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = records.find(
      (r) => format(parseISO(r.attendance_date), 'yyyy-MM-dd') === today && r.status !== 'Annual Leave' && r.status !== 'Sick Leave'
    );

    if (todayRecord) {
      if (todayRecord.clock_in_time && !todayRecord.clock_out_time) {
        setCurrentStatus({ status: 'Clocked In', recordId: todayRecord.id });
      } else {
        setCurrentStatus({ status: 'Clocked Out', recordId: null });
      }
    } else {
       const onLeaveToday = records.find(r => format(parseISO(r.attendance_date), 'yyyy-MM-dd') === today && (r.status === 'Annual Leave' || r.status === 'Sick Leave'));
        if (onLeaveToday) {
            setCurrentStatus({ status: onLeaveToday.status, recordId: onLeaveToday.id });
        } else {
            setCurrentStatus({ status: 'Clocked Out', recordId: null });
        }
    }
  }, []);

  const handleClockIn = async () => {
    if (!employee) return;
    setActionLoading(true);
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('employee_attendance')
      .insert({
        employee_id: employee.id,
        attendance_date: today,
        clock_in_time: now.toISOString(),
        status: employee.position?.toLowerCase().includes('part-time') ? 'Part-time Present' : 'Present',
      })
      .select()
      .single();
    setActionLoading(false);
    if (error) {
      toast({ title: 'Clock In Failed', description: error.message, variant: 'destructive' });
    } else if (data) {
      toast({ title: 'Clocked In', description: `Welcome, ${employee.name}!` });
      setAttendanceRecords(prev => [data, ...prev]);
      setCurrentStatus({ status: 'Clocked In', recordId: data.id });
    }
  };

  const handleClockOut = async () => {
    if (!employee || !currentStatus.recordId) return;
    setActionLoading(true);
    const now = new Date();

    const { data, error } = await supabase
      .from('employee_attendance')
      .update({ clock_out_time: now.toISOString() })
      .eq('id', currentStatus.recordId)
      .select()
      .single();
    setActionLoading(false);
    if (error) {
      toast({ title: 'Clock Out Failed', description: error.message, variant: 'destructive' });
    } else if (data) {
      toast({ title: 'Clocked Out', description: `Goodbye, ${employee.name}!` });
      setAttendanceRecords(prev => prev.map(r => r.id === data.id ? data : r));
      setCurrentStatus({ status: 'Clocked Out', recordId: null });
    }
  };

  return {
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
  };
};