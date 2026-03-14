import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  gradient: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  gradient,
}: StatCardProps) => (
  <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden">
    {/* Gradient overlay on hover */}
    <div
      className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
    />

    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
        <p className="text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <div
        className={`${color} p-4 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
      >
        {Icon}
      </div>
    </div>

    {/* Bottom accent line */}
    <div
      className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
    />
  </div>
);

export default StatCard;
