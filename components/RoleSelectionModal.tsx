import React from 'react';
import { Role } from '../types';
import UsersIcon from './icons/UsersIcon';
import SettingsIcon from './icons/SettingsIcon';

interface RoleSelectionModalProps {
  onSelectRole: (role: Role) => void;
}

const roles = [
    { role: Role.Admin, description: "Full system access, manage all settings and payroll.", icon: <SettingsIcon className="w-8 h-8 mx-auto text-blue-500" /> },
    { role: Role.HRManager, description: "Manage employees, leave, and payroll processing.", icon: <UsersIcon className="w-8 h-8 mx-auto text-green-500" /> },
    { role: Role.Manager, description: "View team details and approve/reject leave requests.", icon: <UsersIcon className="w-8 h-8 mx-auto text-yellow-500" /> },
    { role: Role.Employee, description: "View personal info and access self-service tools.", icon: <UsersIcon className="w-8 h-8 mx-auto text-indigo-500" /> },
]

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ onSelectRole }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700 tracking-wider mb-2">
          Welcome to GTB HRMS
        </h1>
        <p className="text-lg text-gray-600">Please select your role to continue</p>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map(({ role, description, icon }) => (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="mb-4">{icon}</div>
              <h2 className="text-xl font-bold text-gray-800">{role}</h2>
              <p className="text-sm text-gray-500 mt-2">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;