import React, { useState } from "react";
import { Send, Check } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to your API
    console.log("Newsletter signup:", email);
    setSubmitted(true);
    setEmail("");
    
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Event Vertex</h2>
            <p className="text-indigo-200 max-w-md">
              Subscribe to our newsletter and never miss out on exciting events and exclusive offers tailored just for you.
            </p>
          </div>
          
          <div className="lg:w-1/2 w-full max-w-md">
            {submitted ? (
              <div className="bg-indigo-800 rounded-lg p-4 flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-3">
                  <Check size={18} className="text-white" />
                </div>
                <p className="text-white">Thanks for subscribing! We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-indigo-800 border border-indigo-700 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-indigo-900 hover:bg-indigo-100 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  Subscribe
                  <Send size={16} className="ml-2" />
                </button>
              </form>
            )}
            
            <p className="text-indigo-300 text-sm mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;