import React, { useEffect, useRef, useState } from "react";
import { X, User, Ticket, CreditCard, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const BookingsModal = ({ eventId, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/event/${eventId}/bookings`, {
          method: "GET"
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        setBookings(data.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 font-marcellus">Event Bookings</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Try again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <Ticket size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
              <p className="text-gray-500">There are no bookings for this event yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">
                Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </p>

              {bookings.map((booking, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-5">
                    {/* Attendee Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {booking.userId?.username || "Unknown User"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {booking.userId?.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Ticket Type</p>
                          <p className="font-medium">{booking.ticketType}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-medium">Rs. {booking.totalPrice}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-medium">{booking.quantity} {booking.quantity > 1 ? 'tickets' : 'ticket'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Event Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${booking.eventId.status === "canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                            }`}
                        >
                          {booking.eventId.status === "canceled" ? (
                            <span className="flex items-center gap-1">
                              <AlertCircle size={12} />
                              Canceled
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={12} />
                              Active
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Payment:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${booking.paymentDetails.status !== "COMPLETED"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {booking.paymentDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsModal;
