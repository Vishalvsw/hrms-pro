import React from 'react';
import { Employee } from '../types';

interface PayslipModalProps {
  employee: Employee;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const PayslipModal: React.FC<PayslipModalProps> = ({ employee, onClose }) => {
  const monthlyGross = employee.salary / 12;
  const basicSalary = monthlyGross * 0.50;
  const hra = monthlyGross * 0.20;
  const specialAllowance = monthlyGross * 0.20;
  const totalEarnings = basicSalary + hra + specialAllowance;

  const pfDeduction = basicSalary * 0.12;
  const profTax = 200;
  const totalDeductions = pfDeduction + profTax;
  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6" id="payslip-content">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700">Global Trust Bank</h1>
            <p className="text-gray-600">Payslip for the month of October 2023</p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-y py-4 my-4">
            <div>
              <p className="font-bold text-lg">{employee.name}</p>
              <p className="text-sm text-gray-600">{employee.role}</p>
              <p className="text-sm text-gray-600">{employee.department} Department</p>
            </div>
            <div className="text-right">
              <p className="text-sm"><span className="font-semibold">Employee ID:</span> {employee.id}</p>
              <p className="text-sm"><span className="font-semibold">Joining Date:</span> {employee.joiningDate}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-2 text-green-700">Earnings</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Basic Salary</span> <span>{formatCurrency(basicSalary)}</span></div>
                <div className="flex justify-between"><span>House Rent Allowance (HRA)</span> <span>{formatCurrency(hra)}</span></div>
                <div className="flex justify-between"><span>Special Allowance</span> <span>{formatCurrency(specialAllowance)}</span></div>
              </div>
              <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Earnings</span> <span>{formatCurrency(totalEarnings)}</span></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 mb-2 text-red-700">Deductions</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Provident Fund (PF)</span> <span>{formatCurrency(pfDeduction)}</span></div>
                <div className="flex justify-between"><span>Professional Tax</span> <span>{formatCurrency(profTax)}</span></div>
              </div>
              <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Deductions</span> <span>{formatCurrency(totalDeductions)}</span></div>
            </div>
          </div>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg flex justify-between items-center">
            <h3 className="text-lg font-bold">Net Salary</h3>
            <p className="text-xl font-bold font-mono">{formatCurrency(netSalary)}</p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Print</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;