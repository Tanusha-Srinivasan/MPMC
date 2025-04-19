import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Info, Calendar, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConsistencyContext from '../context/ConsistencyContext'; 
import LoadingState from '../components/LoadingState';
import Card from '../components/ui/Card';

const SplitPage = () => {
  // Destructure context, getting userData and loading state
  const { userData, loading } = useContext(ConsistencyContext);
  
  // Get all relevant data from userData
  const { 
    score, 
    userType, 
    frequency, 
    regularity, 
    recency 
  } = userData;

  // --- Animation Variants ---
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };
  const transition = { duration: 0.4, ease: 'easeInOut' };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  // --- End Animation Variants ---

  // Determine theme based on score
  const getTheme = () => {
    if (score >= 80) {
      return {
        headerBg: 'bg-green-50',
        border: 'border-green-200',
        accentBg: 'bg-green-50',
        iconColor: 'text-green-600',
        headingColor: 'text-gray-800',
        textColor: 'text-gray-600',
        summaryHoverBg: 'hover:bg-green-100'
      };
    } else if (score >= 40) {
      return {
        headerBg: 'bg-blue-50',
        border: 'border-blue-200',
        accentBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        headingColor: 'text-gray-800',
        textColor: 'text-gray-600',
        summaryHoverBg: 'hover:bg-blue-100'
      };
    } else {
      return {
        headerBg: 'bg-amber-50',
        border: 'border-amber-200',
        accentBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        headingColor: 'text-gray-800',
        textColor: 'text-gray-600',
        summaryHoverBg: 'hover:bg-amber-100'
      };
    }
  };

  // Determine workout frequency based on regularity and score
  const getIdealWorkoutDays = () => {
    if (score >= 80) return 5;  // More advanced users can handle 5-6 workouts
    if (score >= 60) return 4;  // Consistent intermediate users: 4 days
    if (score >= 40) return 3;  // Beginning intermediate users: 3 days
    return 2;  // Beginners: 2-3 days
  };

  // Analyze time pattern to recommend workout times
  const getRecommendedTime = () => {
    if (!regularity || !regularity.time_pattern) return "morning";
    
    const { morning = 0, afternoon = 0, evening = 0 } = regularity.time_pattern;
    if (morning > afternoon && morning > evening) return "morning";
    if (evening > morning && evening > afternoon) return "evening";
    return "afternoon"; 
  };

  // Analyze day pattern to recommend workout days
  const getRecommendedDays = () => {
    if (!regularity || !regularity.day_pattern) {
      return ["Monday", "Wednesday", "Friday"]; // Default
    }

    // Get days sorted by frequency
    const dayPattern = regularity.day_pattern;
    const sortedDays = Object.entries(dayPattern)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    const workoutDays = getIdealWorkoutDays();
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    // If we can't get enough days from their pattern, use most frequent plus defaults
    if (sortedDays.length < workoutDays) {
      const recommendedDays = [...sortedDays];
      for (const day of weekdays) {
        if (!recommendedDays.includes(day)) {
          recommendedDays.push(day);
          if (recommendedDays.length === workoutDays) break;
        }
      }
      return recommendedDays;
    }
    
    // Return their top most frequent days
    return sortedDays.slice(0, workoutDays);
  };

  // Generate dynamic workout split based on user data
  const renderDynamicWorkoutSplit = () => {
    if (!score && score !== 0) {
      return (
        <Card className="p-6 text-center">
          <p className="text-orange-600">Workout split information is currently unavailable.</p>
        </Card>
      );
    }
    
    const theme = getTheme();
    const workoutDays = getIdealWorkoutDays();
    const recommendedTime = getRecommendedTime();
    const recommendedDays = getRecommendedDays();
    const summaryStyles = `flex items-center justify-between w-full p-4 ${theme.accentBg} rounded-lg cursor-pointer ${theme.summaryHoverBg} transition-colors group`;
    const detailsContentStyles = `p-4 pt-2 pb-4 bg-white rounded-b-lg`;
    
    // Determine split type based on score and regularity
    let splitType, splitDescription;
    
    if (score >= 80) {
      splitType = "Advanced Split";
      splitDescription = workoutDays >= 5 
        ? "Push/Pull/Legs split for optimal muscle growth" 
        : "Upper/Lower body split with high intensity";
    } else if (score >= 40) {
      splitType = "Intermediate Split";
      splitDescription = workoutDays >= 4 
        ? "Upper/Lower split focusing on strength and hypertrophy" 
        : "3-day full body with progressive overload";
    } else {
      splitType = "Beginner-Friendly Split";
      splitDescription = "Full body workouts focusing on form and consistency";
    }
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`bg-white rounded-xl shadow-card overflow-hidden border ${theme.border}`}
      >
        <div className={`${theme.headerBg} p-6 border-b ${theme.border}`}>
          <div className="flex items-center">
            <Activity className={`mr-3 ${theme.iconColor}`} size={28} />
            <h2 className={`text-2xl font-bold ${theme.headingColor}`}>
              {userType ? `${userType} - ${splitType}` : splitType}
            </h2>
          </div>
          <p className={`mt-2 ${theme.textColor}`}>{splitDescription}</p>
        </div>

        <div className="p-6 space-y-4">
          <motion.div variants={itemVariants} className={`flex items-start text-gray-700 ${theme.accentBg} p-4 rounded-lg border ${theme.border}`}>
            <Info size={20} className={`mr-3 ${theme.iconColor} mt-0.5 flex-shrink-0`} />
            <div>
              <p className="text-sm mb-2">
                Based on your consistency score of <span className="font-semibold">{score}</span> and activity patterns, 
                we recommend training <span className="font-semibold">{workoutDays} days/week</span> during 
                the <span className="font-semibold">{recommendedTime}</span>.
              </p>
              <p className="text-sm">
                Your most consistent days are: <span className="font-semibold">{recommendedDays.join(", ")}</span>
              </p>
            </div>
          </motion.div>

          {/* Generate workout days based on user's score */}
          {generateWorkoutDetails(score, recommendedDays, workoutDays, theme, itemVariants, summaryStyles, detailsContentStyles)}
        </div>
      </motion.div>
    );
  };

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
        <Activity className="mr-3 text-indigo-600" size={30}/>
        Your Personalized Workout Plan
      </motion.h1>

      {/* Loading State or Split */}
      {loading ? (
        <Card className="flex items-center justify-center min-h-[400px]">
          <LoadingState message="Creating Your Workout Plan..." />
        </Card>
      ) : (
        renderDynamicWorkoutSplit()
      )}
    </motion.div>
  );
};

