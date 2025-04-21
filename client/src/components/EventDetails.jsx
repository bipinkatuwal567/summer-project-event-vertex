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

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [ticketType, setTicketType] = useState({ type: "", price: 0 });
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user)
  console.log(currentUser);
  

  const handleRegister = async () => {
   if(currentUser.role !== "attendee"){
    toast.error("Only attendees can register for events.")
    return;
   }else{
    if (ticketType.type !== "Free") {
      const totalPrice = quantity * ticketType.price
      console.log(totalPrice)
      localStorage.setItem('ticketinfo',JSON.stringify({
        eventId: event._id,
        ticketType,
        quantity,
      }),)
      try {
        const uuid = new Date().getTime().toString().slice(-6);
        const jsonData = {
          amount: totalPrice.toFixed(2).toString(),
          failure_url: `${import.meta.env.VITE_URL}/esewa/purchase-fail`,
          product_delivery_charge: "0",
          product_service_charge: "0",
          product_code: "EPAYTEST",
          signature: "",
          signed_field_names: "total_amount,transaction_uuid,product_code",

          success_url: `${import.meta.env.VITE_URL}/esewa/purchase-success`,
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
        console.log(error)
        toast.error("Something Unexpected Happen! Please Try Again later");
      } 
    }
    else {
      try {
        const res = await fetch("/api/bookings/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          ticketType:ticketType.type,
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
            className="bg-black hover:bg-gray-900 text-white text-lg font-medium px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105 duration-200"
            onClick={handleRegister}
            disabled={
              event.status === "Completed" || event.status === "Canceled"
            }
          >
            {event.status === "Completed" || event.status === "Canceled"
              ? "Event Closed"
              : "Book Tickets"}
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
