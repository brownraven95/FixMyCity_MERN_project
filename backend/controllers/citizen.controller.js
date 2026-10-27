import bcrypt from "bcryptjs";
import Citizen from "../models/citizen.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

// @desc Register a new citizen
// @route POST /citizens/register
export const registerCitizen = async (req, res) => {
  try {
    const { fullName, email, password, phone, city } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields (fullName, email, password, phone) are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if email already exists
    const existingCitizen = await Citizen.findOne({ email: email.toLowerCase() });
    if (existingCitizen) {
      return res.status(409).json({
        success: false,
        message: "Citizen with this email already exists",
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new citizen
    const newCitizen = await Citizen.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      city: city || "Metro City",
    });

    // Generate JWT and set HttpOnly cookie
    const token = generateTokenAndSetCookie(res, newCitizen._id);

    return res.status(201).json({
      success: true,
      message: "Citizen registered successfully",
      token, // Also provided for clients storing token in headers/storage
      citizen: {
        _id: newCitizen._id,
        fullName: newCitizen.fullName,
        email: newCitizen.email,
        phone: newCitizen.phone,
        city: newCitizen.city,
        role: newCitizen.role,
        watchlist: newCitizen.watchlist,
        upvotedIssues: newCitizen.upvotedIssues,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// @desc Authenticate citizen & get token
// @route POST /citizens/login
export const loginCitizen = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find citizen (explicitly selecting password since toJSON omits it)
    const citizen = await Citizen.findOne({ email: email.toLowerCase() });
    if (!citizen) {
      // Do not reveal whether email or password was incorrect
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password with bcrypt
    const isPasswordMatch = await bcrypt.compare(password, citizen.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT and set HttpOnly cookie
    const token = generateTokenAndSetCookie(res, citizen._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      citizen: {
        _id: citizen._id,
        fullName: citizen.fullName,
        email: citizen.email,
        phone: citizen.phone,
        city: citizen.city,
        role: citizen.role,
        watchlist: citizen.watchlist,
        upvotedIssues: citizen.upvotedIssues,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @desc Get current citizen profile
// @route GET /citizens/me
export const getCitizenProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    return res.status(200).json({
      success: true,
      citizen: req.user,
    });
  } catch (error) {
    console.error("Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// @desc Logout citizen & clear cookie
// @route POST /citizens/logout
export const logoutCitizen = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// @desc Change citizen password
// @route PATCH /citizens/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const citizen = await Citizen.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, citizen.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    citizen.password = await bcrypt.hash(newPassword, salt);
    await citizen.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};
