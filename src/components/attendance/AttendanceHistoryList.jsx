import React from 'react';
import { motion } from 'framer-motion';
import { ListChecks, CalendarDays } from 'lucide-react';
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

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-slate-200 flex items-center">
        <ListChecks className="mr-3 h-7 w-7 text-primary" /> Attendance History
      </h3>
      <div className="max-h-96 overflow-y-auto bg-slate-700/30 p-4 rounded-lg shadow-inner custom-scrollbar">
        {attendanceRecords.length > 0 ? (
          <ul className="space-y-3">
            {attendanceRecords.map((record) => (
              <motion.li
                key={record.id}
                className={`p-4 rounded-md border ${
                    record.status === 'Annual Leave' || record.status === 'Sick Leave'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : record.clock_in_time && record.clock_out_time
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  } shadow-md`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-lg text-slate-100">
                    {format(parseISO(record.attendance_date), 'eeee, MMMM do yyyy')}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      record.status === 'Annual Leave' || record.status === 'Sick Leave'
                        ? 'bg-yellow-400 text-yellow-900'
                        : record.status.includes('Present')
                        ? 'bg-green-400 text-green-900'
                        : 'bg-blue-400 text-blue-900'
                    }`}>{record.status} {record.notes ? `(${record.notes})` : ''}</span>
                </div>
                {record.status !== 'Annual Leave' && record.status !== 'Sick Leave' && (
                   <div className="text-sm text-slate-300 grid grid-cols-3 gap-2">
                    <div>
                        <span className="font-medium">In:</span> {record.clock_in_time ? format(parseISO(record.clock_in_time), 'HH:mm') : 'N/A'}
                    </div>
                    <div>
                        <span className="font-medium">Out:</span> {record.clock_out_time ? format(parseISO(record.clock_out_time), 'HH:mm') : 'N/A'}
                    </div>
                    <div>
                        <span className="font-medium">Duration:</span> {formatDuration(record.clock_in_time, record.clock_out_time)}
                    </div>
                </div>
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <CalendarDays className="mx-auto h-12 w-12 mb-2" />
            <p>No attendance records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistoryList;