import React from "react";
import { useNavigate } from "react-router";
import { XCircle } from "lucide-react";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed!</h1>
        <p className="text-gray-600 mb-6">There was an issue with your payment. Please try again.</p>

        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Failure;
