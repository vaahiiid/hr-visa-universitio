import React from 'react';
import { motion } from 'framer-motion';
import { ListChecks, CalendarDays, Clock } from 'lucide-react';
import { format, differenceInMinutes, parseISO } from 'date-fns';

const AttendanceHistoryList = ({ attendanceRecords }) => {
  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diffMins = differenceInMinutes(parseISO(end), parseISO(start));
    if (diffMins < 0) return 'Error';
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  // Group records by date and clean up status
  const groupedRecords = attendanceRecords.reduce((acc, record) => {
    const date = format(parseISO(record.attendance_date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    // Clean up the status by removing the timestamp
    const cleanRecord = {
      ...record,
      status: record.status.split('_')[0]
    };
    acc[date].push(cleanRecord);
    return acc;
  }, {});

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
        <ListChecks className="mr-3 h-7 w-7 text-primary" /> Attendance History
      </h3>
      <div className="max-h-96 overflow-y-auto bg-muted/50 p-4 rounded-lg shadow-sm border border-border/30 custom-scrollbar">
        <ul className="space-y-4">
          {Object.entries(groupedRecords).map(([date, records]) => (
            <motion.li
              key={date}
              className="p-4 rounded-md border shadow-sm bg-card border-primary/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-lg text-foreground flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-primary/70" />
                  {format(parseISO(date), 'eeee, MMMM do yyyy')}
                </span>
              </div>
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div key={record.id} className="pl-4 border-l-2 border-primary/20">
                    <div className="text-xs text-muted-foreground mb-1">
                      Session #{index + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-success" />
                        <span className="font-medium text-success">Clock In:</span>
                        <span className="ml-2 text-foreground">
                          {format(parseISO(record.clock_in_time), 'h:mm a')}
                        </span>
                      </div>
                      {record.clock_out_time && (
                        <>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-destructive" />
                            <span className="font-medium text-destructive">Clock Out:</span>
                            <span className="ml-2 text-foreground">
                              {format(parseISO(record.clock_out_time), 'h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1 pl-6">
                            <span className="font-medium">Duration:</span>
                            <span className="ml-2">
                              {formatDuration(record.clock_in_time, record.clock_out_time)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceHistoryList;