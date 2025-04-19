import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ConsistencyContext from '../context/ConsistencyContext'; // Ensure correct path
import Card from '../components/ui/Card';                 // Ensure correct path
import LoadingState from '../components/LoadingState';      // Ensure correct path

const ProgressPage = () => {
  // Destructure context, getting userData and loading state
  const { userData, loading } = useContext(ConsistencyContext);
  // Get scoreHistory from userData
  const { scoreHistory } = userData;

  // --- Animation Variants --- (Keep these)
   const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
   };
   const transition = { duration: 0.4, ease: 'easeInOut' };
   // --- End Animation Variants ---


   // --- Trend Calculation --- (Keep this logic, uses scoreHistory)
   const getTrendInfo = () => {
      if (!scoreHistory || scoreHistory.length < 2) return { text: "Not enough data", icon: Minus, color: 'text-gray-500' };
      const firstScore = scoreHistory[0].score;
      const lastScore = scoreHistory[scoreHistory.length - 1].score;
      const change = lastScore - firstScore;

      if (change > 5) return { text: `Trending Up (+${change})`, icon: TrendingUp, color: 'text-green-600' };
      if (change < -5) return { text: `Trending Down (${change})`, icon: TrendingDown, color: 'text-red-600' };
      return { text: `Stable (${change >= 0 ? '+' : ''}${change})`, icon: Minus, color: 'text-yellow-600' };
   }
   const trendInfo = getTrendInfo();
   const TrendIcon = trendInfo.icon;
   // --- End Trend Calculation ---

   // --- Custom Tooltip --- (Keep this)
   const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
          return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-800">{`Date: ${label}`}</p>
              <p className="text-sm text-indigo-600">{`Score: ${payload[0].value}`}</p>
          </div>
          );
      }
      return null;
   };
   // --- End Custom Tooltip ---

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={transition}
      className="container mx-auto px-4 py-8"
    >
       {/* Back Link */}
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
         <Link to="/" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6 group font-medium">
           <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
           Back to Dashboard
         </Link>
       </motion.div>

      {/* Page Header */}
       <motion.h1
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="flex items-center text-3xl font-bold text-gray-800 mb-8"
       >
           <BarChart3 className="mr-3 text-indigo-600" size={30}/>
           Progress History
       </motion.h1>

      {/* Loading State */}
      {loading ? (
        <Card className="flex items-center justify-center min-h-[400px]">
           <LoadingState message="Loading Progress Data..." />
        </Card>
      ) : (
        <Card className="p-4 md:p-6">
          {/* Check if scoreHistory exists and has enough data */}
          {scoreHistory && scoreHistory.length > 1 ? (
            <>
             {/* Trend Indicator */}
             <div className={`flex items-center mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200 ${trendInfo.color}`}>
                <TrendIcon size={20} className="mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">{trendInfo.text}</span>
             </div>

             {/* Chart Container */}
             <div className="h-[350px] w-full"> {/* Ensure container has explicit height */}
                <ResponsiveContainer>
                      <LineChart
                          data={scoreHistory} // Use scoreHistory from context
                          margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                              dataKey="date"
                              tick={{ fontSize: 11, fill: '#6b7280' }}
                              axisLine={{ stroke: '#d1d5db' }}
                              tickLine={{ stroke: '#d1d5db' }}
                              padding={{ left: 10, right: 10 }}
                          />
                          <YAxis
                              domain={[0, 100]}
                              tick={{ fontSize: 11, fill: '#6b7280' }}
                              axisLine={{ stroke: '#d1d5db' }}
                              tickLine={{ stroke: '#d1d5db' }}
                           />
                           <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                           <Legend
                              wrapperStyle={{ fontSize: '13px', paddingTop: '15px' }}
                              iconType="circle"
                              iconSize={10}
                            />
                          <Line
                              type="monotone"
                              dataKey="score" // Key in scoreHistory objects
                              stroke="#6366f1"
                              strokeWidth={2.5}
                              activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
                              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                              name="Consistency Score"
                          />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
            </>
          ) : (
            // Empty State - More engaging
            <div className="text-center py-12">
                <BarChart3 size={56} className="mx-auto text-gray-400 mb-5" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Track Your Progress</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                   Keep working out consistently! Your score history will appear here once you have more data points.
                </p>
                 <Link to="/split" className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                    View Your Workout Split
                 </Link>
            </div>
          )}
        </Card>
      )}
    </motion.div>
  );
};

export default ProgressPage;