import React, { useState, useEffect } from "react";

const EventEditForm = ({ event, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    banner: "",
    tickets: [],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date?.split("T")[0], // format date for input
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.tickets];
    updatedTickets[index][field] = field === "price" || field === "availableSeats" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        onUpdate(); // Refresh list
        onClose(); // Close modal
      } else {
        alert(result.message || "Failed to update event.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" required />
          <input type="text" name="banner" value={formData.banner} onChange={handleChange} placeholder="Banner URL" className="w-full p-2 border rounded" required />

          <div>
            <h4 className="font-semibold mb-2">Tickets</h4>
            {formData.tickets.map((ticket, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ticket.type}
                  onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                  placeholder="Type"
                  className="flex-1 p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                  placeholder="Price"
                  className="w-24 p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={ticket.availableSeats}
                  onChange={(e) => handleTicketChange(index, "availableSeats", e.target.value)}
                  placeholder="Seats"
                  className="w-24 p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditForm;
