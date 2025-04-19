import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  User,
  Ticket,
  Tag,
  Info,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching event");
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvent();
  }, [id]);

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10 font-medium">{error}</p>
    );
  }

  if (!event) {
    return <p className="text-center mt-10 font-medium">Loading event...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md shadow-sm transition"
        >
          ← Back
        </button>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={event.banner || "/default-banner.jpg"}
          alt={event.title}
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-semibold drop-shadow-lg leading-snug">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-12 space-y-12">
        {/* Event Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <DetailItem
            icon={<CalendarDays className="text-indigo-600" />}
            text={new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <DetailItem
            icon={<MapPin className="text-rose-600" />}
            text={event.location}
          />
          <DetailItem
            icon={<User className="text-green-600" />}
            text={`Organizer: ${event.organizerId?.username || "Unknown"}`}
          />
          <DetailItem
            icon={<Tag className="text-purple-600" />}
            text={`Category: ${event.category}`}
          />
          <DetailItem
            icon={<Info className="text-blue-500" />}
            text={`Status: ${event.status}`}
          />
          <DetailItem
            icon={<Users className="text-gray-700" />}
            text={`${event.attendees?.length || 0} Attending`}
          />
        </div>

        {/* Tickets */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-l-4 border-black pl-3">
            Tickets
          </h2>
          {event.tickets?.length > 0 ? (
            event.tickets.map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg"
              >
                <div className="flex gap-3 items-center">
                  <Ticket className="text-yellow-600" />
                  <span className="text-base font-medium">
                    {ticket.type} –{" "}
                    {ticket.type === "Free"
                      ? "Free"
                      : `Rs. ${ticket.price.toFixed(2)}`}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {ticket.availableSeats > 0
                    ? `${ticket.availableSeats} available`
                    : "Sold Out"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tickets listed for this event.</p>
          )}
        </section>

        {/* Description */}
        <section className="space-y-4 text-gray-800">
          <h2 className="text-2xl font-semibold border-l-4 border-black pl-3">
            About the Event
          </h2>
          <p className="text-base md:text-lg whitespace-pre-line">
            {event.description}
          </p>
        </section>

        {/* Book Button */}
        <div className="flex justify-center pt-4">
          <button
            className="bg-black hover:bg-gray-900 text-white text-lg font-medium px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 duration-200"
            disabled
          >
            Book Tickets (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail helper
const DetailItem = ({ icon, text }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="w-6 h-6">{icon}</div>
    <span className="text-base font-medium">{text}</span>
  </div>
);

export default EventDetails;
