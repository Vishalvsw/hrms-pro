import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from './Card';
import UsersIcon from './icons/UsersIcon';
import ChatIcon from './icons/ChatIcon';
import LeaveIcon from './icons/LeaveIcon';

const employeeData = [
    { name: 'Technology', count: 78 },
    { name: 'Finance', count: 45 },
    { name: 'Operations', count: 120 },
    { name: 'Marketing', count: 25 },
    { name: 'HR', count: 15 },
    { name: 'Legal', count: 10 },
];

const recentActivities = [
    { message: "Priya Sharma's leave request was approved.", time: "2 hours ago" },
    { message: "New employee 'Aarav Reddy' was added to the Technology department.", time: "8 hours ago" },
    { message: "Payroll for October has been processed successfully.", time: "1 day ago" },
    { message: "Vikram Singh's profile was updated.", time: "2 days ago" },
];

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">HR Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card title="Total Employees" value="294" icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
                <Card title="On Leave Today" value="1" icon={<LeaveIcon className="w-8 h-8 text-yellow-500" />} />
                <Card title="Pending Requests" value="3" icon={<ChatIcon className="w-8 h-8 text-orange-500" />} />
                <Card title="New Hires (Q2)" value="13" icon={<UsersIcon className="w-8 h-8 text-green-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Distribution by Department</h2>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={employeeData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                                <YAxis tick={{ fill: '#4B5563' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#3B82F6" name="Number of Employees" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <ul className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <li key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                                <p className="text-sm text-gray-700">{activity.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;