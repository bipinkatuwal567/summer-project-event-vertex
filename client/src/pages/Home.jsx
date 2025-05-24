import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import RecommendedEvents from "../components/RecommendedEvents";
import HeroSection from '../components/HeroSection';
import EventList from '../components/EventList';
import NewsletterSignup from '../components/NewsletterSignup';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const { currentUser } = useSelector(state => state.user);
  
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Personalized Recommendations */}
      {currentUser && <RecommendedEvents />}
      
      {/* Main Event List - with ID for scrolling */}
      <div id="event-list-section">
        <EventList />
      </div>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  );
};

export default Home
