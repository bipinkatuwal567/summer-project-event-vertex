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
      if (!ticket.availableSeats || ticket.availableSeats < 0) {
        return `${ticket.type} available seats must be a valid number.`;
      }
      if (ticket.type !== "Free" && (!ticket.price || ticket.price < 0)) {
        return `${ticket.type} price must be a valid number.`;
      }
    }

    return null;
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] =
      field === "price" || field === "availableSeats" ? Number(value) : value;
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <Toaster position="bottom-right" />
      <h2 className="text-2xl font-semibold mb-4">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Technology</option>
          <option>Music</option>
          <option>Business</option>
          <option>Sport</option>
          <option>Other</option>
        </select>

        <div className="space-y-2">
          <label className="block font-medium">Event Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border"
            />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium mt-4">Ticket Options</h3>
          {tickets.map((ticket, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-16 font-medium">{ticket.type}</span>
              {ticket.type !== "Free" && (
                <input
                  type="number"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketChange(index, "price", e.target.value)
                  }
                  className="p-2 border rounded w-28"
                />
              )}
              <input
                type="number"
                placeholder="Available Seats"
                value={ticket.availableSeats}
                onChange={(e) =>
                  handleTicketChange(index, "availableSeats", e.target.value)
                }
                className="p-2 border rounded w-40"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 flex text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create an Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
