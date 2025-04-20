import Booking from '../models/booking.model.js';
import Event from '../models/event.model.js';

export const getEventStatus = (eventDate, startTime, endTime) => {
    const now = new Date();
    const start = new Date(`${eventDate}T${startTime}`);
    const end = new Date(`${eventDate}T${endTime}`);

    if (now < start) return "Upcoming";
    else if (now >= start && now <= end) return "Ongoing";
    else if (now > end) return "Completed";
    else return "Canceled"; // Optional fallback
};


export const registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId, ticketType, quantity } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const currentStatus = getEventStatus(event.eventDate, event.startTime, event.endTime);
        if (currentStatus === "Completed" || currentStatus === "Canceled") {
            return res.status(400).json({ message: `Cannot register. This event is ${currentStatus}.` });
        }


        // Get ticket price (you can fetch from event.ticketTypes later)
        const ticketPrice = event.ticketTypes?.find(t => t.type === ticketType)?.price || 0;
        const totalPrice = ticketPrice * quantity;

        // Prevent duplicate booking for same user and event (if needed)
        const alreadyBooked = await Booking.findOne({ userId, eventId, ticketType });
        if (alreadyBooked) {
            return res.status(400).json({ message: 'You have already booked this ticket type' });
        }

        const newBooking = new Booking({
            userId,
            eventId,
            ticketType,
            quantity,
            ticketPrice,
            totalPrice,
            paymentStatus: ticketPrice === 0 ? 'Paid' : 'Pending',
        });

        await newBooking.save();
        res.status(201).json({ message: 'Successfully registered for the event', booking: newBooking });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
