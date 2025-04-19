import { motion } from 'framer-motion';
import { Calendar, Star, Info, ChevronDown } from 'lucide-react';

const AdvancedSplit = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } } // Faster stagger
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 }, // Slightly less y offset
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut'} }
  };

  // Theme: Green (Advanced)
  const themeColor = 'green';
  const themeAccentBg = `bg-${themeColor}-50`;
  const themeHeaderBg = `bg-${themeColor}-100`;
  const themeBorder = `border-${themeColor}-200`;
  const themeIconColor = `text-${themeColor}-600`;
  const themeHeadingColor = `text-${themeColor}-800`;
  const themeTextColor = `text-${themeColor}-700`;
  const themeSummaryHoverBg = `hover:bg-${themeColor}-200`;

  const summaryStyles = `flex items-center justify-between w-full p-4 ${themeAccentBg} rounded-lg cursor-pointer ${themeSummaryHoverBg} transition-colors group`;
  const detailsContentStyles = `p-4 pt-2 pb-4 bg-white rounded-b-lg`; // White background for content
  const listStyles = "pl-6 mt-2 list-disc text-gray-700 text-sm space-y-1.5"; // Consistent list style

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl shadow-card overflow-hidden border ${themeBorder}`}
    >
      {/* Header Section */}
      <div className={`${themeHeaderBg} p-6 border-b ${themeBorder}`}>
        <div className="flex items-center">
          <Star className={`mr-3 ${themeIconColor}`} size={28} />
          <h2 className={`text-2xl font-bold ${themeHeadingColor}`}>Advanced PPL Split</h2>
        </div>
        <p className={`mt-2 ${themeTextColor}`}>Ideal for dedicated lifters with excellent consistency.</p>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Info Box */}
        <motion.div variants={itemVariants} className="flex items-start text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Info size={20} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">This 6-day Push/Pull/Legs (PPL) split maximizes muscle growth through targeted volume and frequency. Ensure adequate nutrition and sleep for recovery.</p>
        </motion.div>

        {/* Day 1: Push */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 1: Push (Chest/Shoulders/Triceps)
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
             <ul className={listStyles}>
               <li>Barbell Bench Press: 4 sets x 6-8 reps</li>
               <li>Incline Dumbbell Press: 4 sets x 8-10 reps</li>
               <li>Overhead Press: 3 sets x 8-10 reps</li>
               <li>Lateral Raises: 4 sets x 12-15 reps</li>
               <li>Tricep Dips: 3 sets x 8-12 reps</li>
               <li>Cable Tricep Extensions: 3 sets x 12-15 reps</li>
               <li>Chest Flyes: 3 sets x 12-15 reps</li>
             </ul>
           </div>
        </motion.details>

        {/* Day 2: Pull */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 2: Pull (Back/Biceps)
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <ul className={listStyles}>
              <li>Deadlifts: 4 sets x 5-8 reps</li>
              <li>Weighted Pull-ups: 4 sets x 6-10 reps</li>
              <li>Barbell Rows: 4 sets x 8-10 reps</li>
              <li>Cable Rows: 3 sets x 10-12 reps</li>
              <li>Face Pulls: 3 sets x 15-20 reps</li>
              <li>Barbell Curls: 4 sets x 8-12 reps</li>
              <li>Hammer Curls: 3 sets x 10-12 reps</li>
              <li>Rear Delt Flyes: 3 sets x 12-15 reps</li>
            </ul>
          </div>
        </motion.details>

        {/* Day 3: Legs */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 3: Legs
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <ul className={listStyles}>
              <li>Back Squats: 5 sets x 5-8 reps</li>
              <li>Romanian Deadlifts: 4 sets x 8-10 reps</li>
              <li>Leg Press: 4 sets x 10-12 reps</li>
              <li>Walking Lunges: 3 sets x 12 reps per leg</li>
              <li>Leg Extensions: 3 sets x 12-15 reps</li>
              <li>Leg Curls: 3 sets x 12-15 reps</li>
              <li>Standing Calf Raises: 5 sets x 15-20 reps</li>
              <li>Weighted Decline Sit-ups: 3 sets x 15-20 reps</li> {/* Assuming this was intended for core */}
            </ul>
          </div>
        </motion.details>

        {/* Day 4: Push */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 4: Push (Chest/Shoulders/Triceps)
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <ul className={listStyles}>
              <li>Incline Barbell Bench: 4 sets x 6-8 reps</li>
              <li>Flat Dumbbell Press: 4 sets x 8-10 reps</li>
              <li>Seated Dumbbell Press: 3 sets x 8-10 reps</li>
              <li>Cable Lateral Raises: 4 sets x 12-15 reps</li>
              <li>Close Grip Bench Press: 3 sets x 8-12 reps</li>
              <li>Overhead Tricep Extension: 3 sets x 12-15 reps</li>
              <li>Machine Chest Press: 3 sets x 12-15 reps</li>
            </ul>
          </div>
        </motion.details>

        {/* Day 5: Pull */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 5: Pull (Back/Biceps)
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <ul className={listStyles}>
              <li>Barbell Rows: 4 sets x 6-8 reps</li>
              <li>Pull-ups (Weighted if possible): 4 sets x 8-12 reps</li>
              <li>Single Arm Dumbbell Rows: 3 sets x 10-12 reps per arm</li>
              <li>Lat Pulldowns: 3 sets x 10-12 reps</li>
              <li>Cable Pullovers: 3 sets x 12-15 reps</li>
              <li>Incline Dumbbell Curls: 3 sets x 10-12 reps</li>
              <li>Preacher Curls: 3 sets x 10-12 reps</li>
              <li>Shrugs: 4 sets x 12-15 reps</li>
            </ul>
          </div>
        </motion.details>

        {/* Day 6: Legs */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
              <Calendar className="mr-2" size={18} /> Day 6: Legs
            </h3>
            <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <ul className={listStyles}>
              <li>Front Squats: 4 sets x 6-8 reps</li>
              <li>Hack Squats: 4 sets x 8-10 reps</li>
              <li>Bulgarian Split Squats: 3 sets x 10-12 reps per leg</li>
              <li>Leg Press (Narrow Stance): 4 sets x 12-15 reps</li>
              <li>Lying Leg Curls: 4 sets x 10-12 reps</li>
              <li>Seated Calf Raises: 4 sets x 15-20 reps</li>
              <li>Hanging Leg Raises: 3 sets x 15-20 reps</li> {/* Core exercise */}
            </ul>
          </div>
        </motion.details>

        {/* Day 7: Rest */}
        <motion.details variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
           <summary className={summaryStyles}>
             <h3 className={`flex items-center text-lg font-semibold ${themeHeadingColor}`}>
               <Calendar className="mr-2" size={18} /> Day 7: Rest & Recovery
             </h3>
             <ChevronDown className={`${themeIconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
           </summary>
           <div className={detailsContentStyles}>
             <p className="mt-2 text-gray-700 text-sm">
               Complete rest day. Focus on sleep, nutrition, and active recovery (light walk, stretching) to prepare for the next week. Listen to your body.
             </p>
           </div>
        </motion.details>

      </div>
    </motion.div>
  );
};

export default AdvancedSplit;