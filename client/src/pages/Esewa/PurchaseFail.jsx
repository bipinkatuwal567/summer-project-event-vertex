const PurchaseFail = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Payment Failed</h2>
          <p className="text-lg mb-6">Unfortunately, your eSewa payment was not successful. Please try again or contact support.</p>
          <a 
            href="/" 
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-all"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  };
  
  export default PurchaseFail;