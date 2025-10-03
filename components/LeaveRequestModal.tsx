import React, { useState, useEffect } from 'react';
import { LeaveRequest, Employee, LeaveType, Role } from '../types';

interface LeaveRequestModalProps {
  onClose: () => void;
  onAdd: (request: Omit<LeaveRequest, 'id' | 'status'>) => void;
  employees: Pick<Employee, 'id' | 'name'>[];
  userRole: Role;
  currentUser: Employee;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ onClose, onAdd, employees, userRole, currentUser }) => {
  const isEmployeeOrIntern = userRole === Role.Employee || userRole === Role.Intern;

  const [formData, setFormData] = useState({
    employeeId: isEmployeeOrIntern ? currentUser.id : (employees[0]?.id || ''),
    leaveType: LeaveType.Casual,
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        setDays(0);
        return;
      }
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(diffDays);
    } else {
      setDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId && formData.startDate && formData.endDate && formData.reason && days > 0) {
      onAdd({ ...formData, days });
    } else {
      alert('Please fill all fields correctly. End date must be after or same as start date.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">New Leave Request</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee</label>
                <select 
                  id="employeeId" 
                  value={formData.employeeId} 
                  onChange={e => setFormData({ ...formData, employeeId: e.target.value })} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  disabled={isEmployeeOrIntern}
                >
                  {isEmployeeOrIntern ? (
                    <option value={currentUser.id}>{currentUser.name}</option>
                  ) : (
                    employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select id="leaveType" value={formData.leaveType} onChange={e => setFormData({ ...formData, leaveType: e.target.value as LeaveType })} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  {Object.values(LeaveType).map(lt => <option key={lt} value={lt}>{lt}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" id="startDate" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" id="endDate" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" />
                </div>
              </div>
              {days > 0 && (
                <div className="text-center bg-gray-100 p-2 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Total Days: <span className="font-bold text-blue-600">{days}</span></p>
                </div>
              )}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea id="reason" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;