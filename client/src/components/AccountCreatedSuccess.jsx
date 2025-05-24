import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";
import Logo from "../assets/logos.png";

const AccountCreatedSuccess = () => {
  const navigate = useNavigate();
  
  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/sign-in");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {/* <img src={Logo} className="w-16 h-16 mx-auto mb-4" alt="Logo" /> */}
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your account has been created. You can now sign in to access your account.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You will be redirected to the sign-in page in a few seconds...
        </p>

        <button
          onClick={() => navigate("/sign-in")}
          className="bg-primary-blue hover:bg-hover-blue text-white font-semibold py-3 px-6 rounded-lg transition duration-200 w-full"
        >
          Sign In Now
        </button>
      </div>
    </div>
  );
};

export default AccountCreatedSuccess;