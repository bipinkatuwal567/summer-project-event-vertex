import Event from "../model/EventModel.js"
import  Booking  from "../model/BookingModel.js"

export const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Fetch events created by this organizer
    const events = await Event.find({ organizerId, isDeleted: false });

    const eventIds = events.map(event => event._id);

    // 2. Get all bookings for those events
    const bookings = await Booking.find({ eventId: { $in: eventIds } });

    // 3. Summary values
    const totalEvents = events.length;
    const totalRegistrations = bookings.reduce((acc, b) => acc + b.quantity, 0);
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    // 4. Ticket stats per event with revenue calculation
    const eventStats = events.map(event => {
      const ticketStats = event.tickets.map(ticket => {
        const sold = bookings
          .filter(b => b.eventId.toString() === event._id.toString() && b.ticketType === ticket.type)
          .reduce((acc, b) => acc + b.quantity, 0);

        const revenue = sold * ticket.price; // Calculate revenue per ticket type

        return {
          type: ticket.type,
          sold,
          available: ticket.availableSeats - sold,
          revenue, // Revenue for this ticket type
        };
      });

      return {
        eventId: event._id,
        title: event.title,
        date: event.date,
        ticketStats,
      };
    });

    res.json({
      totalEvents,
      totalRegistrations,
      totalRevenue,
      eventStats,
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
  