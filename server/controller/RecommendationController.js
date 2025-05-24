import Event from "../model/EventModel.js";
import Booking from "../model/BookingModel.js";

/**
 * Get personalized event recommendations for a user
 */
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Get user's past bookings with event details
    const userBookings = await Booking.find({ userId })
      .populate({
        path: "eventId",
        select: "title category organizerId location date tickets status",
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // 2. Extract user preferences
    const userPreferences = extractUserPreferences(userBookings);

    // 3. Find upcoming events (not booked by user)
    const userBookedEventIds = userBookings.map(
      (booking) => booking.eventId._id
    );

    const upcomingEvents = await Event.find({
      _id: { $nin: userBookedEventIds },
      date: { $gte: new Date() },
      status: "Upcoming",
      isDeleted: false,
    })
      .populate({
        path: "organizerId",
        select: "username",
      })
      .limit(50);

    // 4. Score and rank events based on user preferences
    let scoredEvents = rankEventsByRelevance(upcomingEvents, userPreferences);
    
    // 5. Handle new users with no preferences (cold start)
    if (scoredEvents.length === 0 && upcomingEvents.length > 0) {
      console.log("New user with no preferences - providing popular events");
      
      // For new users, return popular events or events happening soon
      scoredEvents = upcomingEvents
        .map(event => ({
          ...event._doc,
          relevanceScore: 1 // Give all events a base score
        }))
        .sort((a, b) => {
          // Sort by date (events happening sooner first)
          return new Date(a.date) - new Date(b.date);
        });
    }

    // 6. Return top recommendations
    return res.status(200).json({
      success: true,
      message: "Recommendations retrieved successfully",
      data: scoredEvents.slice(0, 10), // Return top 10 recommendations
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      error: error.message,
    });
  }
};

/**
 * Extract user preferences from booking history
 */
const extractUserPreferences = (bookings) => {
  const preferences = {
    categories: {},
    organizers: {},
    locations: {},
  };

  bookings.forEach((booking) => {
    const event = booking.eventId;
    if (!event) return;

    // Count category preferences
    if (event.category) {
      preferences.categories[event.category] =
        (preferences.categories[event.category] || 0) + 1;
    }

    // Count organizer preferences
    if (event.organizerId) {
      const organizerId = event.organizerId._id.toString();
      preferences.organizers[organizerId] =
        (preferences.organizers[organizerId] || 0) + 1;
    }

    // Count location preferences
    if (event.location) {
      preferences.locations[event.location] =
        (preferences.locations[event.location] || 0) + 1;
    }
  });

  return preferences;
};

/**
 * Score and rank events based on user preferences
 */
const rankEventsByRelevance = (events, preferences) => {
  return events
    .map((event) => {
      let score = 0;

      // Category match (highest weight)
      if (event.category && preferences.categories[event.category]) {
        score += preferences.categories[event.category] * 3;
      }

      // Organizer match
      if (event.organizerId) {
        const organizerId = event.organizerId._id.toString();
        if (preferences.organizers[organizerId]) {
          score += preferences.organizers[organizerId] * 2;
        }
      }

      // Location match
      if (event.location && preferences.locations[event.location]) {
        score += preferences.locations[event.location] * 1;
      }

      // Add small bonus for events happening soon (within 7 days)
      const eventDate = new Date(event.date);
      const now = new Date();
      const daysDifference = Math.ceil(
        (eventDate - now) / (1000 * 60 * 60 * 24)
      );

      if (daysDifference <= 7) {
        score += 1;
      }

      // Return event with score
      return {
        ...event._doc,
        relevanceScore: score,
      };
    })
    .filter((event) => event.relevanceScore > 0) // Only return relevant events
    .sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance
};

