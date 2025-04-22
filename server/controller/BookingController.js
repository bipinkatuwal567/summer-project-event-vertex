import Booking from "../model/BookingModel.js";
import Event from "../model/EventModel.js";
import { decodeBase64 } from "../utils/decodeBase64.js";

// Date status checker
export const getEventStatus = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  const eventDateOnly = new Date(event.toDateString());
  const nowDateOnly = new Date(now.toDateString());

  if (nowDateOnly < eventDateOnly) return "Upcoming";
  else if (nowDateOnly.getTime() === eventDateOnly.getTime()) return "Ongoing";
  else if (nowDateOnly > eventDateOnly) return "Completed";
  else return "Canceled";
};

// 🧠 Utility: Auto-cancel unpaid bookings older than 15 minutes
const autoCancelUnpaidBookings = async () => {
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
  const expiredBookings = await Booking.find({
    paymentStatus: "Pending",
    createdAt: { $lt: fifteenMinsAgo },
  });

  for (const booking of expiredBookings) {
    const event = await Event.findById(booking.eventId);
    if (!event) continue;

    const ticket = event.tickets.find((t) => t.type === booking.ticketType);
    if (ticket) {
      ticket.availableSeats += booking.quantity;
      await event.save();
    }

    await Booking.findByIdAndDelete(booking._id);
  }
};

// 🎟️ Event Registration
export const registerForEvent = async (req, res) => {
  console.log("Start", req.body);
  
  try {
    const userId = req.user.id;
    const { role } = req.user;

    if (role !== "attendee") {
      return res
        .status(403)
        .json({ message: "Only attendees can register for events." });
    }

    const { eventId, ticketType, quantity, esewaData } = req.body;

    if (!eventId || !ticketType || !quantity) {
      return res
        .status(400)
        .json({ message: "Please select any available ticket" });
    }

    console.log("check unpaid");
    await autoCancelUnpaidBookings(); // Clean up before new registration

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const currentStatus = getEventStatus(event.date);
    if (currentStatus === "Completed" || currentStatus === "Canceled") {
      return res
        .status(400)
        .json({ message: `Cannot register. This event is ${currentStatus}.` });
    }

    const ticket = event.tickets.find((t) => t.type === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: "Invalid ticket type." });
    }

    if (ticket.availableSeats < quantity) {
      return res
        .status(400)
        .json({ message: `Only ${ticket.availableSeats} seats available.` });
    }

    const totalPrice = ticket.price * quantity;
    let paymentDetails=null
    if (esewaData) {
      const decryptedEsewaData = decodeBase64(esewaData);
      console.log(decryptedEsewaData);
      paymentDetails = {
        transaction_code: decryptedEsewaData.transaction_code,
        status: decryptedEsewaData.status,
        total_amount: decryptedEsewaData.total_amount,
        transaction_uuid: decryptedEsewaData.transaction_uuid,
        product_code: decryptedEsewaData.product_code,
      };
    }else if (totalPrice === 0) {
      // ✅ Free ticket case — mark as confirmed
      paymentDetails = {
        status: "COMPLETE",
      };
    }

    console.log("new booking");
    const newBooking = new Booking({
      userId,
      eventId,
      ticketType,
      quantity,
      ticketPrice: ticket.price,
      totalPrice,
      paymentDetails,
    });

    await newBooking.save();

    // ✅ Always reduce availableSeats and set Paid if free
    ticket.availableSeats -= quantity;
    await event.save();

    res.status(201).json({
      message: "Successfully registered for the event",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    

    const bookings = await Booking.find({ userId })
      .populate({
        path: "eventId",
        select: "title date location banner category status",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user's bookings", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

