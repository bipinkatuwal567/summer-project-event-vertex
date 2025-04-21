import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MyRegistrations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(bookings);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/my");

      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      } else {
        toast.error(data.message || "Failed to fetch your registrations.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">My Event Registrations</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">
          You haven’t registered for any events yet.
        </p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border rounded-xl shadow p-4"
            >
              <div className="flex items-center gap-4">
                {booking.eventId?.banner && (
                  <img
                    src={booking.eventId.banner}
                    alt="Event"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {booking.eventId?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.eventId?.date).toLocaleDateString()} •{" "}
                    {booking.eventId?.location}
                  </p>
                  <p className="mt-1">
                    <strong>Ticket:</strong> {booking.ticketType} ×{" "}
                    {booking.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs. {booking.totalPrice}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    <span className="text-sm text-green-600">
                      {booking.paymentDetails?.status === "Confirmed"
                        ? "Free - Confirmed"
                        : booking.paymentDetails?.status || "PENDING"}
                    </span>
                  </p>
                  <p>
                    <strong>Event Status:</strong>{" "}
                    <span className="capitalize">
                      {booking.eventId?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
