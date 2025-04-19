import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, CalendarDays, Award, ArrowLeft, Activity, ArrowRight, ScanLine } from 'lucide-react';
import ConsistencyContext from '../context/ConsistencyContext';
import Card from '../components/ui/Card';
import LoadingState from '../components/LoadingState';
import { getScoreInfo } from '../utils/helpers';

const ProfilePage = () => {
  // Destructure context, getting userData and loading state
  const { userData, loading } = useContext(ConsistencyContext);
  // Get profile and score from userData
  const { profile, score } = userData;

  // Pass the current user's score to getScoreInfo
  const { level: currentLevel, color: levelColorClass, bgColor: levelBgColorClass } = getScoreInfo(score);

  // --- Animation Variants ---
  const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
   };
   const transition = { duration: 0.4, ease: 'easeInOut' };
   const infoItemVariants = {
      hidden: { opacity: 0, x: -15 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
   };
   // --- End Animation Variants ---

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={transition}
      className="container mx-auto px-4 py-8 max-w-3xl" // Max width for better focus
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
           className="text-3xl font-bold text-gray-800 mb-8"
       >
           Your Profile
       </motion.h1>

      {/* Loading state */}
      {loading ? (
         <Card className="flex items-center justify-center min-h-[300px]">
            <LoadingState message="Loading Profile..." />
         </Card>
      ) : (
        // Check if profile exists before rendering card content
        profile ? (
            <Card>
                {/* Profile Header Section - Simplified */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 md:p-8 border-b border-gray-200 rounded-t-xl">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                           <User size={48} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Profile Details Section - Use profile, score */}
                <div className="p-6 md:p-8 space-y-5">
                     {/* RFID */}
                     <motion.div variants={infoItemVariants} initial="hidden" animate="visible" className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <ScanLine size={20} className="text-gray-500 mr-4 flex-shrink-0" />
                        <div>
                           <span className="text-sm text-gray-500 block">RFID Identifier</span>
                           <span className="text-gray-800 font-medium font-mono">{profile.rfid ?? 'N/A'}</span>
                        </div>
                    </motion.div>

                     {/* Member Since */}
                     <motion.div variants={infoItemVariants} initial="hidden" animate="visible" className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                         <CalendarDays size={20} className="text-gray-500 mr-4 flex-shrink-0" />
                         <div>
                            <span className="text-sm text-gray-500 block">Member Since</span>
                            {/* Display join date */}
                            <span className="text-gray-800 font-medium">{profile.joinDate}</span>
                         </div>
                     </motion.div>

                     {/* Current Level */}
                     <motion.div variants={infoItemVariants} initial="hidden" animate="visible" className={`flex items-center ${levelBgColorClass} p-4 rounded-lg border border-gray-200`}>
                         <Award size={20} className={`${levelColorClass} mr-4 flex-shrink-0`} />
                         <div>
                            <span className={`text-sm opacity-80 block ${levelColorClass}`}>Current Level</span>
                            <span className={`font-semibold ${levelColorClass}`}>{currentLevel}</span>
                            {/* Display score */}
                            <span className="text-xs opacity-70 ml-1"> (Score: {score ?? 'N/A'})</span>
                         </div>
                     </motion.div>

                     {/* Link to Split Page */}
                      <motion.div variants={infoItemVariants} initial="hidden" animate="visible">
                        <Link to="/split" className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg border border-indigo-200 transition-colors group">
                            <div className="flex items-center">
                                <Activity size={20} className="text-indigo-600 mr-4 flex-shrink-0" />
                                <div>
                                    <span className="text-sm text-indigo-800 block font-medium">Recommended Split</span>
                                    <span className="text-gray-600 text-xs">View your current workout plan</span>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                </div>
            </Card>
        ) : (
             // Handle case where profile data might be missing even if not loading
            <Card className="p-6 text-center">
                <p className="text-red-600">Could not load profile details.</p>
            </Card>
        )
      )}
    </motion.div>
  );
};

export default ProfilePage;