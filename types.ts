export enum View {
  Dashboard = 'Dashboard',
  Employees = 'Employees',
  HRAssistant = 'HR Assistant',
  Payroll = 'Payroll',
  Attendance = 'Attendance',
  Leave = 'Leave Management',
  Settings = 'Settings'
}

export enum Role {
  Admin = 'Admin',
  HRManager = 'HR Manager',
  Employee = 'Employee',
  Manager = 'Manager',
  Intern = 'Intern',
}

export enum LeaveType {
  Casual = 'Casual Leave',
  Sick = 'Sick Leave',
  Earned = 'Earned Leave',
}

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: Role;
  department: string;
  status: 'Active' | 'On Leave';
  salary: number;
  joiningDate: string;
  leaveBalances: {
    [key in LeaveType]: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AttendanceRecord {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}