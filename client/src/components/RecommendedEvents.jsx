import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRecommendedEvents } from "../services/recommendationService";
import { CalendarDays, MapPin } from "lucide-react";

const RecommendedEvents = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const events = await fetchRecommendedEvents();
        setRecommendations(events);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8 mx-auto bg-white">
        <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-[320px] bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <div className="w-full py-8 px-8 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recommendations.map((event) => (
          <div
            key={event._id}
            className="min-w-[280px] bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={event.banner || "/default-event-image.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {event.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <CalendarDays size={16} className="mr-1" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin size={16} className="mr-1" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {event.category}
                </span>
                <span className="text-sm font-medium">
                  {event.tickets && event.tickets.length > 0
                    ? event.tickets[0].price === 0
                      ? "Free"
                      : `Rs.${event.tickets[0].price}`
                    : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedEvents;