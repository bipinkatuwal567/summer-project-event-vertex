import React, { useEffect, useState } from "react";
import EventEditForm from "./EventEditForm";
import toast, { Toaster } from "react-hot-toast";
import BookingsModal from "./BookingsModal";
import { Pencil, Trash2, Eye, Calendar, MapPin, LayoutDashboard, Search, Filter, X } from "lucide-react";

const OrganizerMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Technology", "Music", "Business", "Sport", "Other"];

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/event/organizer", {
        method: "GET"
      });
      const data = await res.json();
      setEvents(data.data);
      setFilteredEvents(data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term and category
    const filtered = events.filter((event) => {
      const matchesSearch = searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/event/${deletingEventId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
        setFilteredEvents((prev) => prev.filter((e) => e._id !== deletingEventId));
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Created Events</h1>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Filter size={18} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 mr-3">Filter by category:</h3>
              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Clear <X size={12} className="ml-1" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center mt-6">
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
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center mt-6">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Search size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Matching Events Found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              No events match your current search or filter criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredEvents.map((event) => (
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
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                  {event.category}
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
