import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
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

export default verifyToken;
