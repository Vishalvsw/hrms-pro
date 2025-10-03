import React, { useState, useMemo } from 'react';
import { LeaveRequest, Employee, Role, LeaveType } from '../types';
import PlusIcon from './icons/PlusIcon';
import LeaveRequestModal from './LeaveRequestModal';

interface LeaveManagementProps {
  userRole: Role;
  currentUser: Employee;
}

const initialEmployeesData: Employee[] = [
  { id: 'GTBI-001', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/1/100', email: 'priya.s@gtb.co.in', role: Role.Manager, department: 'Operations', status: 'Active', salary: 1800000, joiningDate: '2020-03-15', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 15 } },
  { id: 'GTBI-002', name: 'Rohan Kumar', avatar: 'https://picsum.photos/seed/2/100', email: 'rohan.k@gtb.co.in', role: Role.Employee, department: 'Finance', status: 'Active', salary: 1200000, joiningDate: '2021-07-22', leaveBalances: { [LeaveType.Casual]: 5, [LeaveType.Sick]: 8, [LeaveType.Earned]: 12 } },
  { id: 'GTBI-003', name: 'Anjali Mehta', avatar: 'https://picsum.photos/seed/3/100', email: 'anjali.m@gtb.co.in', role: Role.Employee, department: 'Technology', status: 'On Leave', salary: 1500000, joiningDate: '2019-11-01', leaveBalances: { [LeaveType.Casual]: 2, [LeaveType.Sick]: 4, [LeaveType.Earned]: 20 } },
];

const initialLeaveRequests: LeaveRequest[] = [
  { id: 'LR-001', employeeId: 'GTBI-001', leaveType: LeaveType.Casual, startDate: '2023-11-10', endDate: '2023-11-12', days: 3, reason: 'Family function', status: 'Approved' },
  { id: 'LR-002', employeeId: 'GTBI-002', leaveType: LeaveType.Earned, startDate: '2023-11-15', endDate: '2023-11-20', days: 6, reason: 'Vacation', status: 'Pending' },
  { id: 'LR-003', employeeId: 'GTBI-003', leaveType: LeaveType.Sick, startDate: '2023-10-25', endDate: '2023-11-05', days: 12, reason: 'Medical', status: 'Approved' },
  { id: 'LR-004', employeeId: 'GTBI-001', leaveType: LeaveType.Casual, startDate: '2023-12-01', endDate: '2023-12-02', days: 2, reason: 'Personal', status: 'Rejected' },
  { id: 'LR-005', employeeId: 'GTBI-002', leaveType: LeaveType.Sick, startDate: '2023-11-28', endDate: '2023-11-28', days: 1, reason: 'Appointment', status: 'Pending' },
];

const StatusPill: React.FC<{ status: LeaveRequest['status'] }> = ({ status }) => {
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full inline-block ${statusClasses[status]}`}>{status}</span>;
};

const LeaveManagement: React.FC<LeaveManagementProps> = ({ userRole, currentUser }) => {
  const [employees, setEmployees] = useState(initialEmployeesData);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const canManageRequests = userRole === Role.Admin || userRole === Role.HRManager || userRole === Role.Manager;

  const handleStatusChange = (id: string, newStatus: LeaveRequest['status']) => {
    const request = leaveRequests.find(req => req.id === id);
    if (!request) return;

    setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, status: newStatus } : req));

    if (newStatus === 'Approved') {
        setEmployees(prevEmployees => 
            prevEmployees.map(emp => {
                if (emp.id === request.employeeId) {
                    const newBalances = { ...emp.leaveBalances };
                    const currentBalance = newBalances[request.leaveType];
                    
                    if (currentBalance >= request.days) {
                         newBalances[request.leaveType] = currentBalance - request.days;
                         return { ...emp, leaveBalances: newBalances };
                    } else {
                        alert(`Insufficient balance for ${emp.name} for ${request.leaveType}. Approval failed.`);
                        // Revert status change in UI
                        setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Pending' } : req));
                        return emp;
                    }
                }
                return emp;
            })
        );
    }
  };
  
  const handleAddRequest = (request: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: `LR-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      status: 'Pending',
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
    setIsModalOpen(false);
  };

  const getEmployee = (employeeId: string) => employees.find(e => e.id === employeeId);

  const filteredRequests = useMemo(() => {
    let requests = leaveRequests;
    
    if (userRole === Role.Employee || userRole === Role.Intern) {
      requests = requests.filter(req => req.employeeId === currentUser.id);
    }
    
    if (filter === 'All') return requests;
    return requests.filter(req => req.status === filter);
  }, [filter, leaveRequests, userRole, currentUser]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>New Request</span>
        </button>
      </div>
      
      {canManageRequests && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave Balances</h2>
          <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3 text-center">{LeaveType.Casual}</th>
                    <th className="px-6 py-3 text-center">{LeaveType.Sick}</th>
                    <th className="px-6 py-3 text-center">{LeaveType.Earned}</th>
                  </tr>
              </thead>
              <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{emp.name}</td>
                      <td className="px-6 py-3 text-center font-mono">{emp.leaveBalances[LeaveType.Casual]}</td>
                      <td className="px-6 py-3 text-center font-mono">{emp.leaveBalances[LeaveType.Sick]}</td>
                      <td className="px-6 py-3 text-center font-mono">{emp.leaveBalances[LeaveType.Earned]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg max-w-md">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`w-full py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>{f}</button>
            ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">Leave Type</th>
                <th scope="col" className="px-6 py-3">Dates</th>
                <th scope="col" className="px-6 py-3 text-center">Days</th>
                <th scope="col" className="px-6 py-3">Reason</th>
                <th scope="col" className="px-6 py-3">Status</th>
                {canManageRequests && <th scope="col" className="px-6 py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const emp = getEmployee(req.employeeId);
                return (
                  <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <img className="w-10 h-10 rounded-full mr-4" src={emp?.avatar} alt={emp?.name} />
                            <div>
                                <div className="font-semibold text-gray-800">{emp?.name}</div>
                                <div className="text-xs text-gray-500">{emp?.id}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{req.leaveType}</td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">{req.startDate} to {req.endDate}</td>
                    <td className="px-6 py-4 text-center font-mono">{req.days}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{req.reason}</td>
                    <td className="px-6 py-4"><StatusPill status={req.status} /></td>
                    {canManageRequests && (
                      <td className="px-6 py-4 text-center">
                        {req.status === 'Pending' && (
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => handleStatusChange(req.id, 'Approved')} className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">Approve</button>
                            <button onClick={() => handleStatusChange(req.id, 'Rejected')} className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">Reject</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <LeaveRequestModal onClose={() => setIsModalOpen(false)} onAdd={handleAddRequest} employees={employees} userRole={userRole} currentUser={currentUser} />}
    </div>
  );
};

export default LeaveManagement;