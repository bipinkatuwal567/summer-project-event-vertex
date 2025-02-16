import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().split(" ").join(""),
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
    const comparePassword = await bcrypt.compareSync(
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
        role: existingUser.role,
        id: existingUser._id
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

export const GoogleLogin = async (req, res, next) => {
  const { username, email, googlePhotoUrl, role } = req.body;
  
  

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      const token = jwt.sign(
        {
          id: userExist._id,
          role: userExist.role,
        },
        process.env.JWT_SECRET_KEY
      );

      const { password, ...restData } = userExist._doc;

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(restData);
    } else {

      // If user doesn't exists creat a new one
      const generateRandomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generateRandomPassword, 10);

      const newUser = new User({
        username:
          username.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        role: role === "organizer" || role === "admin" ? "attendee" : role, // Secure role assignment
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET_KEY
      );

      const { password, ...restData } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(restData);
    }
  } catch (error) {
    console.log("Google auth error", error);
    return res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

export const Signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message || "Unable to sign out the user",
    });
  }
};
