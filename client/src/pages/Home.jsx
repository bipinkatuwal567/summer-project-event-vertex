import React from "react";
import { useSelector } from "react-redux";
import RecommendedEvents from "../components/RecommendedEvents";
import HeroSection from '../components/HeroSection.jsx'
import Carousel from '../components/Carousel.jsx'
import EventList from '../components/EventList.jsx'

const Home = () => {
  const { currentUser } = useSelector(state => state.user);
  
  return (
    <div className="w-full">
      <HeroSection />
      <Carousel />
      {currentUser && <RecommendedEvents />}
      <EventList />
    </div>
  );
};

export default Home
