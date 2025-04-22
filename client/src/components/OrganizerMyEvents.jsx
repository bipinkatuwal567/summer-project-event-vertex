import React, { useEffect, useState } from "react";
import EventEditForm from "./EventEditForm";
import toast, { Toaster } from "react-hot-toast";
import BookingsModal from "./BookingsModal";
import { Pencil, Trash2, Eye } from "lucide-react";

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
           className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
         >
           <img
             src={event.banner}
             alt={event.title}
             className="h-48 w-full object-cover"
           />
           <div className="p-4 flex flex-col justify-between flex-grow">
             <div className="space-y-1">
               <h2 className="text-lg font-bold truncate">{event.title}</h2>
               <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
               <p className="text-sm text-gray-600 truncate">{event.location}</p>
             </div>
         
             <div className="flex justify-between items-center mt-4">
               <div className="flex gap-2">
                 <button
                   onClick={() => setEditingEvent(event)}
                   className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                   title="Edit Event"
                 >
                   <Pencil size={18} />
                 </button>
                 <button
                   onClick={() => setDeletingEventId(event._id)}
                   className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                   title="Delete Event"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
         
               <button
                 onClick={() => setSelectedEventId(event._id)}
                 className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
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

export default OrganizerMyEvents;
