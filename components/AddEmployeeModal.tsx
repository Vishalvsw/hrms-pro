import React, { useState, useEffect } from 'react';
import { Employee, Role } from '../types';

interface EmployeeFormModalProps {
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id' | 'avatar' | 'status'>) => void;
  employeeToEdit: Employee | null;
}

const departments = ['Technology', 'Finance', 'Operations', 'Marketing', 'HR', 'Legal'];
const roles = Object.values(Role);

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ onClose, onSave, employeeToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.Employee,
    department: departments[0],
    salary: 450000,
    joiningDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({ name: '', email: '' });

  const isEditing = employeeToEdit !== null;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        role: employeeToEdit.role,
        department: employeeToEdit.department,
        salary: employeeToEdit.salary,
        joiningDate: employeeToEdit.joiningDate,
      });
    }
  }, [employeeToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', email: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`} />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
               <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
               <div className="sm:col-span-2">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Annual Salary (INR)</label>
                <input type="number" name="salary" id="salary" value={formData.salary} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" onClick={onClose}>
                Cancel
            </button>
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {isEditing ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;