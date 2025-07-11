'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type MonthlyData = {
  month: string;
  income: number;
  expense: number;
}[];

const MonthlySummaryChart = ({ data }: { data: MonthlyData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [chartHeight, setChartHeight] = useState(300);
  const [barSize, setBarSize] = useState(30);
  const [fontSize, setFontSize] = useState(12);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint in Tailwind
      setIsMobile(mobile);
      setChartHeight(mobile ? 250 : 300);
      setBarSize(mobile ? 20 : 30);
      setFontSize(mobile ? 10 : 12);
    };

    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Monthly Overview</h3>
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={isMobile ? { top: 10, right: 10, left: -20, bottom: 0 } : { top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#9ca3af', fontSize }}
              tickLine={{ stroke: '#4b5563' }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize }}
              tickLine={{ stroke: '#4b5563' }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#f3f4f6',
                fontSize: '0.875rem',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '0.75rem',
              }}
              formatter={(value) => (
                <span className="text-gray-300 text-xs">{value}</span>
              )}
            />
            <Bar 
              key="income-bar" 
              dataKey="income" 
              fill="#10B981" 
              name="Income" 
              radius={[4, 4, 0, 0]}
              barSize={barSize}
            />
            <Bar 
              key="expense-bar" 
              dataKey="expense" 
              fill="#EF4444" 
              name="Expense" 
              radius={[4, 4, 0, 0]}
              barSize={barSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySummaryChart;
