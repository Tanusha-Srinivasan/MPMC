import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ConsistencyContext, { initialUserState } from './context/ConsistencyContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import SplitPage from './pages/SplitPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing'; // Import the new Landing page

// Backend API URL
const API_URL = 'http://localhost:8000';

// Helper function to format date for chart/history
const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// Create mock profile data with IDs from your actual dataset
const mockProfiles = {
  "AA6A06B0": { 
    rfid: "AA6A06B0", 
    name: "Alex Johnson", 
    joinDate: 'Jan 10, 2025' 
  },
  "B7D8A621": { 
    rfid: "B7D8A621", 
    name: "Jamie Smith", 
    joinDate: 'Feb 15, 2025' 
  },
  "76A2D0BE": { 
    rfid: "76A2D0BE", 
    name: "Casey Williams", 
    joinDate: 'Mar 5, 2025' 
  },
  "23FF6AAD": { 
    rfid: "23FF6AAD", 
    name: "Taylor Rodriguez", 
    joinDate: 'Mar 22, 2025' 
  },
  "9F83C475": { 
    rfid: "9F83C475", 
    name: "Morgan Lee", 
    joinDate: 'Jan 8, 2025' 
  },
  "5F9E2C14": { 
    rfid: "5F9E2C14", 
    name: "Jordan Patel", 
    joinDate: 'Feb 3, 2025' 
  },
  "3C41E9F5": { 
    rfid: "3C41E9F5", 
    name: "Riley Carter", 
    joinDate: 'Jan 12, 2025' 
  },
  "12E5B94D": { 
    rfid: "12E5B94D", 
    name: "Avery Wilson", 
    joinDate: 'Jan 4, 2025' 
  }
};

