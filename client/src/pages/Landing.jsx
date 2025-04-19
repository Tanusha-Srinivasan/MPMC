import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, BarChart2, Clock, Users, Award, TrendingUp, CheckCircle } from "lucide-react";

const Landing = () => {
  const [rfid, setRfid] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
            <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-white rounded-full">
              Powered by Machine Learning
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            FitSplit<span className="text-indigo-600">.</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Analyze your gym consistency, get personalized insights, and improve your fitness journey with our RFID-powered AI assistant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              Get Started
            </button>
            
            <a 
              href="#features"
              className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              Learn More
            </a>
          </div>
          
          <div className="relative mt-16">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-b from-indigo-100 via-white to-indigo-50 px-4 text-sm text-gray-500">
                Powered by ML technology
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How FitSplit Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Scan Your RFID" 
            icon={<Dumbbell className="h-6 w-6" />}
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
        
        <div className="mt-16 text-center">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
          >
            Start Your Journey
          </button>
        </div>
      </section>
      
      {/* Features Detailed */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Consistency Score</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced ML algorithm analyzes your gym attendance patterns and calculates a personalized consistency score out of 100.
              </p>
              <ul className="space-y-4">
                <FeatureListItem 
                  icon={<BarChart2 className="h-5 w-5" />} 
                  title="Frequency Analysis"
                  description="We track how often you visit the gym relative to your optimal schedule."
                />
                <FeatureListItem 
                  icon={<Clock className="h-5 w-5" />} 
                  title="Recency Factor"
                  description="Recent visits are weighted more heavily than older ones."
                />
                <FeatureListItem 
                  icon={<TrendingUp className="h-5 w-5" />} 
                  title="Pattern Recognition"
                  description="We identify your workout patterns to help you maintain a consistent routine."
                />
              </ul>
            </div>
            <div className="bg-indigo-100 p-8 rounded-2xl shadow-inner">
              <div className="bg-white rounded-xl shadow-lg p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Gym Consistency Profile</h3>
                    <p className="text-sm text-gray-500">Frequent Morning Weekday</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">78</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frequency</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Consistency</span>
                      <span>76%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "76%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Recency</span>
                      <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    You maintain a highly consistent gym schedule with excellent morning routines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="FitSplit helped me establish a consistent workout routine for the first time in years. The insights are spot on!"
            author="Alex M."
            role="Member since 2024"
          />
          <TestimonialCard 
            quote="I love how the app uses ML to understand my workout patterns. The personalized recommendations have really improved my results."
            author="Sarah K."
            role="Fitness Enthusiast"
          />
          <TestimonialCard 
            quote="As a gym owner, this system has helped our members stay more consistent and engaged with their fitness goals."
            author="Mike T."
            role="Gym Owner"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Gym Experience?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join the thousands of gym-goers who are using FitSplit to track their consistency and improve their results.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all"
          >
            Get Started Today
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Dumbbell className="mr-2" />
                FitSplit
              </h2>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>© 2025 FitSplit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ title, icon, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
      <div className="mx-auto bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center text-indigo-700 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeatureListItem = ({ icon, title, description }) => {
  return (
    <li className="flex items-start">
      <div className="bg-indigo-100 p-2 rounded-full mr-4 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </li>
  );
};

const TestimonialCard = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-indigo-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>
      <p className="text-gray-600 mb-4">{quote}</p>
      <div>
        <h4 className="font-medium">{author}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default Landing;