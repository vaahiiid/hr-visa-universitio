import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const LeaveManagement = ({ employee, remainingLeave = 25.1 }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!employee?.id || !employee?.email) {
      toast({
        title: "Error",
        description: "Employee information is missing. Please try logging in again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please log in again to submit a leave request.');
      }

      // Verify that the logged-in user matches the employee
      if (session.user.email !== employee.email) {
        throw new Error('Session email does not match employee email. Please log in with your correct account.');
      }

      // Create the leave request
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          employee_id: employee.id,
          start_date: leaveRequest.startDate,
          end_date: leaveRequest.endDate,
          leave_type: leaveRequest.leaveType,
          reason: leaveRequest.reason,
          status: 'Pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been sent to HR for approval.",
      });

      // Reset form
      setLeaveRequest({
        startDate: '',
        endDate: '',
        leaveType: '',
        reason: ''
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-primary">Annual Leave Balance</h3>
              </div>
              <div className="text-2xl font-bold text-primary">{remainingLeave} days</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leave Request Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span>Request Leave</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={leaveRequest.startDate}
                    onChange={(e) => setLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min={leaveRequest.startDate || format(new Date(), 'yyyy-MM-dd')}
                    value={leaveRequest.endDate}
                    onChange={(e) => setLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select
                  id="leaveType"
                  value={leaveRequest.leaveType}
                  onChange={(e) => setLeaveRequest(prev => ({ ...prev, leaveType: e.target.value }))}
                  required
                >
                  <SelectItem value="">Select leave type</SelectItem>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide details about your leave request..."
                  value={leaveRequest.reason}
                  onChange={(e) => setLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaveManagement; 