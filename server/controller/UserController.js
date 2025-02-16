import bcrypt from "bcryptjs";
import User from "../model/UserModel.js";

export const UpdateUser = async (req, res, next) => {
  console.log(req.body);

  if (req.user.id !== req.params.userId) {
    return res
      .status(403)
      .json({ message: "Your are not allowed to update the user" });
  }

  if (req.body.password) {
    if (req.body.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username < 7 || req.body.username > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 7 and 20 characters" });
    }

    if (req.body.username.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Username cannot contain spaces" });
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: "Username can only contain letters and numbers" });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...restData } = updatedUser._doc;

    return res.status(200).json(restData);
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};