function App() {
  const [userData, setUserData] = useState(initialUserState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch user data from the Flask backend
  const fetchUserData = async (rfid, isRefresh = false) => {
    console.log(isRefresh ? `Refreshing data for ${rfid}...` : `Fetching initial data for ${rfid}...`);
    if (!isRefresh) setLoading(true);

    try {
      // Call the actual Flask backend API
      const response = await fetch(`${API_URL}/gym/v1/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: rfid }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      // Get additional insights if available
      let insights = data.insights || [];
      let recommendations = [];

      try {
        const insightResponse = await fetch(`${API_URL}/gym/v1/users/${rfid}/insights`);
        if (insightResponse.ok) {
          const insightData = await insightResponse.json();
          if (insightData.recommendations) {
            recommendations = insightData.recommendations;
          }
        }
      } catch (error) {
        console.warn("Could not fetch additional insights:", error);
      }

      // Create history entries from frequency data
      // In a real app, you'd store history in the database
      const scoreHistory = [];
      
      // If we have history, use it, otherwise create mock history
      if (data.history) {
        scoreHistory.push(...data.history);
      } else {
        // Generate mock history based on current score
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Create some variation in the score
          const baseScore = Math.max(20, data.score - 15);
          const scoreVariation = Math.min(100, data.score + 5) - baseScore;
          const progression = (30 - i) / 30; // 0 to 1 progression factor
          
          let entryScore = Math.round(baseScore + scoreVariation * progression);
          // Add some randomness to make the graph look more natural
          entryScore = Math.max(10, Math.min(100, entryScore + (Math.random() * 10 - 5)));
          
          scoreHistory.push({
            date: formatDate(date),
            timestamp: date.getTime(),
            score: entryScore
          });
        }
      }
      
      // Use mock profile data until backend provides it
      const profile = mockProfiles[rfid] || { 
        rfid, 
        name: `User ${rfid.substring(0, 5)}`,
        email: `user${rfid.substring(0, 3)}@gymbuddy.com`,
        joinDate: formatDate(new Date())
      };

      // Set the consolidated user data
      setUserData({
        profile,
        score: data.score,
        scoreHistory,
        insights,
        recommendations,
        frequency: data.frequency,
        regularity: data.regularity,
        recency: data.recency,
        userType: data.user_type
      });

      setIsLoggedIn(true);
      return true;

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Use demo data in case of error
      if (!isRefresh && rfid === "AA6A06B0") {
        // Use loadDemoData function instead of calling useDemoData directly
        return loadDemoData(rfid);
      }
      
      setUserData(initialUserState);
      setIsLoggedIn(false);
      return false;
    } finally {
      setLoading(false);
      console.log('Data fetch complete.');
    }
  };

  // Function to use demo data when API fails (renamed from useDemoData to loadDemoData)
  const loadDemoData = (rfid) => {
    const demoData = {
      score: 66,
      user_type: "Frequent Morning Weekday",
      insights: [
        "You maintain a somewhat consistent gym schedule.",
        "You're an early bird! Morning workouts help boost metabolism all day."
      ],
      frequency: {
        days_visited: 91,
        total_days: 109,
        percentage: 83.5,
        score: 33
      },
      regularity: {
        distinct_days: 7,
        avg_gap_between_visits: 1.2,
        consistency_metric: 68.9,
        score: 29,
        day_pattern: {
          Monday: 16,
          Tuesday: 16,
          Wednesday: 14,
          Thursday: 13,
          Friday: 16,
          Saturday: 17,
          Sunday: 8
        },
        time_pattern: {
          morning: 74,
          afternoon: 22,
          evening: 4
        }
      },
      recency: {
        days_since_last_visit: 0,
        score: 30
      }
    };

    // Generate history based on demo data
    const scoreHistory = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create some variation in the score
      const baseScore = 50;
      const progression = (30 - i) / 30; // 0 to 1 progression factor
      
      let entryScore = Math.round(baseScore + (demoData.score - baseScore) * progression);
      // Add some randomness to make the graph look more natural
      entryScore = Math.max(10, Math.min(100, entryScore + (Math.random() * 10 - 5)));
      
      scoreHistory.push({
        date: formatDate(date),
        timestamp: date.getTime(),
        score: entryScore
      });
    }

    const profile = mockProfiles[rfid] || { 
      rfid, 
      name: `User ${rfid.substring(0, 5)}`,
      email: `user${rfid.substring(0, 3)}@gymbuddy.com`,
      joinDate: formatDate(new Date())
    };

    setUserData({
      profile,
      score: demoData.score,
      scoreHistory,
      insights: demoData.insights,
      recommendations: [
        "Try setting a goal to visit the gym at least 3-4 times per week",
        "Consider joining our early bird group classes",
        "Adding a weekend workout could help improve your results"
      ],
      frequency: demoData.frequency,
      regularity: demoData.regularity,
      recency: demoData.recency,
      userType: demoData.user_type
    });

    setIsLoggedIn(true);
    return true;
  };

  // Login function passed to context
  const loginUser = async (rfid) => {
     const success = await fetchUserData(rfid, false);
     return success;
  };

  // Logout function passed to context
  const logoutUser = () => {
    console.log("Logging out...");
    setUserData(initialUserState);
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Refresh function to update score data
  const refreshScoreData = async () => {
    if (userData.profile.rfid) {
      await fetchUserData(userData.profile.rfid, true);
    } else {
      console.warn("Cannot refresh score, no user logged in.");
    }
  };

  // Train models function (admin feature)
  const trainModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/gym/v1/train-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Model training response:', data);
      return data;
    } catch (error) {
      console.error("Failed to train models:", error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    userData,
    loading,
    isLoggedIn,
    loginUser,
    logoutUser,
    refreshScore: refreshScoreData,
    trainModels
  };

  // Determine if header/footer should be shown
  const showLayout = location.pathname !== '/login' && location.pathname !== '/landing';

  return (
    <ConsistencyContext.Provider value={contextValue}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {showLayout && <Header />}

        <main className="flex-grow">
           <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/landing" element={<Landing />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/split" element={<ProtectedRoute><SplitPage /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Catch-all for 404 Not Found */}
                <Route path="*" element={
                  <ProtectedRoute>
                    <div className="container mx-auto px-4 py-16 text-center">
                      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Not Found</h1>
                      <p className="text-gray-700">The page you are looking for does not exist.</p>
                      <Link to="/" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                        Go to Dashboard
                      </Link>
                    </div>
                  </ProtectedRoute>
                }/>
            </Routes>
           </AnimatePresence>
        </main>

        {showLayout && <Footer />}
      </div>
    </ConsistencyContext.Provider>
  );
}

export default App;