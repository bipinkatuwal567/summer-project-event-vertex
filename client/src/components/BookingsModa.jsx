import React, { useEffect, useState } from "react";

const BookingsModal = ({ eventId, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/events/${eventId}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white max-w-3xl w-full p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Event Bookings</h2>
        <button className="absolute top-4 right-6 text-gray-600" onClick={onClose}>✖</button>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found for this event.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <p><strong>Attendee:</strong> {booking.attendee?.username} ({booking.attendee?.email})</p>
                <p><strong>Ticket Type:</strong> {booking.ticketType}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Total:</strong> Rs. {booking.totalPrice}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm 
                    ${booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {booking.status}
                  </span>
                </p>
                <p>
                  <strong>Payment:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm 
                    ${booking.paymentStatus === "unpaid" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                    {booking.paymentStatus}
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
