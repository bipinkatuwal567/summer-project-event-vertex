import React from "react";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

const FeaturedEventCard = ({ event }) => {
  if (!event) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image section */}
        <div className="lg:w-1/2 relative">
          <img 
            src={event.banner} 
            alt={event.title} 
            className="w-full h-64 lg:h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Featured
          </div>
          <div className="absolute bottom-4 left-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"} 
              />
            ))}
            <span className="ml-1 text-white text-sm font-medium">4.0</span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Users size={16} className="mr-1" />
                <span>{event.attendeeCount || 0} attending</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{event.title}</h2>
            
            <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm">{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm">{event.duration || '3 hours'}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 col-span-2">
                <MapPin size={18} className="mr-2 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a 
              href={`/events/${event._id}`}
              className="bg-primary-blue hover:bg-hover-blue text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              View Details
            </a>
            <a 
              href={`/events/${event._id}#tickets`}
              className="bg-white border border-primary-blue text-primary-blue hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200 text-center"
            >
              Book Tickets
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedEventCard;