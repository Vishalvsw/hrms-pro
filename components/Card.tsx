import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="bg-gray-100 rounded-full p-3">
        {icon}
      </div>
    </div>
  );
};

export default Card;
