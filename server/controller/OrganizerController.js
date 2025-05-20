import Event from "../model/EventModel.js";
import Booking from "../model/BookingModel.js";

export const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Fetch organizer's events
    const events = await Event.find({ organizerId, isDeleted: false });
    const eventIds = events.map((event) => event._id);

    // 2. Get bookings for those events
    const bookings = await Booking.find({ eventId: { $in: eventIds } });

    // 3. Summary
    const totalEvents = events.length;
    const totalRegistrations = bookings.reduce((acc, b) => acc + b.quantity, 0);
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    // 4. Event-wise stats
    const eventStats = events.map((event) => {
      const ticketStats = event.tickets.map((ticket) => {
        const sold = bookings
          .filter(
            (b) =>
              b.eventId.toString() === event._id.toString() &&
              b.ticketType === ticket.type
          )
          .reduce((acc, b) => acc + b.quantity, 0);

        const revenue = sold * ticket.price;

        return {
          type: ticket.type,
          sold,
          available: ticket.availableSeats - sold,
          revenue,
        };
      });

      return {
        eventId: event._id,
        title: event.title,
        date: event.date,
        ticketStats,
      };
    });

    // 5. Paid vs Unpaid
    const paidStatusData = [
      {
        _id: "Paid",
        count: bookings.filter((b) => b.paymentDetails?.status === "COMPLETE")
          .length,
      },
      {
        _id: "Unpaid",
        count: bookings.filter(
          (b) => !b.paymentDetails || b.paymentDetails.status !== "COMPLETE"
        ).length,
      },
    ];

    // 6. Ticket Type Distribution
    const ticketTypeMap = {};
    bookings.forEach((b) => {
      if (!ticketTypeMap[b.ticketType]) ticketTypeMap[b.ticketType] = 0;
      ticketTypeMap[b.ticketType] += b.quantity;
    });
    const ticketTypeDistribution = Object.entries(ticketTypeMap).map(
      ([type, value]) => ({ _id: type, value })
    );

    const salesTrendMap = {};

    bookings.forEach((b) => {
      const dateKey = new Date(b.createdAt).toISOString().split("T")[0];
      if (!salesTrendMap[dateKey]) salesTrendMap[dateKey] = 0;
      salesTrendMap[dateKey] += b.quantity;
    });

    const salesTrend = Object.entries(salesTrendMap).map(([date, count]) => ({
      _id: date,
      count,
    }));

    const bookingsPerEventMap = {};

    bookings.forEach((b) => {
      const event = events.find(
        (e) => e._id.toString() === b.eventId.toString()
      );
      const name = event?.title || "Unknown Event";

      if (!bookingsPerEventMap[name]) bookingsPerEventMap[name] = 0;
      bookingsPerEventMap[name] += b.quantity;
    });

    const bookingsPerEvent = Object.entries(bookingsPerEventMap).map(
      ([eventName, count]) => ({ eventName, count })
    );

    res.json({
      totalEvents,
      totalRegistrations,
      totalRevenue,
      eventStats,
      paidStatusData,
      ticketTypeDistribution,
      salesTrend,
      bookingsPerEvent,
    });
  } catch (err) {
    console.error("Error getting organizer stats", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/organizerController.js
export const getEventTicketStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Get all confirmed bookings for this event
    const bookings = await Booking.find({
      eventId,
      "paymentDetails.status": "COMPLETE",
    });

    const ticketStats = {};

    for (const ticket of event.tickets) {
      const sold = bookings
        .filter((b) => b.ticketType === ticket.type)
        .reduce((sum, b) => sum + b.quantity, 0);

      ticketStats[ticket.type] = {
        sold,
        available: ticket.availableSeats - sold,
      };
    }

    res.status(200).json(ticketStats);
  } catch (error) {
    console.error("Error getting ticket stats:", error);
    res.status(500).json({ message: "Failed to fetch ticket stats" });
  }
};
