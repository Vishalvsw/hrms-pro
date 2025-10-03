import React from 'react';
import { View, Role } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import UsersIcon from './icons/UsersIcon';
import ChatIcon from './icons/ChatIcon';
import SettingsIcon from './icons/SettingsIcon';
import PayrollIcon from './icons/PayrollIcon';
import CalendarIcon from './icons/CalendarIcon';
import LeaveIcon from './icons/LeaveIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  userRole: Role;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  onClick: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, currentView, onClick, icon, label }) => {
  const isActive = currentView === view;
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(view);
        }}
        className={`flex items-center p-3 my-1 rounded-lg text-base font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        {icon}
        <span className="ml-4">{label}</span>
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole }) => {
  const canAccess = (allowedRoles: Role[]): boolean => allowedRoles.includes(userRole);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-700 tracking-wider">
          GTB HRMS
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul>
          <NavItem 
            view={View.Dashboard} 
            currentView={currentView} 
            onClick={setCurrentView} 
            icon={<DashboardIcon className="w-6 h-6" />} 
            label="Dashboard" 
          />
          <NavItem 
            view={View.Employees} 
            currentView={currentView} 
            onClick={setCurrentView} 
            icon={<UsersIcon className="w-6 h-6" />} 
            label="Employees" 
          />
           <NavItem 
            view={View.Attendance} 
            currentView={currentView} 
            onClick={setCurrentView} 
            icon={<CalendarIcon className="w-6 h-6" />} 
            label="Attendance" 
          />
          {canAccess([Role.Admin, Role.HRManager, Role.Manager]) && (
            <NavItem 
              view={View.Leave} 
              currentView={currentView} 
              onClick={setCurrentView} 
              icon={<LeaveIcon className="w-6 h-6" />} 
              label="Leave Management" 
            />
          )}
          {canAccess([Role.Admin, Role.HRManager]) && (
            <NavItem 
              view={View.Payroll} 
              currentView={currentView} 
              onClick={setCurrentView} 
              icon={<PayrollIcon className="w-6 h-6" />} 
              label="Payroll" 
            />
          )}
          <NavItem 
            view={View.HRAssistant} 
            currentView={currentView} 
            onClick={setCurrentView} 
            icon={<ChatIcon className="w-6 h-6" />} 
            label="HR Assistant" 
          />
        </ul>
      </nav>
      <div className="px-4 pb-6">
        <ul>
            {canAccess([Role.Admin, Role.HRManager]) && (
              <NavItem 
                  view={View.Settings} 
                  currentView={currentView} 
                  onClick={() => alert("Settings not implemented yet.")} 
                  icon={<SettingsIcon className="w-6 h-6" />} 
                  label="Settings" 
              />
            )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;