import { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Award, Loader2 } from 'lucide-react'; // Ensure Loader2 is imported
import confetti from 'canvas-confetti';
import ConsistencyContext from '../context/ConsistencyContext'; // Ensure correct path
import { getScoreInfo } from '../utils/helpers';           // Ensure correct path

const ScoreDisplay = () => {
  // Destructure context: get userData, loading, and refreshScore function
  const { userData, loading, refreshScore } = useContext(ConsistencyContext);
  // Get score from userData
  const { score } = userData;

  // Pass score to getScoreInfo helper
  const { color, bgColor, ringColor, message } = getScoreInfo(score);

  useEffect(() => {
    // Trigger confetti only when not loading and score is high
    if (!loading && score !== null && score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 1000
      });
    }
  }, [score, loading]); // Depend on score and loading state

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${bgColor} p-6 rounded-xl shadow-subtle border border-gray-200/50`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Score Info */}
        <div className="flex-grow">
            <div className="flex items-center mb-1.5">
                <Award size={24} className={`${color} mr-2 flex-shrink-0`} />
                <h3 className="text-lg font-semibold text-gray-800">Consistency Score</h3>
            </div>
            {/* Display message based on score or loading state */}
            <p className={`${color} text-sm sm:text-base`}>
              {loading ? 'Calculating...' : message}
            </p>
        </div>

        {/* Score Circle and Refresh Button */}
        <div className="flex items-center gap-4">
          <motion.div
            key={score} // Re-animate when score changes
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`relative flex items-center justify-center h-24 w-24 ${ringColor} ring-[6px] ring-opacity-50 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-inner`}
            whileHover={{ scale: 1.03 }}
          >
            {/* Show loader if loading, otherwise show score */}
            {loading ? (
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            ) : (
              <span className={`text-4xl font-bold ${color}`}>{score ?? '-'}</span>
            )}
          </motion.div>

          {/* Refresh Button uses refreshScore from context */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95, rotate: 0 }}
            onClick={refreshScore} // Use context function
            disabled={loading}
            className={`p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 ease-out ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            aria-label="Refresh score"
            title="Refresh Score" // Tooltip for button
          >
            <RefreshCw size={20} className={`text-gray-500 transition-transform ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;