import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Sign Up
export const SignUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (
      !username ||
      !email ||
      !password ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({ 
        status: false, 
        message: "All fields are required!" 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({
        status: false,
        message: "Username must be at least 3 characters long"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.toLowerCase().split(" ").join(""),
      email,
      password: hashedPassword,
      role: "attendee", // Force all new users to be attendees
    });

    await newUser.save();

    res.status(201).json({ message: "User signup successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Signup failed!" });
  }
};

// Login
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      return res.status(400).json({ 
        status: false, 
        message: "Email and password are required" 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email address"
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(401)
        .json({ status: false, message: "User doesn't exist!" });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { role: existingUser.role, id: existingUser._id },
      process.env.JWT_SECRET_KEY
    );

    const { password: pass, ...restData } = existingUser._doc;

    res
      .status(200)
      .cookie("access_token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
        sameSite: 'lax', // Helps with cross-site issues
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      .json({ status: true, data: restData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed!" });
  }
};

// Google Login
export const GoogleLogin = async (req, res, next) => {
  const { username, email, googlePhotoUrl } = req.body;

  try {
    console.log("Google login request for:", email);
    const userExist = await User.findOne({ email });
    
    if (userExist) {
      console.log("Existing user found:", userExist.username);
      const token = jwt.sign(
        { id: userExist._id, role: userExist.role },
        process.env.JWT_SECRET_KEY
      );

      const { password, ...restData } = userExist._doc;

      return res
        .status(200)
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })
        .json({...restData, isNewUser: false}); // Explicitly set isNewUser to false
    } else {
      // This is a new user
      console.log("Creating new user for:", email);
      
      const generateRandomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generateRandomPassword, 10);

      const newUsername = username.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4);
      
      const newUser = new User({
        username: newUsername,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        role: "attendee", // Force Google users to be attendees
      });

      await newUser.save();
      console.log("New user created:", newUsername);

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET_KEY
      );

      const { password, ...restData } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })
        .json({...restData, isNewUser: true}); // Explicitly set isNewUser to true
    }
  } catch (error) {
    console.log("Google auth error", error);
    return res.status(401).json({ status: false, message: error.message });
  }
};

// Sign Out
export const Signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({
        status: false,
        message: error.message || "Unable to sign out the user",
      });
  }
};
