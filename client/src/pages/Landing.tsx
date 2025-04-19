import { useState } from "react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { CalendarIcon, BarChart2, Clock, Users, Award, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import GymTrends from "../components/GymTrends";
import WorkoutPlan from "../components/WorkoutPlan";

const Landing = () => {
  const [rfid, setRfid] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);

  const fetchUserScore = async () => {
    if (!rfid.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/gym/v1/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: rfid.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      console.log("API response:", data);
      setUserData(data);
      setActiveTab("overview");

    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error.message || "An error occurred while fetching data");

      // For demo purposes, if there's an error, load demo data
      if (error.message.includes("RFID_logs.csv")) {
        loadDemoData();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
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

    setUserData(demoData);
    setActiveTab("overview");
    setError("Using demo data due to API error");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <Badge variant="outline" className="px-4 py-2 text-indigo-700 bg-indigo-50 mb-6">
            Powered by Machine Learning
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            GymBuddy<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Analyze your gym consistency, get personalized insights, and improve your fitness journey with our RFID-powered AI assistant.
          </p>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-12">
            <Input 
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              placeholder="Enter your RFID tag number"
              className="flex-grow"
            />
            <Button 
              onClick={fetchUserScore}
              disabled={loading || !rfid.trim()} 
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Analyzing..." : "Get My Score"}
            </Button>
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* User Data Display */}
        {userData && (
          <div className="mt-12 max-w-5xl mx-auto">
            <Card className="border-2 border-indigo-100 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <span>Gym Consistency Profile</span>
                      {userData.score >= 70 ? (
                        <Badge className="bg-green-500">Excellent</Badge>
                      ) : userData.score >= 50 ? (
                        <Badge className="bg-blue-500">Good</Badge>
                      ) : userData.score >= 30 ? (
                        <Badge className="bg-yellow-500">Fair</Badge>
                      ) : (
                        <Badge className="bg-red-500">Needs Improvement</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {userData.user_type || "Gym Member"} • Last analyzed {new Date().toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">{userData.score}</div>
                    <div className="text-sm text-gray-500">Consistency Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="workout">Workout Plan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ScoreCard 
                        title="Frequency" 
                        value={userData.frequency?.percentage || 0}
                        icon={<BarChart2 className="h-5 w-5" />}
                        description={`${userData.frequency?.days_visited || 0} days out of ${userData.frequency?.total_days || 0}`}
                      />
                      <ScoreCard 
                        title="Consistency" 
                        value={userData.regularity?.consistency_metric || 0}
                        icon={<TrendingUp className="h-5 w-5" />}
                        description={`${userData.regularity?.distinct_days || 0} different days per week`}
                      />
                      <ScoreCard 
                        title="Recency" 
                        value={
                          userData.recency?.days_since_last_visit === 0 ? 100 :
                          userData.recency?.days_since_last_visit <= 2 ? 80 :
                          userData.recency?.days_since_last_visit <= 5 ? 60 :
                          userData.recency?.days_since_last_visit <= 10 ? 40 : 20
                        }
                        icon={<Clock className="h-5 w-5" />}
                        description={`${userData.recency?.days_since_last_visit || 0} days since last visit`}
                      />
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Weekly Pattern
                      </h3>
                      <div className="grid grid-cols-7 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 mb-1">{day.slice(0, 3)}</div>
                            <div 
                              className="w-full h-24 rounded-md relative"
                              style={{ 
                                backgroundColor: `rgba(99, 102, 241, ${(userData.regularity?.day_pattern?.[day] || 0) / 100})`,
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                                {userData.regularity?.day_pattern?.[day] || 0}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trends" className="space-y-4">
                    <GymTrends userData={userData} />
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-4">
                    {userData.insights?.map((insight: string, index: number) => (
                      <div key={index} className="bg-indigo-50 p-4 rounded-lg flex gap-3">
                        <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                        <p>{insight}</p>
                      </div>
                    ))}

                    {(!userData.insights || userData.insights.length === 0) && (
                      <div className="text-center p-8 text-gray-500">
                        Visit the gym more to generate personalized insights
                      </div>
                    )}

                    <div className="mt-6">
                      <h3 className="text-xl font-medium mb-4">Time of Day Preference</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {['Morning', 'Afternoon', 'Evening'].map((time) => {
                          const timeLower = time.toLowerCase();
                          const percentage = userData.regularity?.time_pattern?.[timeLower] || 0;

                          return (
                            <div key={time} className="bg-white p-4 rounded-lg border">
                              <div className="flex justify-between mb-2">
                                <span>{time}</span>
                                <span className="font-medium">{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="workout" className="space-y-4">
                    <WorkoutPlan userData={userData} />
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter>
                <p className="text-sm text-gray-500">
                  Analysis powered by Machine Learning | Last updated: {new Date().toLocaleTimeString()}
                </p>
              </CardFooter>
            </Card>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How GymBuddy Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Scan Your RFID" 
            icon={<BarChart2 className="h-6 w-6" />}
            description="Each time you visit the gym, scan your RFID card to automatically log your attendance."
          />
          <FeatureCard 
            title="ML Analysis" 
            icon={<TrendingUp className="h-6 w-6" />}
            description="Our machine learning algorithm analyzes your attendance patterns to understand your gym habits."
          />
          <FeatureCard 
            title="Personalized Insights" 
            icon={<Users className="h-6 w-6" />}
            description="Get tailored recommendations and insights to improve your consistency and results."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-indigo-900 text-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 GymBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const ScoreCard = ({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description: string }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={value} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{description}</span>
            <span className="font-medium">{value}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FeatureCard = ({ title, icon, description }: { title: string, icon: React.ReactNode, description: string }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center text-indigo-700 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Landing;