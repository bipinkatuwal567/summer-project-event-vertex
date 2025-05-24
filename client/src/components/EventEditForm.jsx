import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { X, Calendar, MapPin, Tag, Image, Ticket } from "lucide-react";

const EventEditForm = ({ event, onClose, onUpdate }) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    banner: "",
    tickets: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    formDataImage.append("upload_preset", uploadPreset);

    try {
      toast.loading("Uploading image...");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formDataImage,
        }
      );

      const data = await res.json();
      toast.dismiss();

      if (data.secure_url) {
        setUploadedImageURL(data.secure_url);
        setFormData({...formData, banner: data.secure_url});
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
    updatedTickets[index][field] =
      field === "price" || field === "availableSeats" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/event/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Event updated successfully");
        onUpdate(); // Refresh list
        onClose(); // Close modal
      } else {
        toast.error(result.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Toaster position="bottom-right" />
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 font-marcellus">Edit Event</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event"
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="mr-1 text-indigo-600" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
                  required
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={16} className="mr-1 text-indigo-600" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Tag size={16} className="mr-1 text-indigo-600" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Sport">Sport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Image size={16} className="mr-1 text-indigo-600" />
                  Event Banner
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload" className="cursor-pointer">
                    {!previewImage && !formData.banner ? (
                      <div className="space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload banner image</p>
                        <p className="text-xs text-gray-400">(Max 2MB)</p>
                      </div>
                    ) : (
                      <img
                        src={previewImage || formData.banner}
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
            <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-800">
              <Ticket size={18} className="mr-2 text-indigo-600" />
              Ticket Options
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              {formData.tickets.map((ticket, index) => (
                <div key={index} className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs text-gray-500 mb-1">Ticket Type</label>
                    <input
                      type="text"
                      value={ticket.type}
                      onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                      placeholder="Type"
                      className="p-2 border border-gray-300 rounded-lg w-full sm:w-32 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      placeholder="Price"
                      className="p-2 border border-gray-300 rounded-lg w-28 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Available Seats</label>
                    <input
                      type="number"
                      value={ticket.availableSeats}
                      onChange={(e) => handleTicketChange(index, "availableSeats", e.target.value)}
                      placeholder="Seats"
                      className="p-2 border border-gray-300 rounded-lg w-28 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary-blue hover:bg-hover-blue text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditForm;
