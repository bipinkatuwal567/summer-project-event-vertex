import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EventForm = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tickets, setTickets] = useState([
    { type: "VIP", price: "", availableSeats: "" },
    { type: "General", price: "", availableSeats: "" },
    { type: "Free", price: 0, availableSeats: "" },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState("");

  const validateForm = () => {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!date) return "Event date is required.";
    if (!location.trim()) return "Location is required.";
    if (!category) return "Category is required.";
    if (!uploadedImageURL) return "Please upload a banner image.";

    for (let ticket of tickets) {
      if (ticket.availableSeats === undefined || ticket.availableSeats === null || ticket.availableSeats < 0) {
        return `${ticket.type} available seats must be a valid number.`;
      }
      // Only validate price if availableSeats > 0
      if (ticket.availableSeats > 0 && ticket.type !== "Free" && (!ticket.price || ticket.price < 0)) {
        return `${ticket.type} price must be a valid number.`;
      }
    }
    return null;
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...tickets];
    if (field === "availableSeats") {
      newTickets[index][field] = Number(value);
      // If availableSeats is set to 0, clear price
      if (Number(value) === 0) {
        newTickets[index].price = "";
      }
    } else if (field === "price") {
      // Only allow price entry if availableSeats > 0
      if (newTickets[index].availableSeats > 0) {
        newTickets[index][field] = Number(value);
      }
    } else {
      newTickets[index][field] = value;
    }
    setTickets(newTickets);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB.");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setImageFile(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      toast.loading("Uploading image...");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss();

      if (data.secure_url) {
        setUploadedImageURL(data.secure_url);
        toast.success("Image uploaded!");
      } else {
        throw new Error("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Image upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const eventData = {
      title,
      description,
      date,
      location,
      category,
      tickets,
      banner: uploadedImageURL,
    };

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Event created successfully!");
        // reset form here
        // ✅ Reset form here
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setCategory("Technology");
        setTickets([
          { type: "VIP", price: "", availableSeats: "" },
          { type: "General", price: "", availableSeats: "" },
          { type: "Free", price: 0, availableSeats: "" },
        ]);
        setImageFile(null);
        setPreviewImage(null);
        setUploadedImageURL("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl my-10">
      <Toaster position="bottom-right" />
      <h2 className="text-3xl font-bold mb-6 text-gray-800 font-inter">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Describe your event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Event location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition bg-white"
              >
                <option>Technology</option>
                <option>Music</option>
                <option>Business</option>
                <option>Sport</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Banner</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="banner-upload"
                />
                <label htmlFor="banner-upload" className="cursor-pointer">
                  {!previewImage ? (
                    <div className="space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload banner image</p>
                      <p className="text-xs text-gray-400">(Max 2MB)</p>
                    </div>
                  ) : (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket section - full width */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Ticket Options</h3>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            {tickets.map((ticket, index) => (
              <div key={index} className="flex flex-wrap items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                <span className="w-20 font-medium text-gray-700">{ticket.type}</span>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Available Seats</label>
                  <input
                    type="number"
                    placeholder="Seats"
                    value={ticket.availableSeats}
                    onChange={(e) => handleTicketChange(index, "availableSeats", e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-28 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  />
                </div>
                {ticket.type !== "Free" && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg w-28 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      disabled={ticket.availableSeats === 0}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-hover-blue transition-colors shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
