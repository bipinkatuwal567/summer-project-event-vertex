import {Event} from "../model/EventModel.js"
import {Booking} from "../model/BookingModel.js"

export const getOrganizerStats = async (req, res) => {
    try {
        const organizerId = req.user.id;

        const events = await Event.find({ organizer: organizerId });

        const eventIds = events.map((e) => e._id);

        const bookings = await Booking.find({ event: { $in: eventIds }, status: 'confirmed' });

        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

        res.status(200).json({
            totalEvents: events.length,
            totalRegistrations: bookings.length,
            totalRevenue,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to load organizer stats' });
    }
};
