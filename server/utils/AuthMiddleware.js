import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  

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
        message: "Unauthorized access!",
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

// Admin middleware (ensures only admins can access certain routes)
export const verifyAdmin = (req, res, next) => {
  if(req.user.role !== "admin"){
    return res.status(403).json({
      message: "Access denied!, admin only"
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
