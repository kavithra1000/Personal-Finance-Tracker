import { generateToken } from "../config/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Harsh password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // Generate token
            generateToken(newUser._id, res);

            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    isVerified: newUser.isVerified,
                },
            });
        } else {
            return res.status(400).json({ message: "User not created" });
        }

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signin = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                profilePic: user.profilePic,
                isVerified: user.isVerified,

            },
        })

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const logout = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
}

export const profile = async (req, res) => {
    try {
        const { profilePic, fullName } = req.body;

        const userId = req.user._id;

        const updateData = {};

        // Update full name if provided
        if (fullName) {
            updateData.fullName = fullName;
        }

        // Update profile picture if provided
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);

            updateData.profilePic = uploadResponse.secure_url;
        }

        // Check if nothing provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No update data provided",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error during profile update:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const me = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(req.user);
    } catch (error) {
        console.error("Error during authentication check:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}