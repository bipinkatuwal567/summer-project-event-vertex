import { validationResult } from "express-validator";
import Event from "../model/EventModel.js";
import Booking from "../model/BookingModel.js";

// Helper function for response structure
const sendResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: status < 400, // true if status code < 400
    message,
    data,
  });
};

// Helper function for validating event input
const validateEventInput = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
};

// Helper function to determine event status based on the date
const getStatusFromDate = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);

  if (event.toDateString() === now.toDateString()) {
    return "Ongoing";
  } else if (event > now) {
    return "Upcoming";
  } else {
    return "Completed";
  }
};

// Create Event
export const CreateEvent = async (req, res, next) => {
  const errors = validateEventInput(req);

  if (errors) {
    return sendResponse(res, 400, "Invalid input data", errors);
  }

  try {
    const { title, description, date, location, category, tickets, banner } = req.body;

    const now = new Date();
    const event = new Date(date);

    if (!title || !description || !date || !location || !category || !tickets || !banner) {
      return sendResponse(res, 400, "Missing required fields");
    }

    if (event.getTime() < now.getTime()){
      return sendResponse(res, 400, "This date is invalid")
    }

    const eventStatus = getStatusFromDate(date);
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      tickets,
      banner,
      organizerId: req.user.id,
      status: eventStatus, // Auto-set based on the event date
    });

    await newEvent.save();

    sendResponse(res, 200, "Event created successfully", newEvent);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Failed to create event. Please try again later");
  }
};

// Get all events
export const GetEvents = async (req, res) => {
  try {
    const userRole = req.user?.role || 'attendee'; // Default to 'attendee'
    let events;

    if (userRole === 'organizer') {
      // Organizers see only their own events
      events = await Event.find({ organizerId: req.user.id, isDeleted: false }).sort({ createdAt: -1 });
    } else {
      // Attendees see only upcoming or ongoing events
      events = await Event.find({ status: { $in: ["Upcoming", "Ongoing"] }, isDeleted: false }).sort({ createdAt: -1 });
    }

    sendResponse(res, 200, "Events fetched successfully", events);
  } catch (error) {
    console.error('Error fetching events:', error);
    sendResponse(res, 500, 'Server error');
  }
};

// Get single event by ID
export const GetEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizerId', 'username email profilePicture');

    if (!event) {
      return sendResponse(res, 404, "Event not found");
    }

    if (event.status !== "Upcoming" && event.status !== "Ongoing") {
      return sendResponse(res, 403, "You are not authorized to view this event.");
    }

    sendResponse(res, 200, "Event fetched successfully", event);
  } catch (err) {
    console.log(err);
    sendResponse(res, 500, "Server error", err.message);
  }
};

// Update Event (only organizer can edit)
export const UpdateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return sendResponse(res, 404, "Event not found");
    }

    if (event.organizerId.toString() !== req.user.id) {
      return sendResponse(res, 403, "You are not authorized to edit this event.");
    }

    const { title, description, date, location, category, tickets, banner } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.tickets = tickets || event.tickets;
    event.banner = banner || event.banner;

    const eventStatus = getStatusFromDate(event.date);
    event.status = eventStatus;

    await event.save();
    sendResponse(res, 200, "Event updated successfully", event);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Failed to update event");
  }
};

// Delete Event (only organizer can delete)
// DELETE /api/events/:id
export const DeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event by ID
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the organizer who created the event can delete it
    if (event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this event",
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};

// Soft Delete Event
export const SoftDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) return sendResponse(res, 404, "Event not found");

    if (event.organizerId.toString() !== req.user.id) {
      return sendResponse(res, 403, "Not authorized to delete this event");
    }

    event.isDeleted = true;
    event.status = "Canceled"; // optional status update
    await event.save();

    // Cancel all bookings related to this event
    await Booking.updateMany(
      { eventId: id },
      { status: "Cancelled", cancellationReason: "Event was deleted by organizer" }
    );

    sendResponse(res, 200, "Event cancelled and bookings updated");
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, "Something went wrong while cancelling event");
  }
};


// For a dedicated Organizer Dashboard, it’s cleaner and RESTful to have a separate route like: GET /api/events/organizer
export const GetEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id, isDeleted: false }).sort({ createdAt: -1 });
    sendResponse(res, 200, "Organizer events fetched successfully", events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    sendResponse(res, 500, "Failed to fetch organizer events");
  }
};

export const getBookingsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if logged-in user is the organizer of this event
    if (event.createdBy.toString() !== organizerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const bookings = await Booking.find({ event: eventId }).populate("attendee", "username email");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

