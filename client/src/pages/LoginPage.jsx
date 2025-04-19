import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConsistencyContext from '../context/ConsistencyContext';

const LoginPage = () => {
  const [rfid, setRfid] = useState('');
  const [error, setError] = useState('');
  const [availableRFIDs, setAvailableRFIDs] = useState([]);
  const [loadingRFIDs, setLoadingRFIDs] = useState(false);
  const { loginUser, loading } = useContext(ConsistencyContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available RFIDs when component mounts
    fetchAvailableRFIDs();
  }, []);

  const fetchAvailableRFIDs = async () => {
    setLoadingRFIDs(true);
    try {
      const response = await fetch('http://localhost:8000/gym/v1/available-rfids', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by number of records (most active first)
        const sortedRFIDs = data.rfids.sort((a, b) => b.records - a.records);
        setAvailableRFIDs(sortedRFIDs);
      }
    } catch (error) {
      console.error('Failed to fetch RFIDs:', error);
    } finally {
      setLoadingRFIDs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!rfid.trim()) {
      setError('Please enter your RFID tag number');
      return;
    }
    
    try {
      const success = await loginUser(rfid);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid RFID tag. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
      console.error(err);
    }
  };

  const selectRFID = (uid) => {
    setRfid(uid);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-white to-indigo-50 px-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FitSplit<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-gray-600">Log in with your RFID tag</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="rfid" className="block text-sm font-medium text-gray-700 mb-2">
              RFID Tag Number
            </label>
            <input
              id="rfid"
              type="text"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              placeholder="Enter your RFID tag number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Please wait...' : 'Log In'}
          </button>
        </form>
        
        {/* Available RFIDs */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Available RFID Tags:</h3>
          
          {loadingRFIDs ? (
            <div className="text-center text-sm text-gray-500">Loading available RFIDs...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableRFIDs.slice(0, 10).map((item) => (
                <button
                  key={item.uid}
                  onClick={() => selectRFID(item.uid)}
                  className="text-left text-xs bg-gray-50 hover:bg-indigo-50 px-2 py-1 rounded border border-gray-200 transition-colors"
                >
                  <span className="font-mono">{item.uid}</span>
                  <span className="block text-gray-500">{item.records} visits</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an RFID tag? Contact the gym receptionist.
          </p>
          <div className="mt-3 text-sm text-indigo-600 hover:text-indigo-500">
            <button 
              onClick={() => navigate('/landing')} 
              className="hover:underline focus:outline-none"
            >
              Visit Landing Page
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;