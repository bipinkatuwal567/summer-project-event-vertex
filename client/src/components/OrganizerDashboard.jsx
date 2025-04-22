import React, { useEffect, useState } from "react";
import EventEditForm from "./EventEditForm";
import toast, { Toaster } from "react-hot-toast";
import BookingsModal from "./BookingsModa";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/event/organizer");
      const data = await res.json();
      setEvents(data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
        alert("Failed to delete event.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading events...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="bottom-right" />

      <h1 className="text-2xl font-bold mb-6">My Created Events</h1>

      {events.length === 0 ? (
        <p>You haven’t created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow p-4 space-y-2"
            >
              <img
                src={event.banner}
                alt={event.title}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm">{event.location}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingEventId(event._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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

export default OrganizerDashboard;
