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
