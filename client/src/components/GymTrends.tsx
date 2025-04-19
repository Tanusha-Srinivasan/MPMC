import React from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GymTrendsProps {
  userData: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const GymTrends: React.FC<GymTrendsProps> = ({ userData }) => {
  if (!userData) return null;

  // Process weekly attendance data
  const weekdayData = WEEKDAYS.map(day => ({
    name: day.slice(0, 3),
    visits: userData.regularity?.day_pattern?.[day] || 0,
  }));

  // Process time of day data
  const timeOfDayData = [
    { name: "Morning", value: userData.regularity?.time_pattern?.morning || 0 },
    { name: "Afternoon", value: userData.regularity?.time_pattern?.afternoon || 0 },
    { name: "Evening", value: userData.regularity?.time_pattern?.evening || 0 }
  ];

  // Calculate the trend data (mock data if not available)
  const trendData = new Array(8).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (7-i));
    
    // Use mock data that somewhat reflects the user's patterns
    // In a real app, this would come from historical data
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayPattern = userData.regularity?.day_pattern || {};
    const dayValue = Object.entries(dayPattern).find(([day]) => 
      day.startsWith(weekday)
    );
    
    // Calculate a value based on user patterns or use random
    const value = dayValue ? Math.min(100, dayValue[1] + Math.random() * 20) : Math.random() * 30;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: Math.round(value),
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Pattern</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: '% of Visits', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
              <Bar dataKey="visits" fill="#6366f1" name="% of Total Visits" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time of Day Preference</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeOfDayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {timeOfDayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Visits']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#6366f1" 
                  name="Gym Activity" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymTrends;