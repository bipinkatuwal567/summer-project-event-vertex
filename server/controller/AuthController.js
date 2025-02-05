import User from "../model/UserModel.js";

export const SignUp = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if(!username ||
            !email || 
            !password ||
            username.trim() === "" ||
            email.trim() === "" ||
            password.trim() === ""
        ){
            return res.json({message: "All fields are required!"})
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if(existingUser){
            return new Error("User already exists")
        }

        const newUser = new User({
            username,
            email,
            password,
            role: role === "organizer" || role === "admin" ? "attendee" : role, // Secure role assignment
        })

        await newUser.save();

        res.status(200).json({
            message: "User signup successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Signup failed." })
    }
}