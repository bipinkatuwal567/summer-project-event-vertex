import Event from "../model/EventModel.js";
import Booking from "../model/BookingModel.js";

export const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;
    console.log("Fetching stats for organizer:", organizerId);

    // Base query for events by this organizer
    const baseEventQuery = { organizerId: organizerId, isDeleted: false };

    // Get total events
    const totalEvents = await Event.countDocuments(baseEventQuery);
    console.log("Total events:", totalEvents);

    // Get events with their bookings
    const events = await Event.find(baseEventQuery).lean();
    const eventIds = events.map((event) => event._id);
    console.log("Found event IDs:", eventIds);

    // Get total registrations
    const totalRegistrations = await Booking.countDocuments({
      eventId: { $in: eventIds },
    });
    console.log("Total registrations:", totalRegistrations);

    // Calculate total revenue - Fix: Check for status inside paymentDetails
    const bookings = await Booking.find({
      eventId: { $in: eventIds },
      $or: [
        { "paymentDetails.status": { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } },
        { paymentStatus: { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } }
      ]
    }).lean();
    
    console.log("Found paid bookings:", bookings.length);
    
    // Fix: Calculate total revenue from totalPrice field
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.totalPrice || 0);
    }, 0);
    
    console.log("Total revenue:", totalRevenue);

    // Get sales trend (bookings over time)
    let salesTrend = [];
    try {
      // Add console log to debug
      console.log("Fetching sales trend for events:", eventIds);
      
      salesTrend = await Booking.aggregate([
        { $match: { eventId: { $in: eventIds } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      
      console.log("Sales trend results:", salesTrend);
      
      // If no sales data, provide empty placeholder data
      if (salesTrend.length === 0) {
        // Create some placeholder data for the last 7 days
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
          salesTrend.push({
            _id: dateString,
            count: 0
          });
        }
        console.log("Created placeholder sales trend data:", salesTrend);
      }
    } catch (err) {
      console.error("Error getting sales trend:", err);
    }

    // Get bookings per event
    let bookingsPerEvent = [];
    try {
      bookingsPerEvent = await Booking.aggregate([
        { $match: { eventId: { $in: eventIds } } },
        {
          $group: {
            _id: "$eventId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "event",
          },
        },
        { $unwind: "$event" },
        {
          $project: {
            eventName: "$event.title",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);
    } catch (err) {
      console.error("Error getting bookings per event:", err);
    }

    // Get paid vs unpaid registrations - Fix: Check status in paymentDetails
    const paidStatusData = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      {
        $project: {
          status: { 
            $cond: { 
              if: { $ifNull: ["$paymentDetails.status", false] }, 
              then: "$paymentDetails.status", 
              else: "$paymentStatus" 
            } 
          }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get ticket type distribution
    const ticketTypeDistribution = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      {
        $group: {
          _id: "$ticketType",
          value: { $sum: 1 },
        },
      },
    ]);

    // Get detailed stats for each event - Fix: Use availableSeats directly for available value
    const eventStats = await Promise.all(
      events.map(async (event) => {
        const ticketStats = await Promise.all(
          event.tickets.map(async (ticket) => {
            // Fetch all bookings for this ticket type
            const soldBookings = await Booking.find({
              eventId: event._id,
              ticketType: ticket.type,
            });
            // Sum the quantity field for accurate sold count
            const sold = soldBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);

            // Get paid bookings for revenue calculation - Fix: Check status in paymentDetails
            const paidBookings = await Booking.find({
              eventId: event._id,
              ticketType: ticket.type,
              $or: [
                { "paymentDetails.status": { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } },
                { paymentStatus: { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } }
              ]
            }).lean();
            // Calculate revenue from paid bookings using totalPrice
            const revenue = paidBookings.reduce((sum, booking) => {
              return sum + (booking.totalPrice || 0);
            }, 0);
            // Use availableSeats directly for available value
            const available = ticket.availableSeats || 0;
            return {
              type: ticket.type,
              sold: sold || 0,
              available: available, // Use availableSeats directly
              revenue: revenue || 0,
            };
          })
        );

        return {
          eventId: event._id,
          title: event.title,
          date: event.date,
          ticketStats,
        };
      })
    );

    // Send the response with all stats
    res.status(200).json({
      totalEvents,
      totalRegistrations,
      totalRevenue,
      salesTrend,
      bookingsPerEvent,
      paidStatusData,
      ticketTypeDistribution,
      eventStats,
    });
  } catch (error) {
    console.error("Error getting organizer stats:", error);
    res.status(500).json({ message: "Failed to get organizer statistics" });
  }
};

// controllers/organizerController.js
export const getEventTicketStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Get all confirmed bookings for this event - Fix: Check status in paymentDetails
    const bookings = await Booking.find({
      eventId,
      $or: [
        { "paymentDetails.status": { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } },
        { paymentStatus: { $in: ["paid", "PAID", "COMPLETE", "COMPLETED"] } }
      ]
    });

    const ticketStats = {};

    for (const ticket of event.tickets) {
      const sold = bookings
        .filter((b) => b.ticketType === ticket.type)
        .reduce((sum, b) => sum + (b.quantity || 1), 0);

      ticketStats[ticket.type] = {
        sold,
        available: (ticket.availableSeats || ticket.quantity || 0) - sold,
      };
    }

    res.status(200).json(ticketStats);
  } catch (error) {
    console.error("Error getting ticket stats:", error);
    res.status(500).json({ message: "Failed to fetch ticket stats" });
  }
};
