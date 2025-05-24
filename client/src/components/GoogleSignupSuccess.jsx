import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Logo from "../assets/logos.png";
import { useSelector } from 'react-redux';

const GoogleSignupSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state || {};
  const [countdown, setCountdown] = useState(8);
  const { currentUser } = useSelector(state => state.user);
  
  // Check if user is logged in
  useEffect(() => {
    console.log("Current user state:", currentUser);
    if (!currentUser) {
      console.warn("No user found in Redux state, might need to redirect to login");
    }
  }, [currentUser]);
  
  // Auto-redirect after 8 seconds with visible countdown
  useEffect(() => {
    console.log("Setting up redirect timer");
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("Navigating to homepage");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      console.log("Clearing timer");
      clearInterval(timer);
    };
  }, [navigate]);

  const handleHomeClick = () => {
    console.log("Home button clicked");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Event Vertex!</h1>
          <p className="text-gray-600">
            Your account has been created successfully with Google.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            {userData.profilePicture ? (
              <img 
                src={userData.profilePicture} 
                alt="Profile" 
                className="w-16 h-16 rounded-full mr-4 border-2 border-primary-blue"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {userData.username ? userData.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{userData.username || 'User'}</h2>
              <p className="text-gray-600 text-sm">{userData.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-700">Google account connected</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-700">Profile created</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-gray-700">Ready to explore events</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-6 text-center">
          You will be automatically redirected to the homepage in {countdown} seconds...
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleHomeClick}
            className="bg-primary-blue hover:bg-hover-blue text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full flex items-center justify-center"
          >
            Go to Homepage
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate("/user-dashboard")}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 w-full"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignupSuccess;

