import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  console.log(token, "token")
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized access!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access! something else",
      });
    }
    req.user = user;
    next();
  });
};

// Organizer middleware (ensures only organizers can manage events)
export const verifyOrganizer = (req, res, next) => {
  if(req.user.role !== "organizer"){
    return res.status(403).json({
      message: "Access denied!, organizer only"
    })
  }

  next();
}


// Attendee middleware (ensures only attendee can register for events)

export const verifyAttendee = (req, res, next) => {
  if(req.user.role !== "attendee"){
    return res.status(403).json({
      message: "Access denied, attendee only"
    })
  }
  next();
}
