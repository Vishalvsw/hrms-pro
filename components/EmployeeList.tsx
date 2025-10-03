import React, { useState, useMemo } from 'react';
import { Employee, Role, LeaveType } from '../types';
import EmployeeModal from './EmployeeModal';
import AddEmployeeModal from './AddEmployeeModal';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';

interface EmployeeListProps {
  userRole: Role;
}

export const initialEmployees: Employee[] = [
  { id: 'GTBI-001', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/1/100', email: 'priya.s@gtb.co.in', role: Role.Manager, department: 'Operations', status: 'Active', salary: 1800000, joiningDate: '2020-03-15', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 15 } },
  { id: 'GTBI-002', name: 'Rohan Kumar', avatar: 'https://picsum.photos/seed/2/100', email: 'rohan.k@gtb.co.in', role: Role.Employee, department: 'Finance', status: 'Active', salary: 1200000, joiningDate: '2021-07-22', leaveBalances: { [LeaveType.Casual]: 5, [LeaveType.Sick]: 8, [LeaveType.Earned]: 12 } },
  { id: 'GTBI-003', name: 'Anjali Mehta', avatar: 'https://picsum.photos/seed/3/100', email: 'anjali.m@gtb.co.in', role: Role.Employee, department: 'Technology', status: 'On Leave', salary: 1500000, joiningDate: '2019-11-01', leaveBalances: { [LeaveType.Casual]: 2, [LeaveType.Sick]: 4, [LeaveType.Earned]: 20 } },
  { id: 'GTBI-004', name: 'Vikram Singh', avatar: 'https://picsum.photos/seed/4/100', email: 'vikram.s@gtb.co.in', role: Role.Manager, department: 'Marketing', status: 'Active', salary: 1600000, joiningDate: '2022-01-10', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 10 } },
  { id: 'GTBI-005', name: 'Sneha Gupta', avatar: 'https://picsum.photos/seed/5/100', email: 'sneha.g@gtb.co.in', role: Role.HRManager, department: 'HR', status: 'Active', salary: 900000, joiningDate: '2021-05-18', leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 18 } },
  { id: 'GTBI-006', name: 'Amit Patel', avatar: 'https://picsum.photos/seed/6/100', email: 'amit.p@gtb.co.in', role: Role.Employee, department: 'Operations', status: 'Active', salary: 600000, joiningDate: '2023-02-28', leaveBalances: { [LeaveType.Casual]: 6, [LeaveType.Sick]: 9, [LeaveType.Earned]: 5 } },
];

const departments = ['All Departments', 'Technology', 'Finance', 'Operations', 'Marketing', 'HR', 'Legal'];
const statuses = ['All Statuses', 'Active', 'On Leave'] as const;
type StatusFilter = typeof statuses[number];

const EmployeeList: React.FC<EmployeeListProps> = ({ userRole }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Statuses');
  
  const canManageEmployees = userRole === Role.Admin || userRole === Role.HRManager;

  const handleViewClick = (employee: Employee) => setSelectedEmployee(employee);
  const handleCloseViewModal = () => setSelectedEmployee(null);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };
  
  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id' | 'avatar' | 'status' | 'salary' | 'joiningDate' | 'leaveBalances'> & { salary?: number; joiningDate?: string }) => {
    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...editingEmployee, ...employeeData } : emp));
    } else {
      // Add new employee
      const newIdNumber = employees.length + 1;
      const newEmployee: Employee = {
        ...employeeData,
        id: `GTBI-${String(newIdNumber).padStart(3, '0')}`,
        avatar: `https://picsum.photos/seed/${newIdNumber}/100`,
        status: 'Active',
        salary: employeeData.salary || 450000,
        joiningDate: employeeData.joiningDate || new Date().toISOString().split('T')[0],
        leaveBalances: { [LeaveType.Casual]: 7, [LeaveType.Sick]: 10, [LeaveType.Earned]: 0 }
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };

  const filteredEmployees = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    
    let filtered = employees;

    if (departmentFilter !== 'All Departments') {
        filtered = filtered.filter(employee => employee.department === departmentFilter);
    }

    if (statusFilter !== 'All Statuses') {
        filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    if (lowercasedQuery) {
        filtered = filtered.filter(employee =>
            employee.name.toLowerCase().includes(lowercasedQuery) ||
            employee.id.toLowerCase().includes(lowercasedQuery) ||
            employee.role.toLowerCase().includes(lowercasedQuery) ||
            employee.department.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    return filtered;
  }, [searchQuery, employees, departmentFilter, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
            {canManageEmployees && (
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Add Employee</span>
              </button>
            )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by department"
            >
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by status"
            >
                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
            <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID..."
                    className="w-full sm:w-60 pl-10 pr-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
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
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${employee.status === 'Active' ? 'bg-green-500' : 'bg-yellow-400'} mr-2`}></div>
                        {employee.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleViewClick(employee)} className="font-medium text-blue-600 hover:underline focus:outline-none">
                          View
                        </button>
                        {canManageEmployees && (
                          <button onClick={() => handleEditClick(employee)} className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none">
                            <EditIcon className="w-4 h-4"/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b">
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No employees found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEmployee && <EmployeeModal employee={selectedEmployee} onClose={handleCloseViewModal} userRole={userRole} />}
      {isFormModalOpen && canManageEmployees && <AddEmployeeModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveEmployee} employeeToEdit={editingEmployee} />}
    </div>
  );
};

export default EmployeeList;