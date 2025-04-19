import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(events);
  

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/event");
      const data = await res.json();

      console.log(data);
      
      if (data.success) {
        setEvents(data.data);
      } else {
        console.error("Failed to fetch events:", data.message);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 py-6">Loading events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-600 py-6">No events found.</p>;
  }

  return (
    <main className="flex flex-col flex-grow w-full mx-auto justify-center overflow-x-hidden mt-10 px-8 py-3">
      <h2 className="text-3xl font-bold mb-6 text-center font-marcellus">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {event.description}
              </p>
              <Link
                to={`/event/${event._id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default EventList;
