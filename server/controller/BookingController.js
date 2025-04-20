import Booking from "../model/BookingModel.js";
import Event from "../model/EventModel.js";


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
        paymentStatus: 'Pending',
        createdAt: { $lt: fifteenMinsAgo },
    });

    for (const booking of expiredBookings) {
        const event = await Event.findById(booking.eventId);
        if (!event) continue;

        const ticket = event.tickets.find(t => t.type === booking.ticketType);
        if (ticket) {
            ticket.availableSeats += booking.quantity;
            await event.save();
        }

        await Booking.findByIdAndDelete(booking._id);
    }
};

// 🎟️ Event Registration
export const registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { role } = req.user;

        if (role !== "attendee") {
            return res.status(403).json({ message: "Only attendees can register for events." });
        }

        const { eventId, ticketType, quantity } = req.body;

        if (!eventId || !ticketType || !quantity) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await autoCancelUnpaidBookings(); // Clean up before new registration

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const currentStatus = getEventStatus(event.date);
        if (currentStatus === "Completed" || currentStatus === "Canceled") {
            return res.status(400).json({ message: `Cannot register. This event is ${currentStatus}.` });
        }

        const ticket = event.tickets.find(t => t.type === ticketType);
        if (!ticket) {
            return res.status(400).json({ message: 'Invalid ticket type.' });
        }

        if (ticket.availableSeats < quantity) {
            return res.status(400).json({ message: `Only ${ticket.availableSeats} seats available.` });
        }

        // Prevent duplicate only for PAID tickets
        if (ticket.price > 0) {
            const alreadyBooked = await Booking.findOne({ userId, eventId, ticketType });
            if (alreadyBooked) {
                return res.status(400).json({ message: 'You have already booked this ticket type.' });
            }
        }

        const totalPrice = ticket.price * quantity;

        const newBooking = new Booking({
            userId,
            eventId,
            ticketType,
            quantity,
            ticketPrice: ticket.price,
            totalPrice,
            paymentStatus: ticket.price === 0 ? 'Paid' : 'Pending',
        });

        await newBooking.save();

        // ✅ Always reduce availableSeats and set Paid if free
        ticket.availableSeats -= quantity;
        await event.save();

        res.status(201).json({
            message: 'Successfully registered for the event',
            booking: newBooking,
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

