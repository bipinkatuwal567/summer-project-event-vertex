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
  try {
    console.log("auto pending start");
    const fifteenMinsAgo = new Date(Date.now() - 1 * 60 * 1000); // 15 minutes
    const bookingQuery = {
      $or: [
        { "paymentDetails.status": { $exists: false } },
        {
          "paymentDetails.status": {
            $in: [null, "", "PENDING", "Pending", "pending"],
          },
        },
      ],
      createdAt: { $lt: fifteenMinsAgo },
    };
    console.log("Booking query for expired bookings:", bookingQuery);
    const expiredBookings = await Booking.find(bookingQuery);

    console.log("Found expired bookings:", expiredBookings.length);

    for (const booking of expiredBookings) {
      console.log("Auto-cancelling booking:", booking._id, booking.createdAt);
      const event = await Event.findById(booking.eventId);
      if (!event) continue;

      const ticket = event.tickets.find((t) => t.type === booking.ticketType);
      if (ticket) {
        ticket.availableSeats += booking.quantity;
        await event.save();
      }

      console.log("auto pending finish");
      await Booking.findByIdAndDelete(booking._id);
    }
  } catch (err) {
    console.error("Error in autoCancelUnpaidBookings:", err);
  }
};

// Run auto-cancel every 5 minutes in the background
setInterval(() => {
  autoCancelUnpaidBookings();
}, 1 * 60 * 1000); // 5 minutes

// 🎟️ Event Registration
export const registerForEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.user;

    if (role !== "attendee") {
      return res
        .status(403)
        .json({ message: "Only attendees can register for events." });
    }

    const { eventId, ticketType, quantity, esewaData, bookingId } = req.body;

    if (!eventId || !ticketType || !quantity) {
      return res
        .status(400)
        .json({ message: "Please select any available ticket" });
    }

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
    let paymentDetails = null;
    let newBooking;

    if (esewaData && bookingId) {
      // This is a callback after eSewa payment, update the booking
      const decryptedEsewaData = decodeBase64(esewaData);
      paymentDetails = {
        transaction_code: decryptedEsewaData.transaction_code,
        status: decryptedEsewaData.status,
        total_amount: decryptedEsewaData.total_amount,
        transaction_uuid: decryptedEsewaData.transaction_uuid,
        product_code: decryptedEsewaData.product_code,
      };
      newBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentDetails, paymentStatus: "PAID" },
        { new: true }
      );
      // No need to reduce availableSeats again
      return res.status(200).json({
        message: "Payment confirmed and booking updated",
        booking: newBooking,
      });
    } else if (!esewaData) {
      // Create booking with Pending status before payment
      paymentDetails = { status: "PENDING" };
      newBooking = new Booking({
        userId,
        eventId,
        ticketType,
        quantity,
        ticketPrice: ticket.price,
        totalPrice,
        paymentDetails,
        paymentStatus: "Pending",
      });
      await newBooking.save();
      console.log("new booking created", newBooking._id);
      ticket.availableSeats -= quantity;
      await event.save();
      // Return bookingId so frontend can use it after eSewa payment
      return res.status(201).json({
        message: "Booking created, proceed to payment",
        booking: newBooking,
      });
    }
    // For free ticket case
    if (totalPrice === 0) {
      paymentDetails = { status: "COMPLETE" };
      newBooking = new Booking({
        userId,
        eventId,
        ticketType,
        quantity,
        ticketPrice: ticket.price,
        totalPrice,
        paymentDetails,
        paymentStatus: "PAID",
      });
      await newBooking.save();
      ticket.availableSeats -= quantity;
      await event.save();
      return res.status(201).json({
        message: "Successfully registered for the event",
        booking: newBooking,
      });
    }
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

// GET /api/bookings/:id - Get booking by ID (for polling status)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
