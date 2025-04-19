import React from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "./ui/card";
import { CheckCircle, Dumbbell, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

interface WorkoutPlanProps {
  userData: any;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ userData }) => {
  if (!userData) return null;
  
  const userType = userData.user_type || "";
  const frequency = userData.frequency?.percentage || 0;
  const preferredTime = 
    userData.regularity?.time_pattern?.morning > userData.regularity?.time_pattern?.evening
      ? "morning"
      : "evening";
  
  // Generate workout plan based on user profile
  let planTitle = "";
  let planDescription = "";
  let workoutDays: string[] = [];
  let exercisesByDay: Record<string, Array<{name: string, sets: string, notes?: string}>> = {};
  
  // Determine base plan by user frequency
  if (frequency > 70) {
    // Frequent gym-goer
    planTitle = "Advanced Progressive Plan";
    planDescription = "A high-frequency program designed for consistent gym-goers focusing on progressive overload";
    
    if (userType.includes("Morning")) {
      planDescription += " with morning energy optimization";
    } else if (userType.includes("Evening")) {
      planDescription += " with evening recovery emphasis";
    }
    
    workoutDays = ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"];
  } else if (frequency > 40) {
    // Regular gym-goer
    planTitle = "Balanced Strength & Conditioning";
    planDescription = "A balanced program designed for regular gym attendance with emphasis on both strength and conditioning";
    workoutDays = ["Monday", "Wednesday", "Friday", "Saturday"];
  } else {
    // Occasional gym-goer
    planTitle = "Consistency Builder";
    planDescription = "A program designed to build consistency with full-body workouts and flexibility";
    workoutDays = ["Monday", "Thursday", "Saturday"];
  }
  
  // Sample exercise library
  const exerciseLibrary = {
    push: [
      { name: "Bench Press", baseSets: "4×8" },
      { name: "Overhead Press", baseSets: "3×10" },
      { name: "Incline Dumbbell Press", baseSets: "3×12" },
      { name: "Cable Flyes", baseSets: "3×15" },
      { name: "Tricep Pushdowns", baseSets: "3×12" }
    ],
    pull: [
      { name: "Barbell Rows", baseSets: "4×8" },
      { name: "Pull-ups", baseSets: "3×8-12" },
      { name: "Lat Pulldowns", baseSets: "3×12" },
      { name: "Face Pulls", baseSets: "3×15" },
      { name: "Bicep Curls", baseSets: "3×12" }
    ],
    legs: [
      { name: "Squats", baseSets: "4×8" },
      { name: "Romanian Deadlifts", baseSets: "3×10" },
      { name: "Leg Press", baseSets: "3×12" },
      { name: "Leg Extensions", baseSets: "3×15" },
      { name: "Calf Raises", baseSets: "3×20" }
    ],
    core: [
      { name: "Planks", baseSets: "3×30-60s" },
      { name: "Russian Twists", baseSets: "3×20" },
      { name: "Hanging Leg Raises", baseSets: "3×12" },
      { name: "Ab Rollouts", baseSets: "3×10" }
    ],
    cardio: [
      { name: "HIIT", baseSets: "15-20 min" },
      { name: "Steady State Cardio", baseSets: "20-30 min" },
      { name: "Stair Master", baseSets: "15 min" }
    ]
  };
  
  // Create workout plan based on user profile
  if (workoutDays.includes("Monday")) {
    if (frequency > 70) {
      // Advanced split
      exercisesByDay["Monday"] = [
        ...exerciseLibrary.push.slice(0, 4).map(ex => ({
          name: ex.name,
          sets: ex.baseSets,
          notes: userType.includes("Morning") ? "Focus on explosive movement" : "Focus on control"
        })),
        ...exerciseLibrary.core.slice(0, 2).map(ex => ({ name: ex.name, sets: ex.baseSets }))
      ];
      
      exercisesByDay["Tuesday"] = [
        ...exerciseLibrary.legs.slice(0, 4).map(ex => ({
          name: ex.name,
          sets: ex.baseSets
        })),
        ...exerciseLibrary.cardio.slice(0, 1).map(ex => ({ name: ex.name, sets: ex.baseSets }))
      ];
      
      exercisesByDay["Wednesday"] = [
        ...exerciseLibrary.pull.slice(0, 4).map(ex => ({ name: ex.name, sets: ex.baseSets })),
        ...exerciseLibrary.core.slice(2, 3).map(ex => ({ name: ex.name, sets: ex.baseSets }))
      ];
      
      exercisesByDay["Friday"] = [
        { name: "Bench Press", sets: "5×5", notes: "Focus on progressive overload" },
        { name: "Overhead Press", sets: "4×8" },
        { name: "Dips", sets: "3×12" },
        { name: "Lateral Raises", sets: "3×15" },
        { name: "Tricep Extensions", sets: "3×12" }
      ];
      
      exercisesByDay["Saturday"] = [
        { name: "Deadlifts", sets: "5×5", notes: "Focus on form" },
        ...exerciseLibrary.pull.slice(1, 3).map(ex => ({ name: ex.name, sets: ex.baseSets })),
        ...exerciseLibrary.cardio.slice(1, 2).map(ex => ({ name: ex.name, sets: ex.baseSets }))
      ];
    } else if (frequency > 40) {
      // Regular plan with upper/lower split
      exercisesByDay["Monday"] = [
        { name: "Bench Press", sets: "4×8" },
        { name: "Barbell Rows", sets: "4×8" },
        { name: "Overhead Press", sets: "3×10" },
        { name: "Pull-ups/Lat Pulldowns", sets: "3×10" },
        { name: "Bicep & Tricep Superset", sets: "3×12 each" }
      ];
      
      exercisesByDay["Wednesday"] = [
        { name: "Squats", sets: "4×8" },
        { name: "Romanian Deadlifts", sets: "3×10" },
        { name: "Leg Press", sets: "3×12" },
        { name: "Core Circuit", sets: "3 rounds" },
        { name: "Steady State Cardio", sets: "15-20 min" }
      ];
      
      exercisesByDay["Friday"] = [
        { name: "Incline Bench Press", sets: "4×8" },
        { name: "Cable Rows", sets: "4×10" },
        { name: "Dumbbell Shoulder Press", sets: "3×10" },
        { name: "Face Pulls", sets: "3×15" },
        { name: "Arms & Core Superset", sets: "3 rounds" }
      ];
      
      exercisesByDay["Saturday"] = [
        { name: "Deadlifts", sets: "4×6" },
        { name: "Front Squats", sets: "3×8" },
        { name: "Walking Lunges", sets: "3×10 each" },
        { name: "Calf Raises", sets: "4×15" },
        { name: "HIIT Session", sets: "15 min" }
      ];
    } else {
      // Beginner full body plan
      exercisesByDay["Monday"] = [
        { name: "Full Body Circuit", sets: "3 rounds", notes: "Focus on form and technique" },
        { name: "Squats", sets: "3×10" },
        { name: "Bench Press", sets: "3×10" },
        { name: "Rows", sets: "3×10" },
        { name: "Core Work", sets: "2×15" }
      ];
      
      exercisesByDay["Thursday"] = [
        { name: "Deadlift", sets: "3×8", notes: "Light weight, perfect form" },
        { name: "Push-ups/Chest Press", sets: "3×12" },
        { name: "Lat Pulldowns", sets: "3×12" },
        { name: "Lunges", sets: "3×10 each" },
        { name: "Cardio", sets: "10-15 min" }
      ];
      
      exercisesByDay["Saturday"] = [
        { name: "Full Body Machine Circuit", sets: "3 rounds" },
        { name: "Machine Leg Press", sets: "3×12" },
        { name: "Machine Chest Press", sets: "3×12" },
        { name: "Seated Cable Row", sets: "3×12" },
        { name: "Core Work", sets: "2×15" }
      ];
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-indigo-600" />
                {planTitle}
              </CardTitle>
              <CardDescription className="mt-2">{planDescription}</CardDescription>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-indigo-700 bg-indigo-50">
              {userType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(exercisesByDay).map((day) => (
              <div key={day} className="border-t pt-4 first:border-0 first:pt-0">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {day}
                </h3>
                <div className="space-y-3">
                  {exercisesByDay[day].map((exercise, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium">{exercise.name} <span className="text-gray-500 font-normal">{exercise.sets}</span></div>
                        {exercise.notes && <div className="text-sm text-gray-600">{exercise.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutPlan;