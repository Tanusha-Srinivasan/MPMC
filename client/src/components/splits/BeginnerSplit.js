import { motion } from 'framer-motion';
import { Calendar, Rocket, Info, ChevronDown } from 'lucide-react'; // Correct icon

const BeginnerSplit = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Theme: Red (Beginner)
  const themeColor = 'red';
  const themeAccentBg = `bg-${themeColor}-50`;
  const themeHeaderBg = `bg-${themeColor}-100`;
  const themeBorder = `border-${themeColor}-200`;
  const themeIconColor = `text-${themeColor}-600`;
  const themeHeadingColor = `text-${themeColor}-800`;
  const themeTextColor = `text-${themeColor}-700`;
  const themeSummaryHoverBg = `hover:bg-${themeColor}-200`;

  const summaryStyles = `flex items-center justify-between w-full p-4 ${themeAccentBg} rounded-lg cursor-pointer ${themeSummaryHoverBg} transition-colors group`;
  const detailsContentStyles = `p-4 pt-2 pb-4 bg-white rounded-b-lg`; // White background for content

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl shadow-card overflow-hidden border ${themeBorder}`} // Use Card style
    >
      <div className={`${themeHeaderBg} p-6 border-b ${themeBorder}`}>
        <div className="flex items-center">
          <Rocket className={`mr-3 ${themeIconColor}`} size={28} /> {/* Beginner Icon */}
          <h2 className={`text-2xl font-bold ${themeHeadingColor}`}>Beginner Full Body Split</h2>
        </div>
        <p className={`mt-2 ${themeTextColor}`}>Focus on mastering basics & building consistency (3 days/week).</p>
      </div>

      <div className="p-6 space-y-4"> {/* Reduced space-y */}
        <motion.div variants={itemVariants} className="flex items-start text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200"> {/* Use theme blue */}
          <Info size={20} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">This 3-day full-body split is great for starting out. Focus on proper form. Aim for one rest day between workouts.</p>
        </motion.div>

        {/* Workout Day Details */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Workout Day (e.g., Mon/Wed/Fri)
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
             <ul className="pl-6 mt-2 list-disc text-gray-700 text-sm space-y-1.5"> {/* Smaller text, more space */}
               <li>Squats (Goblet or Barbell): 3 sets x 8-12 reps</li>
               <li>Push-ups (or Knee Push-ups): 3 sets x AMRAP (As Many Reps As Possible)</li>
               <li>Dumbbell Rows: 3 sets x 10-15 reps per side</li>
               <li>Overhead Press (Dumbbell or Barbell): 3 sets x 8-12 reps</li>
               <li>Plank: 3 sets x 30-60 seconds hold</li>
               <li>Optional: Bicep Curls: 2 sets x 10-15 reps</li>
               <li>Optional: Tricep Extensions: 2 sets x 10-15 reps</li>
             </ul>
           </div>
        </motion.details>

        {/* Rest Day Details */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Rest Day
            </h3>
             <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
           <div className={detailsContentStyles}>
            <p className="mt-2 text-gray-700 text-sm">
              Focus on light activity like walking, stretching, or mobility work. Ensure good nutrition and sleep for recovery.
            </p>
          </div>
        </motion.details>
      </div>
    </motion.div>
  );
};

export default BeginnerSplit;