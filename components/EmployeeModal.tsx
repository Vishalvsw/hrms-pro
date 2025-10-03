import React from 'react';
import { Employee, Role } from '../types';

interface EmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  userRole: Role;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, userRole }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            Employee Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img className="w-24 h-24 rounded-full object-cover flex-shrink-0" src={employee.avatar} alt={employee.name} />
            <div className="text-center sm:text-left pt-2">
                <p className="text-2xl font-bold text-gray-800">{employee.name}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <svg className={`-ml-0.5 mr-1.5 h-2 w-2 ${employee.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`} fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                    </svg>
                    {employee.status}
                </span>
            </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{employee.id}</dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.department}</dd>
                </div>
                 <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.role}</dd>
                </div>
                {(userRole === Role.Admin || userRole === Role.HRManager) && (
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Annual Salary</dt>
                        <dd className="mt-1 text-sm text-green-700 font-semibold font-mono">{formatCurrency(employee.salary)}</dd>
                    </div>
                )}
            </dl>
        </div>

        <div className="mt-6 flex justify-end">
            <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={onClose}
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;