import React from 'react';
import { Role } from '../types';

interface HeaderProps {
  userRole: Role;
}

const userProfiles = {
  [Role.Admin]: { name: 'Admin User', title: 'System Administrator' },
  [Role.HRManager]: { name: 'Aditi Singh', title: 'HR Manager' },
  [Role.Manager]: { name: 'Vikram Singh', title: 'Manager' },
  [Role.Employee]: { name: 'Rohan Kumar', title: 'Employee' },
  [Role.Intern]: { name: 'Aisha Khan', title: 'Intern' },
};


const Header: React.FC<HeaderProps> = ({ userRole }) => {
  const profile = userProfiles[userRole] || userProfiles[Role.Employee];

  return (
    <header className="flex items-center justify-end h-16 bg-white border-b border-gray-200 px-6 lg:px-8 shrink-0">
      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center space-x-3 focus:outline-none">
            <span className="text-right hidden sm:block">
              <span className="block text-sm font-semibold text-gray-800">{profile.name}</span>
              <span className="block text-xs text-gray-500">{profile.title}</span>
            </span>
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={`https://i.pravatar.cc/150?u=${profile.name}`}
              alt="User avatar"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;