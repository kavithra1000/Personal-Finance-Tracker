import { generateToken } from "../config/utils.js";
import * as authService from "../services/authService.js";

const ERROR_MAP = {
  MISSING_FIELDS:      { status: 400, message: "All fields are required" },
  PASSWORD_TOO_SHORT:  { status: 400, message: "Password must be at least 6 characters long" },
  USER_ALREADY_EXISTS: { status: 400, message: "User already exists" },
  INVALID_CREDENTIALS: { status: 400, message: "Invalid credentials" },
  NO_UPDATE_DATA:      { status: 400, message: "No update data provided" },
};

const handleError = (res, err) => {
  const known = ERROR_MAP[err.message];
  if (known) return res.status(known.status).json({ message: known.message });
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};

// ── Signup ────────────────────────────────────────────────────────────────────

export const signup = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    generateToken(user._id, res);
    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── Signin ────────────────────────────────────────────────────────────────────

export const signin = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
    generateToken(user._id, res);
    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────────

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

// ── Update profile ────────────────────────────────────────────────────────────

export const profile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return handleError(res, err);
  }
};

// ── Get current user ──────────────────────────────────────────────────────────

export const me = (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    return res.status(200).json(req.user);
  } catch (err) {
    return handleError(res, err);
  }
};