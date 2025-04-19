import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const AttendanceChart = ({ data }) => {
  // Ensure data is available and sorted
  const chartData = data && data.length > 0 
    ? [...data].sort((a, b) => a.timestamp - b.timestamp) 
    : [];
    
  // Get min and max scores for better visualization
  const minScore = Math.max(0, Math.min(...chartData.map(d => d.score)) - 10);
  const maxScore = Math.min(100, Math.max(...chartData.map(d => d.score)) + 10);
  
  // Calculate score thresholds for reference lines
  const scoreThresholds = {
    excellent: 80, 
    good: 60,
    fair: 40
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-500">No attendance data available</p>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const scoreValue = payload[0].value;
      
      let scoreCategory = "Poor";
      if (scoreValue >= scoreThresholds.excellent) scoreCategory = "Excellent";
      else if (scoreValue >= scoreThresholds.good) scoreCategory = "Good";
      else if (scoreValue >= scoreThresholds.fair) scoreCategory = "Fair";
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Score: <span className="font-medium">{scoreValue}</span>
          </p>
          <p className="text-xs text-gray-600">{scoreCategory}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickCount={5} 
          />
          <YAxis 
            domain={[minScore, maxScore]} 
            tick={{ fontSize: 12 }}
            tickCount={5}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference lines for score thresholds */}
          <ReferenceLine y={scoreThresholds.excellent} stroke="#10B981" strokeDasharray="3 3" />
          <ReferenceLine y={scoreThresholds.good} stroke="#3B82F6" strokeDasharray="3 3" />
          <ReferenceLine y={scoreThresholds.fair} stroke="#F59E0B" strokeDasharray="3 3" />
          
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "#6366F1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;