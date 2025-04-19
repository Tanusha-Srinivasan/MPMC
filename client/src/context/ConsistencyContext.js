import { createContext } from 'react';

// Initial state for user data
export const initialUserState = {
  profile: {
    rfid: "",
    name: "",
    email: "",
    joinDate: ""
  },
  score: 0,
  scoreHistory: [],
  insights: [],
  userType: "",
  workoutPlan: null
};

// Create context with initial shape and methods
const ConsistencyContext = createContext({
  userData: initialUserState,
  loading: false,
  isLoggedIn: false,
  loginUser: () => {},
  logoutUser: () => {},
  refreshScore: () => {}
});

export default ConsistencyContext;