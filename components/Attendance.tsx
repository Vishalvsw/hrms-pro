import React, { useState } from 'react';
import { Employee, AttendanceRecord } from '../types';

// Mock data - in a real app, this would come from an API
const employees: Pick<Employee, 'id' | 'name' | 'avatar'>[] = [
  { id: 'GTBI-001', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/1/100' },
  { id: 'GTBI-002', name: 'Rohan Kumar', avatar: 'https://picsum.photos/seed/2/100' },
  { id: 'GTBI-004', name: 'Vikram Singh', avatar: 'https://picsum.photos/seed/4/100' },
  { id: 'GTBI-005', name: 'Sneha Gupta', avatar: 'https://picsum.photos/seed/5/100' },
  { id: 'GTBI-006', name: 'Amit Patel', avatar: 'https://picsum.photos/seed/6/100' },
];

const attendanceLog: AttendanceRecord[] = [
  { employeeId: 'GTBI-001', date: '2023-10-27', checkIn: '09:25 AM', checkOut: '06:03 PM', status: 'Present' },
  { employeeId: 'GTBI-002', date: '2023-10-27', checkIn: '09:45 AM', checkOut: '06:10 PM', status: 'Late' },
  { employeeId: 'GTBI-004', date: '2023-10-27', checkIn: '09:18 AM', checkOut: '05:58 PM', status: 'Present' },
  { employeeId: 'GTBI-005', date: '2023-10-27', checkIn: '09:30 AM', checkOut: '06:00 PM', status: 'Present' },
  { employeeId: 'GTBI-006', date: '2023-10-27', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
];

const getEmployeeDetails = (id: string) => employees.find(e => e.id === id);

const StatusPill: React.FC<{ status: AttendanceRecord['status'] }> = ({ status }) => {
  const baseClasses = "px-2 py-0.5 text-xs font-semibold rounded-full inline-block";
  const statusClasses = {
    Present: "bg-green-100 text-green-800",
    Late: "bg-yellow-100 text-yellow-800",
    Absent: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const Attendance: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Daily Attendance</h1>
        <div className="flex items-center gap-2">
            <label htmlFor="attendance-date" className="text-sm font-medium text-gray-700">Date:</label>
            <input
                type="date"
                id="attendance-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

       <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">Check In</th>
                <th scope="col" className="px-6 py-3">Check Out</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLog.map((log) => {
                const employee = getEmployeeDetails(log.employeeId);
                if (!employee) return null;
                return (
                  <tr key={log.employeeId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-4" src={employee.avatar} alt={employee.name} />
                        <div>
                          <div className="text-base font-semibold">{employee.name}</div>
                          <div className="font-normal text-gray-500">{employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">{log.checkIn}</td>
                    <td className="px-6 py-4 font-mono">{log.checkOut}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={log.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;