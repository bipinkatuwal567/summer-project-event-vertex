import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Calendar, MapPin } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["Technology", "Music", "Business", "Sport", "Other"];

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/event");
      const data = await res.json();

      if (data.success) {
        setEvents(data.data);
        setFilteredEvents(data.data);
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

  useEffect(() => {
    // Listen for category selection events from the Home page
    const handleCategorySelect = (event) => {
      setSelectedCategory(event.detail.category);
      setShowFilters(true); // Show filters when a category is selected
    };
    
    window.addEventListener('selectCategory', handleCategorySelect);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('selectCategory', handleCategorySelect);
    };
  }, []);

  useEffect(() => {
    // Filter events based on search term and category
    const filtered = events.filter((event) => {
      const matchesSearch = searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

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

  if (loading) {
    return <p className="text-center text-gray-600 py-6">Loading events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-600 py-6">No events found.</p>;
  }

  return (
    <main className="flex flex-col flex-grow bg-white w-full mx-auto justify-center overflow-x-hidden pt-8 px-8 py-3">
      <h2 className="text-3xl font-bold mb-6 text-start">Upcoming Events</h2>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by title, description or location..."
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
            <span>Filter</span>
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No matching events found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {filteredEvents.map((event) => (
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className="px-2 py-1 bg-indigo-50 rounded-full text-xs text-indigo-700 font-medium">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin size={14} className="mr-1" />
                  <span>{event.location}</span>
                </div>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {event.description}
                </p>
                <Link
                  to={`/events/${event._id}`}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default EventList;
