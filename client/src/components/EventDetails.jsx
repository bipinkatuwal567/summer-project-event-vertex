import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

import {
  CalendarDays,
  MapPin,
  User,
  Ticket,
  Tag,
  Info,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Poll booking status while waiting for payment
function useBookingStatus(bookingId) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) {
          setExpired(true);
          clearInterval(interval);
          return;
        }
        const data = await res.json();
        if (data.paymentStatus !== "Pending") {
          setExpired(true);
          clearInterval(interval);
        }
      } catch {
        setExpired(true);
        clearInterval(interval);
      }
    }, 30000); // check every 30 seconds
    return () => clearInterval(interval);
  }, [bookingId]);
  return expired;
}

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [ticketType, setTicketType] = useState({ type: "", price: 0 });
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [isRegistering, setIsRegistering] = useState(false);
  const [bookingIdForPolling, setBookingIdForPolling] = useState(null);
  const [bookingCreatedAt, setBookingCreatedAt] = useState(null);
  const expired = useBookingStatus(bookingIdForPolling);
  const [countdown, setCountdown] = useState(1 * 60); // 15 minutes in seconds

  // Countdown timer effect
  useEffect(() => {
    if (!bookingCreatedAt) return;
    setCountdown(1 * 60 - Math.floor((Date.now() - new Date(bookingCreatedAt)) / 1000));
    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [bookingCreatedAt]);

  const handleRegistration = async () => {
    if (!currentUser) {
      toast.error("Please sign in to register for this event");
      return;
    }
    
    if (currentUser.role !== "attendee") {
      toast.error("Only attendees can register for events.");
      return;
    }
    
    setIsRegistering(true);
    
    try {
      if (ticketType.type !== "Free") {
        // Step 1: Create booking first
        let bookingId = null;
        let totalPrice = quantity * ticketType.price;
        const bookingRes = await fetch("/api/bookings/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event._id,
            ticketType: ticketType.type,
            quantity,
          }),
        });
        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) {
          toast.error(bookingData.message || "Could not create booking");
          setIsRegistering(false);
          return;
        }
        bookingId = bookingData.booking._id;
        setBookingIdForPolling(bookingId); // Start polling after booking is created
        setBookingCreatedAt(bookingData.booking.createdAt); // Set booking creation time for countdown
        // Store bookingId and ticket info for use after payment
        localStorage.setItem('ticketinfo', JSON.stringify({
          eventId: event._id,
          ticketType,
          quantity,
          bookingId,
        }));
        // Step 2: Initiate eSewa payment
        try {
          const uuid = new Date().getTime().toString().slice(-6);
          const successUrl = `${import.meta.env.VITE_URL}/esewa/purchase-success?bookingId=${bookingId}`;
          const failUrl = `${import.meta.env.VITE_URL}/esewa/purchase-fail?bookingId=${bookingId}`;
          const jsonData = {
            amount: totalPrice.toFixed(2).toString(),
            failure_url: failUrl,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: "EPAYTEST", // Use test product code for sandbox
            signature: "",
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: successUrl,
            tax_amount: "0",
            total_amount: totalPrice.toFixed(2).toString(),
            transaction_uuid: uuid,
          };
          let url = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

          const message =
            "total_amount=" +
            jsonData.total_amount +
            ",transaction_uuid=" +
            jsonData.transaction_uuid +
            ",product_code=" +
            jsonData.product_code;
          const signature = createSignature(message);
          jsonData.signature = signature;

          const form = document.createElement("form");
          for (const key in jsonData) {
            const field = document.createElement("input");
            field.setAttribute("type", "hidden");
            field.setAttribute("name", key);
            field.setAttribute("value", jsonData[key]);
            form.appendChild(field);
          }

          form.setAttribute("method", "post");
          form.setAttribute("action", url);
          document.body.appendChild(form);
          return form.submit();
        } catch (error) {
          console.log(error);
          toast.error("Something Unexpected Happen! Please Try Again later");
        }
      } else {
        try {
          const res = await fetch("/api/bookings/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId: event._id,
              ticketType: ticketType.type,
              quantity,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            toast.success("Successfully registered!");
          } else {
            toast.error(data.message || "Something went wrong");
          }
        } catch (err) {
          console.error(err);
          toast.error("Error registering for event");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  function createSignature(message) {
    const hash = CryptoJS.HmacSHA256(message,"8gBm/:&EnhH.1/q");
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
  }
  

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching event");
        setEvent(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvent();
  }, [id]);

  if (error) {
    return (
      <p className="text-red-500 text-center mt-10 font-medium">{error}</p>
    );
  }

  if (!event) {
    return <p className="text-center mt-10 font-medium">Loading event...</p>;
  }

  // Show expired message if booking is auto-canceled
  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-3">Booking Expired</h2>
          <p className="text-base mb-4">
            Your booking has expired due to non-payment. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show countdown timer if booking is pending
  if (bookingIdForPolling && bookingCreatedAt && !expired) {
    const min = Math.floor(countdown / 60);
    const sec = countdown % 60;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-3">Complete Your Payment</h2>
          <p className="text-base mb-4">
            Please complete your payment within <span className="font-bold">{min}:{sec.toString().padStart(2, '0')}</span> minutes.<br/>
            Your booking will be auto-cancelled if payment is not completed in time.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="bottom-right" />
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-white backdrop-blur-sm px-4 py-2 rounded-md shadow-sm transition absolute z-50"
      >
        ← Back
      </button>

      {/* Banner */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={event.banner || "/default-banner.jpg"}
          alt={event.title}
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-semibold drop-shadow-lg leading-snug">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl w-full mx-auto px-4 md:px-8 py-12 space-y-12">
        {/* Event Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <DetailItem
            icon={<CalendarDays className="text-indigo-600" />}
            text={new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <DetailItem
            icon={<MapPin className="text-rose-600" />}
            text={event.location}
          />
          <DetailItem
            icon={<User className="text-green-600" />}
            text={`Organizer: ${event.organizerId?.username || "Unknown"}`}
          />
          <DetailItem
            icon={<Tag className="text-purple-600" />}
            text={`Category: ${event.category}`}
          />
          <DetailItem
            icon={<Info className="text-blue-500" />}
            text={`Status: ${event.status}`}
          />
          <DetailItem
            icon={<Users className="text-gray-700" />}
            text={`${event.attendees?.length || 0} Attending`}
          />
        </div>

        {/* Tickets */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-l-4 border-black pl-3">
            Tickets
          </h2>
          {event.tickets?.length > 0 ? (
            event.tickets.map((ticket, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-100 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Ticket className="text-yellow-600" />
                  <span className="text-base font-medium">
                    {ticket.type} –{" "}
                    {ticket.price === 0
                      ? "Free"
                      : `Rs. ${ticket.price.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm text-gray-600">
                    {ticket.availableSeats > 0
                      ? `${ticket.availableSeats} available`
                      : "Sold Out"}
                  </span>

                  {ticket.availableSeats > 0 && (
                    <>
                      <input
                        type="radio"
                        name="ticketType"
                        value={ticket.type}
                        checked={ticketType.type === ticket.type}
                        onChange={() => {
                          setTicketType({
                            type: ticket.type,
                            price: ticket.price,
                          });
                          setQuantity(1); // reset quantity to 1 on new selection
                        }}
                      />
                      {ticketType.type === ticket.type && (
                        <input
                          type="number"
                          min={1}
                          max={ticket.availableSeats}
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= ticket.availableSeats) {
                              setQuantity(val);
                            }
                          }}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Qty"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tickets listed for this event.</p>
          )}
        </section>

        {/* Description */}
        <section className="space-y-4 text-gray-800">
          <h2 className="text-2xl font-semibold border-l-4 border-black pl-3">
            About the Event
          </h2>
          <p className="text-base md:text-lg whitespace-pre-line">
            {event.description}
          </p>
        </section>

        {/* Register Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleRegistration}
            disabled={isRegistering || event.status === "Completed" || event.status === "Canceled"}
            className="w-full bg-primary-blue hover:bg-hover-blue text-white py-2 px-4 rounded-lg transition-all disabled:opacity-70"
          >
            {isRegistering ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              event.status === "Completed" || event.status === "Canceled"
                ? "Event Closed"
                : "Register Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail helper
const DetailItem = ({ icon, text }) => (
  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
    <div className="w-6 h-6">{icon}</div>
    <span className="text-base font-medium">{text}</span>
  </div>
);

export default EventDetails;
