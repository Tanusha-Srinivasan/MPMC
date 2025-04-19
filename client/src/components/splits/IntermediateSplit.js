import { motion } from 'framer-motion';
import { Calendar, Zap, Info, ChevronDown } from 'lucide-react'; // Correct icon

const IntermediateSplit = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      };
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

    // Theme: Yellow (Intermediate)
    const themeColor = 'yellow';
    const themeAccentBg = `bg-${themeColor}-50`;
    const themeHeaderBg = `bg-${themeColor}-100`;
    const themeBorder = `border-${themeColor}-300`; // Slightly darker border for yellow contrast
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
                    <Zap className={`mr-3 ${themeIconColor}`} size={28} /> {/* Intermediate Icon */}
                    <h2 className={`text-2xl font-bold ${themeHeadingColor}`}>Intermediate Upper/Lower Split</h2>
                </div>
                <p className={`mt-2 ${themeTextColor}`}>Balance strength and hypertrophy with this 4-day split.</p>
            </div>

            <div className="p-6 space-y-4"> {/* Reduced space-y */}
                 <motion.div variants={itemVariants} className="flex items-start text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200"> {/* Use theme blue */}
                    <Info size={20} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">This 4-day Upper/Lower split allows more focus per session than full body. Arrange days as needed (e.g., Mon/Tue/Thu/Fri).</p>
                 </motion.div>

                 {/* Day 1 Details */}
                <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <summary className={summaryStyles}>
                    <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
                      <Calendar className="mr-2" size={18} /> Day 1 & 3: Upper Body
                    </h3>
                    <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
                  </summary>
                  <div className={detailsContentStyles}>
                    <p className="text-xs text-gray-500 mb-2 pl-6 italic">Focus: Strength on Day 1, Hypertrophy on Day 3 (vary reps/exercises)</p>
                    <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5"> {/* Smaller text, more space */}
                        <li>Bench Press (Barbell/Dumbbell): 3-4 sets x 6-12 reps</li>
                        <li>Rows (Barbell/Dumbbell/Cable): 3-4 sets x 8-15 reps</li>
                        <li>Overhead Press (Barbell/Dumbbell): 3 sets x 8-12 reps</li>
                        <li>Lat Pulldowns or Pull-ups: 3 sets x 8-15 reps</li>
                        <li>Lateral Raises: 3 sets x 12-15 reps</li>
                        <li>Bicep Curls (Variation): 3 sets x 10-15 reps</li>
                        <li>Tricep Extensions (Variation): 3 sets x 10-15 reps</li>
                    </ul>
                   </div>
                </motion.details>

                 {/* Day 2 Details */}
                <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <summary className={summaryStyles}>
                    <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
                      <Calendar className="mr-2" size={18} /> Day 2 & 4: Lower Body & Core
                    </h3>
                     <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
                  </summary>
                  <div className={detailsContentStyles}>
                     <p className="text-xs text-gray-500 mb-2 pl-6 italic">Focus: Strength on Day 2, Hypertrophy on Day 4 (vary reps/exercises)</p>
                    <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5"> {/* Smaller text, more space */}
                        <li>Squats (Back/Front/Goblet): 3-4 sets x 6-12 reps</li>
                        <li>Deadlift Variation (Romanian/Conventional): 3 sets x 6-10 reps</li>
                        <li>Leg Press or Lunges: 3 sets x 10-15 reps</li>
                        <li>Hamstring Curls: 3 sets x 12-15 reps</li>
                        <li>Leg Extensions: 3 sets x 12-15 reps</li>
                        <li>Calf Raises: 4 sets x 15-20 reps</li>
                        <li>Core Exercise (Plank/Leg Raises): 3 sets</li>
                    </ul>
                   </div>
                </motion.details>

                {/* Rest Days Details */}
                <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <summary className={summaryStyles}>
                    <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
                      <Calendar className="mr-2" size={18} /> Rest Days (3 per week)
                    </h3>
                     <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
                  </summary>
                  <div className={detailsContentStyles}>
                     <p className="mt-2 text-gray-700 text-sm">
                       Distribute rest days between workout days (e.g., Rest on Wed, Sat, Sun). Focus on active recovery, nutrition, and sleep.
                     </p>
                   </div>
                </motion.details>
            </div>
        </motion.div>
    );
};

export default IntermediateSplit;