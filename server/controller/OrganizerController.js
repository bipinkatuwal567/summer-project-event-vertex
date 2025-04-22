import Event from "../model/EventModel.js"
import  Booking  from "../model/BookingModel.js"

export const getOrganizerStats = async (req, res) => {
    try {
      const organizerId = req.user.id;
  
      // Fetch events by this organizer
      const events = await Event.find({ organizerId });
  
      const eventIds = events.map((e) => e._id);
  
      // Get confirmed bookings only (paymentDetails.status === "Completed")
      const bookings = await Booking.find({
        eventId: { $in: eventIds },
        "paymentDetails.status": "COMPLETE",
      });
  
      const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  
      res.status(200).json({
        totalEvents: events.length,
        totalRegistrations: bookings.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error getting organizer stats:", error);
      res.status(500).json({ message: "Failed to fetch organizer stats" });
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
        "paymentDetails.status": "Completed",
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
  