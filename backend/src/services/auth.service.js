import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

// ── Signup ────────────────────────────────────────────────────────────────────

export const registerUser = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw new Error("MISSING_FIELDS");
  }

  if (password.length < 6) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ fullName, email, password: hashedPassword });
  await newUser.save();

  return {
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    isVerified: newUser.isVerified,
  };
};

// ── Signin ────────────────────────────────────────────────────────────────────

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("MISSING_FIELDS");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
    isVerified: user.isVerified,
  };
};

// ── Update profile ────────────────────────────────────────────────────────────

export const updateUserProfile = async (userId, { fullName, profilePic }) => {
  const updateData = {};

  if (fullName) {
    updateData.fullName = fullName;
  }

  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    updateData.profilePic = uploadResponse.secure_url;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("NO_UPDATE_DATA");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");

  return updatedUser;
};