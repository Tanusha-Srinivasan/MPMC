import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConsistencyContext from '../context/ConsistencyContext';
import ScoreGauge from '../components/ScoreGauge';
import InsightCard from '../components/InsightCard';
import AttendanceChart from '../components/AttendanceChart';
import PatternAnalysis from '../components/PatternAnalysis';
import { ArrowPathIcon, ChartPieIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { userData, refreshScore, loading } = useContext(ConsistencyContext);

  useEffect(() => {
    // Optional: Auto-refresh on mount
    // refreshScore();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userData.profile.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your gym consistency analysis</p>
        </div>
        <button
          onClick={refreshScore}
          disabled={loading}
          className={`mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating...' : 'Refresh Score'}
        </button>
      </div>

      {/* Score and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Consistency Score</h2>
            <div className="flex-grow flex flex-col items-center justify-center">
              <ScoreGauge score={userData.score} />
              <div className="mt-4 text-center">
                <span className="block text-lg font-medium text-gray-700">
                  {userData.userType || "Regular Gym Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">ML-Powered Insights</h2>
            <div className="space-y-4">
              {userData.insights && userData.insights.map((insight, index) => (
                <InsightCard key={index} text={insight} />
              ))}
              {userData.recommendations && userData.recommendations.map((rec, index) => (
                <InsightCard key={`rec-${index}`} text={rec} isRecommendation={true} />
              ))}
              {(!userData.insights || userData.insights.length === 0) && 
                (!userData.recommendations || userData.recommendations.length === 0) && (
                <p className="text-gray-500 text-center py-6">
                  Keep visiting the gym to generate personalized insights and recommendations!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <ChartPieIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Score Progression
            </h2>
            <AttendanceChart data={userData.scoreHistory || []} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <CalendarDaysIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Attendance Patterns
            </h2>
            
            <PatternAnalysis 
              frequency={userData.frequency} 
              regularity={userData.regularity} 
              recency={userData.recency}
            />
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Last Visit</span>
                <span className="text-sm font-medium">
                  {userData.recency?.days_since_last_visit === 0 
                    ? "Today" 
                    : userData.recency?.days_since_last_visit === 1
                    ? "Yesterday"
                    : `${userData.recency?.days_since_last_visit || "?"} days ago`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;