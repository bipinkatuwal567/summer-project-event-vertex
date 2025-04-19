import { validationResult } from "express-validator"
import Event from "../model/EventModel.js";

const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        success: status < 400, // Sends true if status code is less than 400
        message,
        data
    })
}

const validateEventInput = (req) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return errors.array();
    }

    return null;
}

// Helper function to determine event status based on current date
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


export const CreateEvent = async (req, res, next) => {
    console.log(req.body);

    const errors = validateEventInput(req);

    if (errors) {
        return sendResponse(res, 400, "Invalid input data", errors);
    }

    try {
        const { title, description, date, location, category, tickets, banner } = req.body;

        if (!title || !description || !date || !location || !category || !tickets || !banner) {
            return sendResponse(res, 400, "Missing required fields");
        }

        const eventStatus = getStatusFromDate(date);
        const newEvent = await Event({
            title,
            description,
            date,
            location,
            category,
            tickets,
            banner,
            organizerId: req.user.id,
            status: eventStatus, // Auto-set based on date
        })

        await newEvent.save();

        sendResponse(res, 200, "Event created successfully, awaiting approval", newEvent);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed to create event. Please try again later")
    }
}

export const GetEvents = async (req, res) => {
    try {
        let events;
    
        if (userRole === 'admin') {
          // Admin gets all events (approved + pending)
          events = await Event.find().sort({ createdAt: -1 });
        } else {
          // Public users and organizers only see approved events
          events = await Event.find({ status: 'approved' }).sort({ createdAt: -1 });
        }
    
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
}
