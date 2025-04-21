import React, { useState } from "react";

const PaymentComponent = () => {
  const [amount, setAmount] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    const pid = `TXN_${Date.now()}`;
    const redirectUrl = `https://uat.esewa.com.np/epay/main?amt=${amount}&pdc=0&psc=0&txAmt=0&scd=EPAYTEST&pid=${pid}&su=http://localhost:3000/esewa-success?q=success&pid=${pid}&amt=${amount}&fu=http://localhost:3000/esewa-failure?q=failure`;

    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          eSewa Payment
        </h1>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Enter Amount (NPR)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Pay with eSewa
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Redirects to eSewa sandbox (UAT) for testing.
        </p>
      </div>
    </div>
  );
};

export default PaymentComponent;
