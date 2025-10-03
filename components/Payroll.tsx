import React, { useState, useMemo } from 'react';
import { Employee, Role, LeaveType } from '../types';
import PayslipModal from './PayslipModal';

interface PayrollProps {
  userRole: Role;
  currentUser: Employee;
}

const initialEmployees: Employee[] = [
  { id: 'GTBI-001', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/1/100', email: 'priya.s@gtb.co.in', role: Role.Manager, department: 'Operations', status: 'Active', salary: 1800000, joiningDate: '2020-03-15', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 15 } },
  { id: 'GTBI-002', name: 'Rohan Kumar', avatar: 'https://picsum.photos/seed/2/100', email: 'rohan.k@gtb.co.in', role: Role.Employee, department: 'Finance', status: 'Active', salary: 1200000, joiningDate: '2021-07-22', leaveBalances: { [LeaveType.Casual]: 5, [LeaveType.Sick]: 8, [LeaveType.Earned]: 12 } },
  { id: 'GTBI-003', name: 'Anjali Mehta', avatar: 'https://picsum.photos/seed/3/100', email: 'anjali.m@gtb.co.in', role: Role.Employee, department: 'Technology', status: 'On Leave', salary: 1500000, joiningDate: '2019-11-01', leaveBalances: { [LeaveType.Casual]: 2, [LeaveType.Sick]: 4, [LeaveType.Earned]: 20 } },
  { id: 'GTBI-004', name: 'Vikram Singh', avatar: 'https://picsum.photos/seed/4/100', email: 'vikram.s@gtb.co.in', role: Role.Manager, department: 'Marketing', status: 'Active', salary: 1600000, joiningDate: '2022-01-10', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 10 } },
  { id: 'GTBI-005', name: 'Sneha Gupta', avatar: 'https://picsum.photos/seed/5/100', email: 'sneha.g@gtb.co.in', role: Role.HRManager, department: 'HR', status: 'Active', salary: 900000, joiningDate: '2021-05-18', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 18 } },
  { id: 'GTBI-006', name: 'Amit Patel', avatar: 'https://picsum.photos/seed/6/100', email: 'amit.p@gtb.co.in', role: Role.Employee, department: 'Operations', status: 'Active', salary: 600000, joiningDate: '2023-02-28', leaveBalances: { [LeaveType.Casual]: 6, [LeaveType.Sick]: 9, [LeaveType.Earned]: 5 } },
];

const Payroll: React.FC<PayrollProps> = ({ userRole, currentUser }) => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [payslipEmployee, setPayslipEmployee] = useState<Employee | null>(null);

  const displayedEmployees = useMemo(() => {
    if (userRole === Role.Employee || userRole === Role.Intern) {
      return employees.filter(e => e.id === currentUser.id);
    }
    return employees;
  }, [userRole, currentUser, employees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payroll Management</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3 text-right">Annual Salary</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.map((employee) => (
                <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="w-10 h-10 rounded-full mr-4" src={employee.avatar} alt={employee.name} />
                      <div>
                        <div className="text-base font-semibold">{employee.name}</div>
                        <div className="font-normal text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{employee.id}</td>
                  <td className="px-6 py-4">{employee.role}</td>
                  <td className="px-6 py-4 font-mono text-right text-gray-800">{formatCurrency(employee.salary)}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setPayslipEmployee(employee)}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-md font-semibold text-xs hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {payslipEmployee && <PayslipModal employee={payslipEmployee} onClose={() => setPayslipEmployee(null)} />}
    </div>
  );
};

export default Payroll;