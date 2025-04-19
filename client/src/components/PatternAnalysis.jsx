import React from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const PatternAnalysis = ({ frequency, regularity, recency }) => {
  // If no data yet
  if (!regularity || !frequency) {
    return (
      <div className="text-gray-500 text-center py-4">
        Attendance pattern data not available
      </div>
    );
  }

  // Calculate top day
  let topDay = "None";
  let topDayValue = 0;
  
  if (regularity.day_pattern) {
    Object.entries(regularity.day_pattern).forEach(([day, value]) => {
      if (value > topDayValue) {
        topDay = day;
        topDayValue = value;
      }
    });
  }

  // Calculate preferred time
  let preferredTime = "None";
  let preferredTimeValue = 0;
  
  if (regularity.time_pattern) {
    Object.entries(regularity.time_pattern).forEach(([time, value]) => {
      if (value > preferredTimeValue) {
        preferredTime = time.charAt(0).toUpperCase() + time.slice(1);
        preferredTimeValue = value;
      }
    });
  }

  return (
    <div>
      {/* Attendance Frequency */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Frequency</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, (frequency.percentage || 0))}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0%</span>
          <span>{Math.round(frequency.percentage || 0)}%</span>
          <span>100%</span>
        </div>
        <p className="text-sm mt-2">
          Visited <span className="font-medium">{frequency.days_visited || 0}</span> out of{" "}
          <span className="font-medium">{frequency.total_days || 0}</span> days
        </p>
      </div>

      {/* Time Preference */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          Preferred Time
        </h3>
        <div className="flex items-center">
          <span className="text-lg font-medium">{preferredTime}</span>
          <span className="ml-2 text-sm text-gray-500">({preferredTimeValue}% of visits)</span>
        </div>
        
        {/* Small chart */}
        <div className="grid grid-cols-3 gap-1 mt-3">
          {regularity.time_pattern && Object.entries(regularity.time_pattern).map(([time, value]) => (
            <div key={time} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{time.charAt(0).toUpperCase() + time.slice(1)}</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${time === preferredTime.toLowerCase() ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1">{value}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Preference */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          Top Attendance Day
        </h3>
        <div className="flex items-center">
          <span className="text-lg font-medium">{topDay}</span>
          <span className="ml-2 text-sm text-gray-500">({topDayValue}% of visits)</span>
        </div>
        
        {/* Weekly pattern */}
        <div className="flex gap-0.5 mt-3">
          {regularity.day_pattern && Object.entries(regularity.day_pattern)
            .sort((a, b) => {
              const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
              return days.indexOf(a[0]) - days.indexOf(b[0]);
            })
            .map(([day, value]) => (
              <div key={day} className="flex-1 text-center">
                <div className="text-xs text-gray-500 mb-1">{day.slice(0, 3)}</div>
                <div 
                  className={`h-10 rounded ${day === topDay ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                  style={{ opacity: value / 100 }}
                ></div>
                <div className="text-xs mt-1">{value}%</div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternAnalysis;