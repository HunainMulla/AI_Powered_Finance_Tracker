'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

type CategoryData = {
  name: string;
  value: number;
}[];

const CategorySpendingChart = ({ data }: { data: CategoryData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [chartHeight, setChartHeight] = useState(320);
  const [outerRadius, setOuterRadius] = useState(80);
  const [legendLayout, setLegendLayout] = useState('horizontal');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint in Tailwind
      setIsMobile(mobile);
      setChartHeight(mobile ? 280 : 320);  
      setOuterRadius(mobile ? 50 : 80);    
      setLegendLayout(mobile ? 'vertical' : 'horizontal');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
      <h3 className="text-base font-semibold text-gray-200 mb-2">Spending by Category</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategorySpendingChart;
