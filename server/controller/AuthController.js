import User from "../model/UserModel.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user fills up all the required fields
    if (
      !username ||
      !email ||
      !password ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return res.json({ message: "All fields are required!" });
    }

    // check if the user already exists based on email and username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bycrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role === "organizer" || role === "admin" ? "attendee" : role, // Secure role assignment
    });

    await newUser.save();

    res.status(201).json({
      message: "User signup successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Signup failed!" });
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return res.status(401).json({
        status: false,
        message: "All fields are required!",
      });
    }

    // Check if user exist with email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        status: false,
        message: "User doesn't exists!",
      });
    }

    // Compare password
    const comparePassword = await bycrypt.compareSync(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials!",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        email: existingUser.email,
      },
      process.env.JWT_SECRET_KEY
    );

    const { password: pass, ...restData } = existingUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        status: true,
        data: restData,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed!" });
  }
};