// Helper function to generate workout details based on user score
function generateWorkoutDetails(score, recommendedDays, workoutDays, theme, itemVariants, summaryStyles, detailsContentStyles) {
  // Default exercises by category
  const exercises = {
    push: {
      beginner: [
        "Push-ups: 3 sets x 8-12 reps",
        "Dumbbell Shoulder Press: 3 sets x 10-12 reps",
        "Incline Dumbbell Press: 3 sets x 10-12 reps", 
        "Tricep Dips (assisted if needed): 3 sets x 8-12 reps"
      ],
      intermediate: [
        "Bench Press: 4 sets x 8-10 reps",
        "Incline Dumbbell Press: 3 sets x 10-12 reps",
        "Overhead Press: 3 sets x 8-10 reps",
        "Lateral Raises: 3 sets x 12-15 reps",
        "Tricep Pushdowns: 3 sets x 12-15 reps"
      ],
      advanced: [
        "Barbell Bench Press: 4 sets x 6-8 reps",
        "Incline Dumbbell Press: 4 sets x 8-10 reps",
        "Overhead Press: 3 sets x 8-10 reps",
        "Cable Flyes: 3 sets x 12-15 reps",
        "Skull Crushers: 3 sets x 10-12 reps",
        "Lateral Raises: 4 sets x 12-15 reps"
      ]
    },
    pull: {
      beginner: [
        "Dumbbell Rows: 3 sets x 10-12 reps",
        "Lat Pulldowns: 3 sets x 10-12 reps",
        "Face Pulls: 3 sets x 12-15 reps",
        "Bicep Curls: 3 sets x 10-12 reps"
      ],
      intermediate: [
        "Pull-ups (assisted if needed): 3 sets x 6-10 reps",
        "Barbell Rows: 3 sets x 8-10 reps",
        "Seated Cable Rows: 3 sets x 10-12 reps",
        "Face Pulls: 3 sets x 15-20 reps",
        "Bicep Curls: 3 sets x 10-12 reps"
      ],
      advanced: [
        "Weighted Pull-ups: 4 sets x 6-8 reps",
        "Barbell Rows: 4 sets x 6-10 reps",
        "Deadlifts: 4 sets x 5-8 reps",
        "Cable Rows: 3 sets x 10-12 reps",
        "Barbell Curls: 4 sets x 8-10 reps",
        "Hammer Curls: 3 sets x 10-12 reps"
      ]
    },
    legs: {
      beginner: [
        "Goblet Squats: 3 sets x 10-12 reps",
        "Romanian Deadlifts: 3 sets x 10-12 reps",
        "Leg Press: 3 sets x 12-15 reps",
        "Calf Raises: 3 sets x 15-20 reps"
      ],
      intermediate: [
        "Barbell Squats: 4 sets x 8-10 reps",
        "Romanian Deadlifts: 3 sets x 8-10 reps",
        "Walking Lunges: 3 sets x 10 reps per leg",
        "Leg Extensions: 3 sets x 12-15 reps",
        "Leg Curls: 3 sets x 12-15 reps",
        "Calf Raises: 4 sets x 15-20 reps"
      ],
      advanced: [
        "Back Squats: 5 sets x 5-8 reps",
        "Romanian Deadlifts: 4 sets x 8-10 reps",
        "Leg Press: 4 sets x 10-12 reps",
        "Walking Lunges: 3 sets x 12 reps per leg",
        "Leg Extensions: 3 sets x 12-15 reps",
        "Leg Curls: 3 sets x 12-15 reps",
        "Standing Calf Raises: 5 sets x 15-20 reps"
      ]
    },
    fullBody: {
      beginner: [
        "Goblet Squats: 3 sets x 10-12 reps",
        "Push-ups (or knee push-ups): 3 sets x 8-12 reps",
        "Dumbbell Rows: 3 sets x 10-12 reps per arm",
        "Dumbbell Shoulder Press: 3 sets x 10-12 reps",
        "Plank: 3 sets x 30-45 seconds"
      ],
      intermediate: [
        "Barbell Squats: 3 sets x 8-10 reps",
        "Bench Press: 3 sets x 8-10 reps",
        "Bent-Over Rows: 3 sets x 8-10 reps", 
        "Overhead Press: 3 sets x 8-10 reps",
        "Romanian Deadlifts: 3 sets x 8-10 reps",
        "Bicep Curls: 3 sets x 10-12 reps",
        "Tricep Extensions: 3 sets x 10-12 reps"
      ]
    },
    upperLower: {
      intermediate: {
        upper: [
          "Bench Press: 3 sets x 6-10 reps",
          "Barbell Rows: 3 sets x 8-10 reps",
          "Overhead Press: 3 sets x 8-10 reps",
          "Lat Pulldowns: 3 sets x 10-12 reps",
          "Incline Dumbbell Press: 3 sets x 10-12 reps",
          "Bicep Curls: 3 sets x 10-12 reps",
          "Tricep Pushdowns: 3 sets x 10-12 reps"
        ],
        lower: [
          "Barbell Squats: 3 sets x 6-10 reps",
          "Romanian Deadlifts: 3 sets x 8-10 reps",
          "Leg Press: 3 sets x 10-12 reps",
          "Walking Lunges: 3 sets x 10 reps per leg",
          "Leg Extensions: 3 sets x 12-15 reps",
          "Leg Curls: 3 sets x 12-15 reps",
          "Calf Raises: 4 sets x 15-20 reps",
          "Planks: 3 sets x 45-60 seconds"
        ]
      },
      advanced: {
        upper: [
          "Bench Press: 4 sets x 6-8 reps",
          "Weighted Pull-ups: 4 sets x 6-8 reps",
          "Overhead Press: 4 sets x 6-8 reps",
          "Barbell Rows: 4 sets x 6-8 reps",
          "Incline Dumbbell Press: 3 sets x 8-10 reps",
          "Lateral Raises: 3 sets x 12-15 reps",
          "Skull Crushers: 3 sets x 10-12 reps",
          "Barbell Curls: 3 sets x 10-12 reps"
        ],
        lower: [
          "Barbell Squats: 5 sets x 5-8 reps",
          "Romanian Deadlifts: 4 sets x 6-8 reps",
          "Leg Press: 4 sets x 8-10 reps",
          "Bulgarian Split Squats: 3 sets x 8-10 reps per leg",
          "Leg Extensions: 3 sets x 12-15 reps",
          "Leg Curls: 3 sets x 12-15 reps",
          "Standing Calf Raises: 4 sets x 15-20 reps",
          "Hanging Leg Raises: 3 sets x 12-15 reps"
        ]
      }
    }
  };

  // Sort workout days to match recommended days if possible
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Get appropriate category of difficulty
  let difficulty;
  if (score >= 80) {
    difficulty = "advanced";
  } else if (score >= 40) {
    difficulty = "intermediate";
  } else {
    difficulty = "beginner";
  }

  // Generate workout details based on score and frequency
  const workoutDetails = [];
  
  // For beginners (score < 40): Full body workouts 2-3x per week
  if (score < 40) {
    const workoutDays = recommendedDays.slice(0, Math.min(3, recommendedDays.length));
    
    // Create full body workouts for each day
    workoutDays.forEach((day, index) => {
      workoutDetails.push(
        <motion.details key={`workout-${index}`} variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <summary className={summaryStyles}>
            <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
              <Calendar className="mr-2" size={18} /> {day}: Full Body Workout
            </h3>
            <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
          </summary>
          <div className={detailsContentStyles}>
            <p className="text-xs text-gray-500 mb-2 pl-6 italic">
              Focus on proper form and build consistency
            </p>
            <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5">
              {exercises.fullBody.beginner.map((exercise, i) => (
                <li key={i}>{exercise}</li>
              ))}
            </ul>
          </div>
        </motion.details>
      );
    });
    
    // Add rest days guidance
    workoutDetails.push(
      <motion.details key="rest-days" variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <summary className={summaryStyles}>
          <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
            <Calendar className="mr-2" size={18} /> Rest Days
          </h3>
          <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
        </summary>
        <div className={detailsContentStyles}>
          <p className="mt-2 text-gray-700 text-sm">
            Rest on all non-workout days. Focus on light activity like walking or stretching. 
            Ensure adequate nutrition and sleep for recovery.
          </p>
        </div>
      </motion.details>
    );
  } 
  // For intermediates (score 40-79): Upper/Lower split (or 3-day full body for lower scores)
  else if (score >= 40 && score < 80) {
    if (workoutDays >= 4) {
      // Upper/Lower split for 4+ days
      const actualWorkoutDays = recommendedDays.slice(0, Math.min(4, recommendedDays.length));
      
      actualWorkoutDays.forEach((day, index) => {
        const isUpper = index % 2 === 0;
        workoutDetails.push(
          <motion.details key={`workout-${index}`} variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <summary className={summaryStyles}>
              <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
                <Calendar className="mr-2" size={18} /> {day}: {isUpper ? 'Upper Body' : 'Lower Body'}
              </h3>
              <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
            </summary>
            <div className={detailsContentStyles}>
              <p className="text-xs text-gray-500 mb-2 pl-6 italic">
                Focus on {index < 2 ? 'strength (heavier weights, lower reps)' : 'hypertrophy (moderate weights, higher reps)'}
              </p>
              <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5">
                {isUpper 
                  ? exercises.upperLower.intermediate.upper.map((ex, i) => <li key={i}>{ex}</li>)
                  : exercises.upperLower.intermediate.lower.map((ex, i) => <li key={i}>{ex}</li>)
                }
              </ul>
            </div>
          </motion.details>
        );
      });
    } else {
      // 3-day full body for lower workout frequency
      const actualWorkoutDays = recommendedDays.slice(0, Math.min(3, recommendedDays.length));
      
      actualWorkoutDays.forEach((day, index) => {
        workoutDetails.push(
          <motion.details key={`workout-${index}`} variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <summary className={summaryStyles}>
              <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
                <Calendar className="mr-2" size={18} /> {day}: Full Body Workout
              </h3>
              <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
            </summary>
            <div className={detailsContentStyles}>
              <p className="text-xs text-gray-500 mb-2 pl-6 italic">
                Focus on progressive overload and compound movements
              </p>
              <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5">
                {exercises.fullBody.intermediate.map((exercise, i) => (
                  <li key={i}>{exercise}</li>
                ))}
              </ul>
            </div>
          </motion.details>
        );
      });
    }
    
    // Add rest days guidance
    workoutDetails.push(
      <motion.details key="rest-days" variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <summary className={summaryStyles}>
          <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
            <Calendar className="mr-2" size={18} /> Rest Days
          </h3>
          <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
        </summary>
        <div className={detailsContentStyles}>
          <p className="mt-2 text-gray-700 text-sm">
            Rest on non-workout days. Consider active recovery (light cardio) on 1-2 rest days.
            Focus on adequate protein intake and quality sleep for optimal recovery.
          </p>
        </div>
      </motion.details>
    );
  } 
  // For advanced (score 80+): PPL split for 6 days or Upper/Lower for 4-5 days
  else {
    if (workoutDays >= 5) {
      // PPL Split
      const workoutTypes = ["Push", "Pull", "Legs", "Push", "Pull", "Legs"];
      const actualWorkoutDays = recommendedDays.slice(0, Math.min(6, recommendedDays.length));
      
      actualWorkoutDays.forEach((day, index) => {
        const workoutType = workoutTypes[index % workoutTypes.length].toLowerCase();
        workoutDetails.push(
          <motion.details key={`workout-${index}`} variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <summary className={summaryStyles}>
              <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
                <Calendar className="mr-2" size={18} /> {day}: {workoutTypes[index % workoutTypes.length]}
              </h3>
              <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
            </summary>
            <div className={detailsContentStyles}>
              <p className="text-xs text-gray-500 mb-2 pl-6 italic">
                {index < 3 ? 'Focus: Strength (heavier weights)' : 'Focus: Hypertrophy (pump focus)'}
              </p>
              <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5">
                {exercises[workoutType].advanced.map((exercise, i) => (
                  <li key={i}>{exercise}</li>
                ))}
              </ul>
            </div>
          </motion.details>
        );
      });
    } else {
      // Upper/Lower split for 4 days
      const workoutTypes = ["Upper", "Lower", "Upper", "Lower"];
      const actualWorkoutDays = recommendedDays.slice(0, Math.min(4, recommendedDays.length));
      
      actualWorkoutDays.forEach((day, index) => {
        const isUpper = index % 2 === 0;
        workoutDetails.push(
          <motion.details key={`workout-${index}`} variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <summary className={summaryStyles}>
              <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
                <Calendar className="mr-2" size={18} /> {day}: {isUpper ? 'Upper Body' : 'Lower Body'}
              </h3>
              <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
            </summary>
            <div className={detailsContentStyles}>
              <p className="text-xs text-gray-500 mb-2 pl-6 italic">
                Focus on {index < 2 ? 'strength-building' : 'volume and hypertrophy'}
              </p>
              <ul className="pl-6 mt-1 list-disc text-gray-700 text-sm space-y-1.5">
                {isUpper 
                  ? exercises.upperLower.advanced.upper.map((ex, i) => <li key={i}>{ex}</li>)
                  : exercises.upperLower.advanced.lower.map((ex, i) => <li key={i}>{ex}</li>)
                }
              </ul>
            </div>
          </motion.details>
        );
      });
    }
    
    // Add rest day guidance
    workoutDetails.push(
      <motion.details key="rest-days" variants={itemVariants} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <summary className={summaryStyles}>
          <h3 className={`flex items-center text-lg font-semibold ${theme.headingColor}`}>
            <Calendar className="mr-2" size={18} /> Rest & Recovery
          </h3>
          <ChevronDown className={`${theme.iconColor} group-open:rotate-180 transition-transform duration-300`} size={20} />
        </summary>
        <div className={detailsContentStyles}>
          <p className="mt-2 text-gray-700 text-sm">
            Dedicated rest days are crucial even for advanced lifters. Prioritize protein intake (1.6-2g/kg bodyweight), 
            quality sleep (7-9 hours), and consider active recovery like mobility work, light cardio, or yoga on rest days.
          </p>
        </div>
      </motion.details>
    );
  }
  
  return workoutDetails;
}

export default SplitPage;