import React, { useEffect, useRef, useState } from "react";

const BookingsModal = ({ eventId, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  console.log(bookings);
  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/event/${eventId}/bookings`, {
          method: "GET"
        });
        const data = await res.json();
        setBookings(data.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);

  // ✅ Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative bg-white max-w-3xl w-full p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-semibold mb-4">Event Bookings</h2>
        <button
          className="absolute top-4 right-6 text-gray-600"
          onClick={onClose}
        >
          ✖
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found for this event.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <p>
                  <strong>Attendee:</strong>{" "}
                  {booking.userId?.username} ({booking.userId?.email})
                </p>
                <p>
                  <strong>Ticket Type:</strong> {booking.ticketType}
                </p>
                <p>
                  <strong>Quantity:</strong> {booking.quantity}
                </p>
                <p>
                  <strong>Total:</strong> Rs. {booking.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm uppercase 
                    ${
                      booking.eventId.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {booking.eventId.status}
                  </span>
                </p>
                <p>
                  <strong>Payment:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm 
                    ${
                      booking.paymentDetails.status !== "COMPLETED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {booking.paymentDetails.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsModal;
