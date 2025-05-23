import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Check, X, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const LeaveRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees!leave_requests_employee_id_fkey (
            name,
            position
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch leave requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to changes
    const channel = supabase
      .channel('leave_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leave_requests' }, 
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: `Leave Request ${action}`,
        description: `The leave request has been ${action.toLowerCase()}.`
      });

      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} leave request.`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Approved: "bg-green-100 text-green-800 border-green-200",
      Rejected: "bg-red-100 text-red-800 border-red-200"
    };

    return (
      <Badge className={styles[status]}>
        {status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
        {status === 'Approved' && <Check className="w-3 h-3 mr-1" />}
        {status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>Leave Requests</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No leave requests found.
            </div>
          ) : (
            requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{request.employees?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(request.start_date), 'MMM dd, yyyy')} - {format(parseISO(request.end_date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Type:</span> {request.leave_type}
                    </p>
                    <p className="text-sm mt-2">{request.reason}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(request.status)}
                    {request.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleAction(request.id, 'Approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleAction(request.id, 'Rejected')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsList; 