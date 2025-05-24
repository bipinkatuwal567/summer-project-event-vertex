import React, { useEffect, useState } from "react";
import EventEditForm from "./EventEditForm";
import toast, { Toaster } from "react-hot-toast";
import BookingsModal from "./BookingsModal";
import { Pencil, Trash2, Eye, Calendar, MapPin, LayoutDashboard } from "lucide-react";

const OrganizerMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/event/organizer", {
        method: "GET"
      });
      const data = await res.json();
      setEvents(data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/event/${deletingEventId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
        setDeletingEventId(null);
        toast.success("Event deleted successfully");
      } else {
        toast.error("Failed to delete event");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-2"></div>
          <div className="h-4 w-48 bg-indigo-100 rounded"></div>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="bottom-right" />

      {/* Header section */}
      <div className="bg-white rounded-2xl shadow-sm px-6 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <LayoutDashboard size={24} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-marcellus">My Created Events</h1>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Calendar size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Events Created Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't created any events yet. Start creating events to manage them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-700">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-800 truncate">{event.title}</h2>
                  <div className="flex items-center text-gray-500">
                    <MapPin size={16} className="mr-1" />
                    <p className="text-sm truncate">{event.location}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      title="Edit Event"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingEventId(event._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedEventId(event._id)}
                    className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <Eye size={16} /> Bookings
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEventId && (
        <BookingsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {/* Edit Modal */}
      {editingEvent && (
        <EventEditForm
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={fetchEvents}
        />
      )}

      {/* Delete Modal */}
      {deletingEventId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerMyEvents;
