import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import heroImage from "../assets/event-1.avif";
import Carousel from "./Carousel";

const HeroSection = () => {
  const { currentUser } = useSelector(state => state.user);

  // Function to scroll to event list section
  const scrollToEvents = () => {
    const eventListSection = document.getElementById('event-list-section');
    if (eventListSection) {
      eventListSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex flex-col items-center min-h-screen justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "24px 24px"
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:mt-24 xl:mt-16 lg:px-8 relative z-10">
        <div className="py-20 md:py-28 flex flex-col md:flex-row items-center">
          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 text-center md:text-left mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Experience Events Like Never Before
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              Discover, book, and attend the most exciting events in your area. From concerts and workshops to conferences and exhibitions.
            </p>

            <div className="flex gap-4 justify-center md:justify-start">
              {/* Primary action button - different based on user state */}
              {!currentUser ? (
                <Link to="/sign-up" className="block">
                  <button className="h-12 bg-primary text-white px-6 rounded-full shadow-md border-2 border-transparent hover:border-white hover:bg-primary/80 transition-all duration-300 flex items-center gap-2 group">
                    <span>Sign Up Now</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={scrollToEvents}
                  className="h-12 bg-primary text-white px-6 rounded-full shadow-md border-2 border-transparent hover:border-white hover:bg-primary/80 transition-all duration-300 flex items-center gap-2 group"
                >
                  <Search className="w-5 h-5" />
                  <span>Explore Events</span>
                </button>
              )}

              {/* Secondary action button - different based on user role */}
              {!currentUser ? (
                <Link to="/sign-in" className="block">
                  <button className="h-12 bg-transparent text-white px-6 rounded-full shadow-md border-2 border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center">
                    Sign In
                  </button>
                </Link>
              ) : currentUser.role === "organizer" ? (
                <Link to="/user-dashboard?tab=event" className="block">
                  <button className="h-12 bg-transparent text-white px-6 rounded-full shadow-md border-2 border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Create Event</span>
                  </button>
                </Link>
              ) : (
                <Link to="/user-dashboard?tab=my" className="block">
                  <button className="h-12 bg-transparent text-white px-6 rounded-full shadow-md border-2 border-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center">
                    My Registrations
                  </button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="People enjoying an event"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>

              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-blue-100">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">10k+</p>
                  <p className="text-sm text-blue-100">Attendees</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-blue-100">Categories</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12">
              New Events Daily!
            </div>
          </motion.div>

        </div>
      </div>
        <Carousel />
    </section>
  );
};

export default HeroSection;
