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

    if(!errors.isEmpty()){
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
    const errors = validateEventInput(req);

    if(errors){
        return sendResponse(res, 400, "Invalid input data", errors);
    }

    try {
        const eventStatus = getStatusFromDate(req.body.date);
        const newEvent = await Event({
            ...req.body, 
            organizerId: req.user.id, 
            status: eventStatus, // Auto-set based on date
        })

        await newEvent.save();

        sendResponse(res, 200, "Event reated successfully, awaiting approval", newEvent);
    } catch (error) {
        console.log(error);
        sendResponse(res, 500, "Failed to create event. Please try again later")
    }
}