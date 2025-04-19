import React from 'react';

const ScoreGauge = ({ score }) => {
  // Calculate percentage for the gauge
  const scoreValue = Math.min(100, Math.max(0, score || 0));
  
  // Calculate colors based on score ranges
  const getScoreColor = (value) => {
    if (value >= 80) return '#10B981'; // Green - Excellent
    if (value >= 60) return '#3B82F6'; // Blue - Good
    if (value >= 40) return '#F59E0B'; // Amber - Fair
    return '#EF4444'; // Red - Poor
  };
  
  // Calculate rotation for the gauge needle
  // From -90 (0%) to 90 (100%)
  const needleRotation = -90 + (scoreValue * 1.8);
  
  return (
    <div className="relative w-48 h-48">
      {/* Score display in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold">{scoreValue}</div>
        <div className="text-sm text-gray-500">out of 100</div>
      </div>
      
      {/* Gauge background */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        
        {/* Background track */}
        <path 
          d="M 10,50 A 40,40 0 1,1 90,50" 
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Colored progress arc */}
        <path 
          d="M 10,50 A 40,40 0 1,1 90,50" 
          fill="none" 
          stroke="url(#scoreGradient)" 
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="188.5"
          strokeDashoffset={188.5 - (scoreValue/100 * 188.5)}
        />
        
        {/* Needle */}
        <g transform={`rotate(${needleRotation}, 50, 50)`}>
          <line 
            x1="50" 
            y1="50" 
            x2="50" 
            y2="10" 
            stroke={getScoreColor(scoreValue)}
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="3" fill={getScoreColor(scoreValue)} />
        </g>
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">Poor</div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500">Excellent</div>
    </div>
  );
};

export default ScoreGauge;