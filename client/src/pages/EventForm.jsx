import React, { useState } from "react";

const EventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Technology");
  const [organizerId, setOrganizerId] = useState("");
  const [banner, setBanner] = useState("");
  const [bannerPreview, setBannerPreview] = useState(null);
  const [tickets, setTickets] = useState([
    { type: "VIP", price: 0, availableSeats: 0 },
    { type: "General", price: 0, availableSeats: 0 },
    { type: "Free", price: 0, availableSeats: 0 },
  ]);

  // ✅ Using fetch for image upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setBanner(data.imageUrl); // backend should return { imageUrl: "..." }
      setBannerPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload banner image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      date,
      location,
      category,
      organizerId,
      banner, // will hold the uploaded image URL
      tickets,
      approved: false,
      status: "Upcoming",
    };

    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Event creation failed");

      const result = await response.json();
      console.log("Event created:", result);
      alert("Event created successfully");
    } catch (error) {
      console.error("Event creation error:", error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            rows="4"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Category
          </label>
          <select
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


        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Banner
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="mt-2"
          />
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Banner Preview"
              className="mt-4 rounded-md shadow-md w-full max-h-64 object-cover"
            />
          )}
        </div>

        {/* Tickets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Tickets
          </label>
          <div className="flex flex-col sm:flex-row gap-5">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-300 rounded-lg bg-gray-50"
            >
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Ticket {index + 1}
              </h3>

              {/* Ticket Type */}
              <div className="mb-2">
                <label className="block text-sm text-gray-600">
                  Ticket Type
                </label>
                <input
                disabled
                  type="text"
                  value={ticket.type}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].type = e.target.value;
                    setTickets(updatedTickets);
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g., VIP"
                />
              </div>

              {/* Price */}
              <div className="mb-2">
                <label className="block text-sm text-gray-600">Price</label>
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].price = parseFloat(e.target.value);
                    setTickets(updatedTickets);
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g., 300"
                />
              </div>

              {/* Available Seats */}
              <div>
                <label className="block text-sm text-gray-600">
                  Available Seats
                </label>
                <input
                  type="number"
                  value={ticket.availableSeats}
                  onChange={(e) => {
                    const updatedTickets = [...tickets];
                    updatedTickets[index].availableSeats = parseInt(
                      e.target.value,
                      10
                    );
                    setTickets(updatedTickets);
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
