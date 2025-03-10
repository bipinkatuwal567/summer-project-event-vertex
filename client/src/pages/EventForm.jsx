import React, { useState } from 'react';
// import axios from 'axios';

const EventForm = () => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Technology');
  const [organizerId, setOrganizerId] = useState('');
  const [banner, setBanner] = useState('');
  const [tickets, setTickets] = useState([
    { type: 'VIP', price: 300, availableSeats: 100 },
    { type: 'General', price: 75, availableSeats: 500 },
    { type: 'Free', price: 0, availableSeats: 200 },
  ]);

  // Form submission handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Collect form data into an object
//     const eventData = {
//       title,
//       description,
//       date,
//       location,
//       category,
//       organizerId,
//       banner,
//       tickets,
//       approved: false,
//       status: 'Upcoming',
//     };

//     try {
//       // Send the data to your backend (replace with your actual backend API)
//       const response = await axios.post('/api/events/create', eventData);
//       console.log('Event created successfully:', response.data);
//       alert('Event created successfully');
//     } catch (error) {
//       console.error('Error creating event:', error);
//       alert('Failed to create event');
//     }
//   };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Event</h2>
      
      <form  className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Enter event description"
            rows="4"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Event Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Enter event location"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Event Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          >
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Business">Business</option>
            <option value="Sport">Sport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Organizer ID */}
        <div>
          <label htmlFor="organizerId" className="block text-sm font-medium text-gray-700">Organizer ID</label>
          <input
            type="text"
            id="organizerId"
            value={organizerId}
            onChange={(e) => setOrganizerId(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Enter organizer ID"
            required
          />
        </div>

        {/* Banner */}
        <div>
          <label htmlFor="banner" className="block text-sm font-medium text-gray-700">Event Banner URL</label>
          <input
            type="url"
            id="banner"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Enter banner image URL"
          />
        </div>

        {/* Tickets */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Tickets</label>
          {tickets.map((ticket, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={ticket.type}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].type = e.target.value;
                    setTickets(updatedTickets);
                  }}
                  className="p-2 border border-gray-300 rounded-md w-32"
                />
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].price = e.target.value;
                    setTickets(updatedTickets);
                  }}
                  className="p-2 border border-gray-300 rounded-md w-32"
                  placeholder="Price"
                />
                <input
                  type="number"
                  value={ticket.availableSeats}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].availableSeats = e.target.value;
                    setTickets(updatedTickets);
                  }}
                  className="p-2 border border-gray-300 rounded-md w-32"
                  placeholder="Seats"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
