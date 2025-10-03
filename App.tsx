import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import HRAssistant from './components/HRAssistant';
import Payroll from './components/Payroll';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import { View, Role, Employee } from './types';
import RoleSelectionModal from './components/RoleSelectionModal';
import { initialEmployees } from './components/EmployeeList'; // Assuming this is exported for mock auth

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [userRole, setUserRole] = useState<Role | null>(null);

  const currentUser = useMemo((): Employee | null => {
    if (!userRole) return null;
    // Mocking the logged-in user based on role for demo purposes
    switch(userRole) {
      case Role.Admin:
        // Let's make the admin a user that doesn't exist in the employee list to show they are a superuser
        return { id: 'ADMIN-001', name: 'Admin User', role: Role.Admin } as Employee;
      case Role.HRManager:
        return initialEmployees.find(e => e.role === Role.HRManager) || null; // Sneha Gupta
      case Role.Manager:
        return initialEmployees.find(e => e.role === Role.Manager) || null; // Priya Sharma
      case Role.Employee:
        return initialEmployees.find(e => e.id === 'GTBI-002') || null; // Rohan Kumar
      case Role.Intern:
        // Find or create a mock intern if one doesn't exist.
        return initialEmployees.find(e => e.role === Role.Intern) || { id: 'GTBI-INT', name: 'Aisha Khan', role: Role.Intern} as Employee;
      default:
        return null;
    }
  }, [userRole]);


  if (!userRole || !currentUser) {
    return <RoleSelectionModal onSelectRole={setUserRole} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.Employees:
        return <EmployeeList userRole={userRole} />;
      case View.HRAssistant:
        return <HRAssistant userRole={userRole} />;
      case View.Payroll:
        return <Payroll userRole={userRole} currentUser={currentUser} />;
      case View.Attendance:
        return <Attendance />;
      case View.Leave:
        return <LeaveManagement userRole={userRole} currentUser={currentUser} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;